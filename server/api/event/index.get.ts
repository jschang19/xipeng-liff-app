import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { data: eventResult, error: eventError } = await supabaseService
    .from("event")
    .select("*")
    .order("start_at", { ascending: true });

  if (eventError) {
    console.error(eventError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (!eventResult) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Not found"
    };
  }

  return {
    status: "ok",
    events: eventResult.map(event => ({
      id: event.id,
      title: event.title,
      place: event.place,
      startAt: event.start_at,
      endAt: event.end_at
    }))
  };
});
