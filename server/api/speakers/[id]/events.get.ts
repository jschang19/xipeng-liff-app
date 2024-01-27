import { validate as isValidUUID } from "uuid";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const speakerId = getRouterParam(event, "id");

  if (speakerId === undefined) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Bad request"
    };
  }

  if (!isValidUUID(speakerId)) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Invalid event id"
    };
  }

  if (!user.type.speaker) {
    setResponseStatus(event, 403);
    return {
      status: "error",
      message: "Forbidden"
    };
  }

  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const
    { data: eventResult, error: eventError } = await
    supabaseService
      .from("event_speaker")
      .select(
        `*,
         event (
            id,
            title,
            description,
            place,
            start_at,
            end_at
         )`
      )
      .eq("speaker_id", speakerId)
  ;

  if (eventError) {
    console.error(eventError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (!eventResult) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Not found"
    };
  }

  return {
    events: eventResult.map((e) => {
      return {
        id: e.event_id,
        title: e.event?.title,
        description: e.event?.description,
        place: e.event?.place,
        startAt: e.event?.start_at,
        endAt: e.event?.end_at
      };
    })
  };
});
