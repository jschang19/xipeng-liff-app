import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // select booth data from supabase
  const supabaseService = serverSupabaseServiceRole<Database>(event);

  // run parallel to fetch booth data and stamp data
  const { data: staffRecords, error: staffRecordError } = await supabaseService.from("booth_staff").select(`
    *,
    booth!inner(name),
    user!inner(line_id)
  `).eq("user.line_id", user.userId);

  if (staffRecordError) {
    throw staffRecordError;
  }

  if (staffRecords.length === 1 && staffRecords[0].booth_id !== null) {
    return {
      status: "ok",
      hasAccess: true
    };
  } else {
    return {
      status: "ok",
      hasAccess: false
    };
  }
});
