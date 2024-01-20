import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // add user into supabase by upsert
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { data: upsertedUser, error } = await supabaseService.from("user").upsert({
    line_id: user.userId,
    display_name: user.displayName,
    picture_url: user.pictureUrl,
    email: user.email
  }, {
    onConflict: "line_id"
  }).select().single();

  if (error) {
    throw error;
  }

  return {
    status: "ok",
    profile: {
      userId: upsertedUser.line_id,
      displayName: upsertedUser.display_name,
      pictureUrl: upsertedUser.picture_url,
      email: upsertedUser.email,
      access: upsertedUser.access
    }
  };
});
