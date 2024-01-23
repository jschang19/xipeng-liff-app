import { nanoid } from "nanoid";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // select booth data from supabase
  const supabaseService = serverSupabaseServiceRole<Database>(event);

  const { data: userStamps, error: userStampsError } = await supabaseService
    .from("stamp")
    .select(
      `*,booth (
      name,
      description,
      link,
      image_url
    )`
    )
    .eq("user_id", user.uuid)
    .order("created_at");

  if (userStampsError) {
    setResponseStatus(event, 500);
    console.error(userStampsError);
    return {
      status: "error",
      message: "Failed to fetch data"
    };
  }

  return {
    stamps: userStamps.map(stamp => ({
      id: nanoid(),
      type: stamp.type,
      booth: {
        name: stamp.booth!.name,
        description: stamp.booth!.description,
        imageUrl: stamp.booth!.image_url
      }
    }))
  };
});
