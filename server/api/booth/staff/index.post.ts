import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const {
    boothId,
    token
  } = await readBody(event);

  if (!boothId || !token) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Bad request"
    };
  }

  // check if this user is already a speaker
  if (user.type.speaker) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "You are already a speaker"
    };
  } else if (user.type.staff) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "You already have a booth"
    };
  }

  // check token
  const { data: boothToken, error: boothTokenError } = await supabaseService
    .from("booth")
    .select(`id, booth_token(
        token
      )`)
    .eq("id", boothId)
    .eq("booth_token.token", token)
    .maybeSingle();

  if (boothTokenError) {
    console.error(boothTokenError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (!boothToken) {
    // There's no matching token and boothId
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Not found, check your token and boothId"
    };
  }

  // upsert booth_staff
  const { error: upsertError } = await supabaseService
    .from("booth_staff")
    .insert({
      user_id: user.uuid,
      booth_id: boothId
    });

  if (upsertError) {
    console.error(upsertError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  return {
    status: "ok"
  };
});
