import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { data, error } = await supabaseService.from("user").select("*").eq("line_id", user.userId).maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      user: null
    };
  }

  let access = "";

  switch (data.access) {
    case "99":
      access = "admin";
      break;
    case "49":
      access = "booth";
      break;
    case "1":
      access = "user";
      break;
    default:
      access = "user";
  }

  return {
    ...user,
    access
  };
});
