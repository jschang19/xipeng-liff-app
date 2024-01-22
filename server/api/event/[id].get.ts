import { validate as isValidUUID } from "uuid";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");

  if (eventId === undefined) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Bad request"
    };
  }

  if (!isValidUUID(eventId)) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Invalid event id"
    };
  }

  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const [
    { data: eventResult, error: eventError },
    { data: speakersResult, error: speakersError }
  ] = await Promise.all([
    supabaseService.from("event").select("*").eq("id", eventId).single(),
    supabaseService
      .from("event_speaker")
      .select(`*,
         user (
            display_name,
            picture_url,
            speaker_profile (
              display_name,
              bio,
              university_name,
              major_name
            )
          )`)
      .eq("event_id", eventId)
  ]);

  if (eventError || speakersError) {
    console.error(eventError || speakersError);
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
    status: "ok",
    info: {
      title: eventResult.title,
      description: eventResult.description,
      place: eventResult.place,
      startAt: eventResult.start_at,
      endAt: eventResult.end_at
    },
    speakers: speakersResult.map(speaker => ({
      name: speaker.user!.speaker_profile?.display_name || speaker.user!.display_name,
      pictureUrl: speaker.user!.picture_url || "",
      bio: speaker.user!.speaker_profile?.bio || "",
      universityName: speaker.user!.speaker_profile?.university_name,
      majorName: speaker.user!.speaker_profile?.major_name
    }))
  };
});
