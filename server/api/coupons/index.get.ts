import dayjs from "dayjs";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineAuthEventHandler(async (event, user) => {
  const supabaseService = serverSupabaseServiceRole<Database>(event);
  const { data: userCoupons, error } = await supabaseService
    .from("user_coupon")
    .select(`
      *,
      user (
        line_id
      ),
      coupon (
        description,
        expire_at,
        store (
          name,
          address,
          image_url
        )
      )
    `).eq("user.line_id", user.userId);

  if (error) {
    setResponseStatus(event, 500);
    return { message: error };
  }

  const validCoupons = userCoupons.filter((coupon) => {
    // check if is_used and expire_at
    return !coupon.used_at && coupon.coupon && dayjs(coupon.coupon.expire_at).isAfter(dayjs());
  });

  return {
    coupons: validCoupons.map((coupon) => {
      return {
        id: coupon.id,
        description: coupon.coupon.description,
        expireAt: coupon.coupon.expire_at,
        store: {
          name: coupon.coupon.store.name,
          address: coupon.coupon.store.address,
          imageUrl: coupon.coupon.store.image_url
        }
      };
    })
  };
});
