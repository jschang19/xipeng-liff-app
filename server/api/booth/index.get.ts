import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { data: boothResult, error: boothError } = await supabaseService
    .from("booth")
    .select("*")
    .eq("type", "external")
    .order("name", { ascending: true });

  if (boothError) {
    console.error(boothError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (!boothResult) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Not found"
    };
  }

  return {
    booths: boothResult.map(booth => ({
      id: booth.id,
      name: booth.name
    }))
  };
});
