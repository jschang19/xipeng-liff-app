import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // get target participant id from request body
  // we will get booth id from user id, since the user who scan the qr code is the booth owner
  const { participantId } = await readBody(event);

  if (!participantId) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Invalid request"
    };
  }

  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const [{
    data: participantUUID,
    error: participantUUIDError
  }, {
    data: staffRecord,
    error: staffRecordError
  }] = await Promise.all([
    // get participant uuid
    supabaseService.from("user").select("id").eq("line_id", participantId).maybeSingle(),
    // get staff uuid
    supabaseService.from("booth_staff").select(`
      *,
      user!inner(line_id)
    `).eq("user.line_id", user.userId).maybeSingle()
  ]);

  if (participantUUIDError || staffRecordError) {
    setResponseStatus(event, 500);
    console.error(participantUUIDError || staffRecordError);
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

  if (!participantUUID) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Participant not found"
    };
  }

  // add stamp data to supabase
  const { error: stampError } = await supabaseService.from("stamp").upsert({ user_id: participantUUID.id, booth_id: staffRecord.booth_id }, {
    onConflict: "user_id,booth_id"
  });

  const [
    { error: stampsError, count: stampCount },
    { error: couponError, count: couponCount }
  ] = await Promise.all([
    supabaseService.from("stamp").select(`
    *,
    booth (
      type
    )
  `, {
      count: "exact"
    }).eq("user_id", participantUUID.id),
    supabaseService.from("user_coupon").select("*", { count: "exact", head: true }).eq("user_id", participantUUID.id)
  ]);

  if (stampsError || stampCount === null) {
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

  if (stampCount === 3 && couponCount === 0) {
    await $fetch("/api/coupons/reward", {
      method: "POST",
      headers: {
        content_type: "application/json",
        authorization: getRequestHeaders(event).authorization!
      },
      body: {
        participantId: participantUUID.id
      }
    });
  }
  // if stamps is more then 4, check if there's 3 internal stamps and 1 external stamp by checking the booth type

  if (stampError) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Failed to add stamp"
    };
  }

  // return status code
  return {
    status: "ok"
  };
});
