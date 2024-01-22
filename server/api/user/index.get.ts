import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // add user into supabase by upsert
  const supabaseService = serverSupabaseServiceRole<Database>(event);

  const { error } = await supabaseService.from("user").upsert({
    line_id: user.userId,
    display_name: user.displayName,
    picture_url: user.pictureUrl,
    email: user.email
  }, {
    onConflict: "line_id"
  });

  if (error) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      error: error.message
    };
  }

  return {
    profile: user
  };
});
