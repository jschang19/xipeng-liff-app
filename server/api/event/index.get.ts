import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, _) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const now = new Date();
  // get training session for today and created_by, user are same department
  const { data, error } = await supabaseService.from("events")
    .select(`*, 
            profiles:created_by (real_name)`)
    .eq("is_open", true)
    .lte("start_at", now.toISOString())
    .gte("end_at", now.toISOString());

  if (error) {
    throw error;
  }

  return {
    status: "ok",
    events: data.map(event => ({
      id: event.id,
      title: event.title,
      type: event.type,
      isOpen: event.is_open,
      scope: event.scope,
      place: event.place,
      repeatDay: event.repeat_day,
      startAt: event.start_at,
      endAt: event.end_at,
      createdAt: event.created_at,
      createBy: event.profiles.name
    }))
  };
});
