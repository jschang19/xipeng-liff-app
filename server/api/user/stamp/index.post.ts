import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";
import type { Stamp } from "~/types";

export default defineAuthEventHandler(async (event, user) => {
  const STAMP_LIMIT = 9;
  // get target participant id from request body
  // we will get booth id from user id, since the user who scan the qr code is the booth owner
  const { participantId } = await readBody(event);

  if (!participantId) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Invalid request",
      displayMessage: "請掃描正確的 QR Code"
    };
  }

  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const [
    { data: participant, error: participantError },
    { data: staffRecord, error: staffRecordError }
  ] = await Promise.all([
    // get participant uuid
    supabaseService
      .from("user")
      .select("id")
      .eq("line_id", participantId)
      .maybeSingle(),
    // get staff uuid
    supabaseService
      .from("booth_staff")
      .select("*")
      .eq("user_id", user.uuid)
      .maybeSingle()
  ]);

  if (participantError || staffRecordError) {
    setResponseStatus(event, 500);
    console.error(participantError || staffRecordError);
    return {
      status: "error",
      message: "Failed to fetch data"
    };
  }

  if (!staffRecord) {
    setResponseStatus(event, 403);
    return {
      status: "error",
      message: "You are not a staff"
    };
  }

  if (!participant) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Participant not found"
    };
  }

  // check if the participant has more than 16 stamps
  const { count: stampCount, error: stampCountError } = await supabaseService
    .from("stamp")
    .select("*", { count: "exact", head: true })
    .eq("user_id", participant.id);

  if (stampCountError || stampCount === null) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Failed to get stamp data"
    };
  }

  if (stampCount >= STAMP_LIMIT) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Participant already has 9 stamps",
      displayMessage: "使用者已經有 9 個蓋章囉！"
    };
  }

  if (user.type.speaker) {
    // check if the participant already has speaker stamp from the speaker
    const { count: speakerStampCount, error: speakerStampError } =
      await supabaseService
        .from("stamp")
        .select("*", { count: "exact" })
        .eq("user_id", participant.id)
        .eq("type", "speaker")
        .eq("scanned_by", user.uuid);

    if (speakerStampError || speakerStampCount === null) {
      setResponseStatus(event, 500);
      return {
        status: "error",
        message: "Failed to get stamp data"
      };
    }

    if (speakerStampCount > 0) {
      setResponseStatus(event, 400);
      return {
        status: "error",
        message: "Participant already has speaker stamp",
        displayMessage: "使用者已經有你的蓋章囉！"
      };
    }

    // add speaker stamp to participant
    const { error: stampError } = await supabaseService.from("stamp").insert({
      type: "speaker",
      user_id: participant.id,
      booth_id: staffRecord.booth_id,
      scanned_by: user.uuid
    });

    if (stampError) {
      setResponseStatus(event, 500);
      return {
        status: "error",
        message: "Failed to add stamp"
      };
    }
  } else {
    // check if the participant already has booth stamp from the booth
    const { count: boothStampCount, error: boothStampError } =
      await supabaseService
        .from("stamp")
        .select("*", { count: "exact" })
        .eq("user_id", participant.id)
        .eq("type", "booth")
        .eq("booth_id", staffRecord.booth_id);

    if (boothStampError || boothStampCount === null) {
      setResponseStatus(event, 500);
      return {
        status: "error",
        message: "Failed to get stamp data"
      };
    }

    if (boothStampCount > 0) {
      setResponseStatus(event, 400);
      return {
        status: "error",
        message: "Participant already has booth stamp",
        displayMessage: "使用者已經有你的蓋章囉！"
      };
    }

    // add staff stamp to participant
    const { error: stampError } = await supabaseService.from("stamp").insert({
      type: "booth",
      user_id: participant.id,
      booth_id: staffRecord.booth_id,
      scanned_by: user.uuid
    });

    if (stampError) {
      setResponseStatus(event, 500);
      return {
        status: "error",
        message: "Failed to add stamp"
      };
    }
  }

  const [
    { data: newStamps, error: newStampsError, count: newStampCount },
    { error: couponError, count: couponCount }
  ] = await Promise.all([
    supabaseService
      .from("stamp")
      .select("*", {
        count: "exact"
      })
      .eq("user_id", participant.id),
    supabaseService
      .from("user_coupon")
      .select("*", { count: "exact", head: true })
      .eq("user_id", participant.id)
  ]);

  if (newStampsError || newStampCount === null) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Failed to get stamp data"
    };
  }

  if (couponError || couponCount === null) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Failed to get coupon data"
    };
  }

  // 如果 newStampCount 是 3 的倍數
  if (newStampCount % 3 === 0) {
    // 如果是第一次達成 3 的倍數，發送 coupon
    if (newStampCount === 3 && couponCount === 0) {
      await $fetch("/api/coupons/reward", {
        method: "POST",
        headers: {
          content_type: "application/json",
          authorization: getRequestHeaders(event).authorization!
        },
        body: {
          participantId: participant.id
        }
      });
    }

    if (checkStampFulfilled(newStamps)) {
      // insert a record to draw_list
      const { error: drawListError } = await supabaseService
        .from("draw_list")
        .insert({
          user_id: participant.id
        });

      if (drawListError) {
        setResponseStatus(event, 500);
        return {
          status: "error",
          message: "Failed to add draw list"
        };
      }
    }
  }

  // return status code
  return {
    status: "ok"
  };
});

function checkStampFulfilled (stamps: {
  type: Stamp["type"];
}[]) {
  // 檢查 speaker stamp 與 booth stamp 是否為 2+1
  const RATIO = 2;
  const BOOTH_NUM_REQUIRED = 1;
  const SPEAKER_NUM_REQUIRED = 2;
  let numBooth = 0;
  let numSpeaker = 0;

  for (const stamp of stamps) {
    if (stamp.type === "booth") {
      numBooth++;
    }

    if (stamp.type === "speaker") {
      numSpeaker++;
    }
  }

  // check if:
  // 1. numBooth * 2 = numSpeaker
  // 2. numBooth >= 1
  // 3. numSpeaker >= 2
  return numBooth * RATIO === numSpeaker && numBooth >= BOOTH_NUM_REQUIRED && numSpeaker >= SPEAKER_NUM_REQUIRED;
}
