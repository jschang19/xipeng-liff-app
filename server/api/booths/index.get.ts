import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // select booth data from supabase
  const supabaseService = serverSupabaseServiceRole<Database>(event);

  // run parallel to fetch booth data and stamp data
  const [{ data: booths, error: boothError }, { data: stamps, error: stampError }] = await Promise.all([
    supabaseService.from("booth").select("*"),
    supabaseService.from("stamp").select(`
      *,
      user!inner(line_id)
    `).eq("user.line_id", user.userId)
  ]);

  if (boothError) {
    throw boothError;
  }

  if (stampError) {
    throw stampError;
  }

  // add "hasStamp" property to booth data if user has stamp

  booths.forEach((booth) => {
    const stamp = stamps.find(stamp => stamp.booth_id === booth.id);

    if (stamp) {
      booth.hasStamp = true;
    } else {
      booth.hasStamp = false;
    }
  });

  return {
    booths
  };
});
