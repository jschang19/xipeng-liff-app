import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { data: speakerResult, error: speakerError } = await supabaseService
    .from("event_speaker")
    .select(
    `
      speaker_id,
      user(
        id,
        speaker_profile(
          display_name,
          university_name,
          major_name,
          bio
        )
      )
    `
    )
    .eq("speaker_id", user.uuid);

  if (speakerError) {
    console.error(speakerError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (!speakerResult || speakerResult.length === 0 || speakerResult[0].user?.speaker_profile === null) {
    return {
      university: null,
      major: null,
      bio: null
    };
  }

  return {
    name: speakerResult[0].user!.speaker_profile!.display_name,
    university: speakerResult[0].user!.speaker_profile!.university_name,
    major: speakerResult[0].user!.speaker_profile!.major_name,
    bio: speakerResult[0].user!.speaker_profile!.bio
  };
});
