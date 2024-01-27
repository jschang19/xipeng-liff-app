import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const SPEAKER_BOOTH_ID = "c4e84d4f-7b52-40bf-8598-cd9ad8520c06";
  const {
    name,
    phone,
    email,
    eventId,
    bio
  } = await readBody(event);

  if (!name || !phone || !email || !eventId) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Bad request"
    };
  }

  // check if this user is already a speaker
  if (user.type.speaker) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "You are already a speaker"
    };
  }

  const { data: googleFormSpeakerResult, error: googleFormSpeakerError, count: googleFormSpeakerCount } =
    await supabaseService
      .from("google_form_speaker")
      .select("*", {
        count: "exact"
      })
      .eq("email", email)
      .eq("phone", phone)
      .eq("name", name);

  if (googleFormSpeakerError) {
    console.error(`googleFormSpeakerError: ${googleFormSpeakerError}`);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (googleFormSpeakerCount === 0) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "You are not a speaker"
    };
  }

  // check if this user is already a speaker in this event
  const { count: eventSpeakerCount, error: eventSpeakerError } = await supabaseService
    .from("event_speaker")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("event_id", eventId)
    .eq("speaker_id", user.uuid);

  if (eventSpeakerError || eventSpeakerCount === null) {
    console.error(`eventSpeakerError: ${eventSpeakerError}`);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (eventSpeakerCount && eventSpeakerCount > 0) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "You are already a speaker in this event"
    };
  }

  console.log(googleFormSpeakerResult);

  // Confrim speaker, copy data from google_form_speaker to speaker_profile
  // insert a speaker_id, event_id to `speaker_profile`
  // and upsert to `speaker_profile`
  const [
    {
      error: upsertSpeakerProfileError
    },
    {
      error: insertEventSpeakerError
    },
    {
      error: insertBoothStaffError
    }] = await Promise.all([
    supabaseService.from("speaker_profile").upsert(
      {
        user_id: user.uuid,
        display_name: name,
        university_name: googleFormSpeakerResult![0].university,
        major_name: googleFormSpeakerResult![0].major,
        bio
      },
      {
        onConflict: "user_id"
      }
    ),
    supabaseService.from("event_speaker").insert({
      event_id: eventId,
      speaker_id: user.uuid
    }),
    supabaseService.from("booth_staff").insert({
      booth_id: SPEAKER_BOOTH_ID,
      user_id: user.uuid
    })
  ]);

  if (upsertSpeakerProfileError || insertEventSpeakerError || insertBoothStaffError) {
    console.error(`upsertSpeakerProfileError: ${upsertSpeakerProfileError}`);
    console.error(`insertEventSpeakerError: ${insertEventSpeakerError}`);
    console.error(`insertBoothStaffError: ${insertBoothStaffError}`);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  // Add coupon reward to new speaker
  await $fetch("/api/coupons/reward", {
    method: "POST",
    headers: {
      content_type: "application/json",
      authorization: getRequestHeaders(event).authorization!
    },
    body: {
      participantId: user.uuid
    }
  });

  return {
    status: "ok"
  };
});
