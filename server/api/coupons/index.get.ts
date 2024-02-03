import dayjs from "dayjs";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const {
    data: userCoupons,
    error,
    count: userCouponCount
  } = await supabaseService
    .from("user_coupon")
    .select(
      `
      *,
      coupon (
        description,
        expire_at,
        store (
          name,
          address,
          image_url
        )
      )
    `,
      {
        count: "exact"
      }
    )
    .eq("user_id", user.uuid)
    .order("id");

  if (error) {
    setResponseStatus(event, 500);
    return { message: error };
  }

  const validCoupons = userCoupons.filter((coupon) => {
    // check if is_used and expire_at
    return (
      !coupon.used_at &&
      coupon.coupon &&
      dayjs(coupon.coupon.expire_at).isAfter(dayjs())
    );
  });

  const allUsed = userCouponCount! > 0 && validCoupons.length === 0;

  return {
    coupons: validCoupons.map((coupon) => {
      return {
        id: coupon.id,
        description: coupon.coupon!.description,
        expireAt: coupon.coupon!.expire_at,
        store: {
          name: coupon.coupon!.store!.name,
          address: coupon.coupon!.store!.address,
          imageUrl: coupon.coupon!.store!.image_url
        }
      };
    }),
    allUsed
  };
});
