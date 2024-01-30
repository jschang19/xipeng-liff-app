import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { count: surveyCount, error: surveyError } = await supabaseService
    .from("survey")
    .select("id", { count: "exact" })
    .eq("user_id", user.uuid);

  if (surveyError) {
    setResponseStatus(event, 500);
    console.error(surveyError);
    return {
      status: "error",
      message: "Failed to fetch count data"
    };
  }

  console.log(surveyCount);
  return {
    status: "ok",
    filled: surveyCount! > 0
  };
});
