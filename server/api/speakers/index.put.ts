import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const {
    name: displayName,
    university: universityName,
    major: majorName,
    bio
  } = await readBody(event);

  if (!universityName || !majorName || !displayName) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Bad request"
    };
  }

  const { error } = await supabaseService
    .from("speaker_profile")
    .upsert(
      {
        user_id: user.uuid,
        university_name: universityName,
        display_name: displayName,
        major_name: majorName,
        bio
      },
      {
        onConflict: "user_id"
      }
    )
    .eq("user_id", user.uuid);

  if (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  return {
    status: "ok"
  };
});
