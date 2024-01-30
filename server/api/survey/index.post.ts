import * as z from "zod";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  // get target participant id from request body
  // we will get booth id from user id, since the user who scan the qr code is the booth owner
  const {
    identity,
    grade,
    group,
    source,
    reason,
    satisfactionRating,
    achievementRating,
    morningRating,
    speakerRating,
    boothRating,
    lotteryRating,
    recommendRating,
    interviewCount,
    suggestion
  } = await readBody(event);

  // if any of the required field is missing, return error
  // use zod to validate the request body

  const bodySchema = z.object({
    identity: z.string().min(1),
    grade: z.string().min(1),
    group: z.string().min(1),
    source: z.string().min(1),
    reason: z.string().min(1),
    satisfactionRating: z.string().min(1).max(1),
    achievementRating: z.string().min(1).max(1),
    morningRating: z.string().min(1).max(1),
    speakerRating: z.string().min(1).max(1),
    boothRating: z.string().min(1).max(1),
    lotteryRating: z.string().min(1).max(1),
    recommendRating: z.string().min(1).max(1),
    interviewCount: z.string().min(1).max(12),
    suggestion: z.string().min(0).max(150)
  });

  const safe = bodySchema.safeParse({
    identity,
    grade,
    group,
    source,
    reason,
    satisfactionRating,
    achievementRating,
    morningRating,
    speakerRating,
    boothRating,
    lotteryRating,
    recommendRating,
    interviewCount,
    suggestion
  });

  if (!safe.success) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Incomplete request"
    };
  }

  const supabaseService = serverSupabaseServiceRole<Database>(event);
  // check user has filled the survey before
  const { count: surveyCount, error: surveyCountError } = await supabaseService.from("survey").select("*", {
    count: "exact",
    head: true
  }).eq("user_id", user.uuid);

  if (surveyCountError) {
    setResponseStatus(event, 500);
    console.error(surveyCountError);
    return {
      status: "error",
      message: "Failed to fetch count data"
    };
  }

  if (surveyCount === null || surveyCount > 0) {
    setResponseStatus(event, 403);
    return {
      status: "error",
      message: "You have filled the survey"
    };
  }

  // insert survey data into supabase

  const { error: inserError } = await supabaseService.from("survey").insert({
    user_id: user.uuid,
    identity,
    grade,
    group,
    source,
    reason,
    satisfaction_rating: satisfactionRating,
    achievement_rating: achievementRating,
    morning_rating: morningRating,
    speaker_rating: speakerRating,
    booth_rating: boothRating,
    lottery_rating: lotteryRating,
    recommend_rating: recommendRating,
    interview_count: interviewCount,
    suggestion
  });

  if (inserError) {
    setResponseStatus(event, 500);
    console.error(inserError);
    return {
      status: "error",
      message: "Failed to insert data"
    };
  }

  // return status code
  return {
    status: "ok"
  };
});
