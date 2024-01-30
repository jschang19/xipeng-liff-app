import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { data: stampResult, error: stampError } = await supabaseService
    .from("booth_staff")
    .select(`
      *,
      booth(
        id,
        stamp(
          id
        )
      )
    `)
    .eq("booth.type", "external")
    .eq("user_id", user.uuid);

  if (stampError) {
    console.error(stampError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (!stampResult) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Not found"
    };
  }

  if (!stampResult[0].booth) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Not found"
    };
  }

  const stampCount = stampResult[0].booth?.stamp?.length ?? 0;

  return {
    scanned: stampCount
  };
});
