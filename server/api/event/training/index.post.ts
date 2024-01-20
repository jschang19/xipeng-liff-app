import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // add user into supabase by upsert

  if (!user.admin) {
    setResponseStatus(event, 401);
    return {
      status: "error",
      message: "You are not admin"
    };
  }

  const supabaseService = serverSupabaseServiceRole<Database>(event);
  // get current day, to select training session withing the day
  // for example, if today is wednesday, then we will select training session on wednesday
  const { participantId } = await readBody(event);

  if (!participantId) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "participantId is required"
    };
  }

  const today = new Date();
  const day = today.getDay();
  // get training session for today and created_by, user are same department
  const { data, error } = await supabaseService.from("events")
    .select(`id, 
            profiles:created_by (department)`)
    .eq("type", "training")
    .eq("is_open", true)
    .eq("repeat_day", day)
    .eq("profiles.department", user.department);

  if (error) {
    throw error;
  }

  if (!data) {
    return;
  }

  const traningSession = data[0];

  // check if user already attend the training session today
  const todayDateString = today.toISOString().split("T")[0]; // output: 2021-08-18

  const { data: attendanceData, error: attendanceError } = await supabaseService.from("training_attendances")
    .select("event_id")
    .eq("user_id", participantId)
    .gt("created_at", todayDateString);

  if (attendanceError) {
    throw attendanceError;
  }

  if (attendanceData) {
    return;
  }

  // insert into training attendance table to record user attendance
  const { error: insertError } = await supabaseService.from("training_attendances").insert({
    event_id: traningSession.id,
    user_id: participantId
  });

  if (insertError) {
    throw insertError;
  }

  return {
    status: "ok"
  };
});
