import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";
import type { FullProfile } from "~/types";

export default defineAuthEventHandler(async (event, user) => {
  // 1. If user.uuid == "", insert user to database
  // 2. If user.uuid != "", select user from database, compare user data
  // 2.1 If user data is different, update user data
  const supabaseService = serverSupabaseServiceRole<Database>(event);

  if (user.uuid === "") {
    const { data: upsertedUser, error } = await supabaseService
      .from("user")
      .insert({
        line_id: user.userId,
        display_name: user.displayName,
        picture_url: user.pictureUrl,
        email: user.email
      }).select().single();

    if (error) {
      throw error;
    }

    return {
      profile: upsertedUser
    };
  }

  // select user from database
  const { data: userData, error: userError } = await supabaseService
    .from("user")
    .select(`
      line_id,
      display_name,
      picture_url,
      email
    `)
    .eq("line_id", user.userId).single();

  if (userError) {
    throw userError;
  }

  const isDifferent = checkUserDifferent(user, userData);

  if (isDifferent) {
    console.log("User data is different, update user data");
    const { data: upsertedUser, error } = await supabaseService
      .from("user")
      .update({
        display_name: user.displayName,
        picture_url: user.pictureUrl,
        email: user.email
      })
      .eq("line_id", user.userId).single();

    if (error) {
      throw error;
    }

    return {
      profile: upsertedUser
    };
  }
  // compare user data to see if user data is different

  return {
    profile: user
  };
});

function checkUserDifferent (user: FullProfile, userData: {
  line_id: string;
  display_name: string;
  picture_url: string | null;
  email: string | null;
}): boolean {
  return user.displayName !== userData.display_name ||
    user.pictureUrl !== userData.picture_url ||
    user.email !== userData.email;
}
