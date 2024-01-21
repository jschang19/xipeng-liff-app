import dayjs from "dayjs";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const couponId = getRouterParam(event, "id");

  const { data: userCoupons, error } = await supabaseService
    .from("user_coupon")
    .select(`
      *,
      user(
        line_id
      )
    `).eq("id", couponId).eq("user.line_id", user.userId).single();

  if (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  if (!userCoupons) {
    setResponseStatus(event, 404);
    return {
      status: "error",
      message: "Coupon not found"
    };
  }

  if (userCoupons.used_at !== null) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Coupon has been used"
    };
  }

  if (dayjs().isAfter(userCoupons.expired_at)) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Coupon has been expired"
    };
  }

  const { error: updateError } = await supabaseService.from("user_coupon").update({
    used_at: dayjs().locale("Asia/Taipei").toISOString()
  }).eq("id", couponId);

  if (updateError) {
    console.error(updateError);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Internal server error"
    };
  }

  return {
    status: "ok",
    message: "Coupon has been used"
  };
});
