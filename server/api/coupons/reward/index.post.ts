import dayjs from "dayjs";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

// Special coupon api for rewarding users
// This api will insert assigned coupons to user's coupon list

export default defineEventHandler(async (event) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { participantId } = await readBody(event);
  // check if user already has coupons

  const [{ count, error }, { count: userCount, error: userCountError }] =
    await Promise.all([
      supabaseService
        .from("user_coupon")
        .select("*", { count: "exact", head: true })
        .eq("user_id", participantId),
      supabaseService
        .from("user")
        .select("*", {
          count: "exact",
          head: true
        })
        .eq("id", participantId)
    ]);

  if (error || userCountError || count === null || userCount === null) {
    setResponseStatus(event, 500);
    return {
      message: "Failed to get user coupons"
    };
  }

  if (count > 0) {
    return {
      message: "User already has coupons"
    };
  }

  if (userCount === 0) {
    setResponseStatus(event, 404);
    return {
      message: "user not found"
    };
  }

  const { data: defaultCoupons, error: defaultCouponsError } =
    await supabaseService
      .from("coupon")
      .select("*")
      .gte("expire_at", dayjs().toISOString());

  if (defaultCouponsError || !defaultCoupons) {
    setResponseStatus(event, 500);
    return {
      message: "Failed to get default coupons"
    };
  }

  const couponData: {
    coupon_id: string;
    user_id: string;
  }[] = [];

  defaultCoupons
    .filter(
      coupon => coupon.quantity === 0 || coupon.issued_num < coupon.quantity
    )
    .forEach((coupon) => {
      for (let i = 0; i < coupon.default_num; i++) {
        couponData.push({
          coupon_id: coupon.id,
          user_id: participantId
        });
      }
    });

  if (couponData.length === 0) {
    return {
      message:
        "No coupons inserted, maybe all coupons are expired or reached issue limit"
    };
  }

  // The issued_num will be update by postgreSQL trigger automatically
  const { error: insertError } = await supabaseService
    .from("user_coupon")
    .insert(couponData);

  if (insertError) {
    setResponseStatus(event, 500);
    return {
      message: "Failed to insert user coupons"
    };
  }

  return {
    message: "User coupons inserted"
  };
});
