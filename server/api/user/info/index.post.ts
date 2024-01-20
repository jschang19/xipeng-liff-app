import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { name, studentId, phone, department } = await readBody(event);

  if (!studentId || !phone || !department || !name) {
    setResponseStatus(event, 400);
    setResponseHeaders(event, {
      "content-type": "application/json"
    });
    return {
      status: "error",
      message: "Invalid request"
    };
  }

  const { error } = await supabaseService.from("user").update({
    student_id: studentId,
    department,
    phone,
    real_name: name
  }).eq("id", user.userId);

  if (error) {
    throw error;
  }

  return {
    status: "ok"
  };
});
