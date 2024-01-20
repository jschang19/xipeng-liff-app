import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // add user into supabase by upsert
  const supabaseService = serverSupabaseServiceRole<Database>(event);

  const { data, error } = await supabaseService.from("user").upsert({
    line_id: user.userId,
    display_name: user.displayName,
    picture_url: user.pictureUrl,
    email: user.email
  }, {
    onConflict: "line_id"
  }).select(`*,
    event_speaker(
      speaker_id
      ),
      booth_staff(
        user_id
        )`);

  if (error) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      error: error.message
    };
  }

  if (data.length === 0) {
    setResponseStatus(event, 500);
    return {
      status: "error",
      error: "add user failed"
    };
  }

  const upserted = data[0];

  return {
    profile: {
      userId: upserted.line_id,
      displayName: upserted.display_name,
      pictureUrl: upserted.picture_url,
      email: upserted.email,
      access: upserted.access,
      type: {
        staff: upserted.booth_staff.length > 0,
        speaker: upserted.event_speaker.length > 0
      }
    }
  };
});
