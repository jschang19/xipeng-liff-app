<template>
  <div class="h-full w-full flex flex-col px-6">
    <div class="h-full max-w-md w-full py-8">
      <div class="py-4 space-y-1">
        <div class="text-2xl font-bold">
          你的優惠券
        </div>
      </div>
      <div v-if="pending" class="h-full w-full flex flex-col justify-center items-center">
        <Loader2 class="w-8 h-8 animate-spin" />
      </div>
      <FetchError v-else-if="couponError" />
      <div v-else class="h-full w-full">
        <div v-if="userCoupons.length === 0" class="flex flex-col items-center justify-center h-full gap-3">
          <div>
            目前沒有優惠券～
          </div>
          <div>
            <NuxtLink to="/">
              <Button>完成活動</Button>
            </NuxtLink>
          </div>
        </div>
        <AlertDialog v-else>
          <div class="flex flex-col gap-4">
            <Card v-for="coupon in userCoupons" :key="coupon.id">
              <CardHeader>
                <CardTitle>
                  {{ coupon.store.name }}
                </CardTitle>
              </CardHeader>
              <CardContent class="text-sm">
                {{ coupon.description }}
              </CardContent>
              <CardFooter>
                <AlertDialogTrigger class="w-full">
                  <Button color="primary" class="w-full" @click="selectedCouponId = coupon.id">
                    使用
                  </Button>
                </AlertDialogTrigger>
              </CardFooter>
            </Card>
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                確定要兌換了嗎？
              </AlertDialogTitle>
              <AlertDialogDescription>
                一旦兌換後將無法再開啟，並在 {{ WAITING_SECONDS / 60 }} 分鐘後過期。請在要結帳時再開啟兌換畫面！
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction @click="handleConfirm">
                確定繼續
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Sheet :open="confirmSheet">
        <SheetTrigger />
        <SheetCouponContent
          side="bottom"
        >
          <SheetHeader>
            <SheetTitle>
              {{ selectedCoupon?.store.name }}
              <SheetDescription class="font-normal">
                請出示此畫面給店員確認
              </SheetDescription>
            </SheetTitle>
          </SheetHeader>
          <div class="grid gap-4 py-4">
            <div class="flex flex-col gap-2 text-sm text-center">
              <div class="text-lg font-bold">
                兌換時間：{{ formatTime(usedAt) }}
              </div>
              <div class="text-md font-bold text-red-600">
                剩下 {{ timerCount }} 秒
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose as-child>
              <Button
                variant="secondary"
                @click="()=>{
                  removeUsedCoupon();
                  nextTick();
                  confirmSheet = false;
                  selectedCouponId = null;
                }"
              >
                完成兌換
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetCouponContent>
      </Sheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import dayjs from "dayjs";
import { useToast } from "~/components/ui/toast";
interface Coupon {
  id: string;
  description: string;
  expiredAt: number;
  store:{
    name: string;
    address?: string;
    imageUrl?: string;
  }
}

const WAITING_SECONDS = 120;
const liff = useLiff();

const { toast } = useToast();
const userCoupons = ref<Coupon[]>([]);
const selectedCouponId = ref<string | null>(null);
const confirmSheet = ref(false);
const timerCount = ref(0);
const usedAt = ref<number|null>(null);
const selectedCoupon = computed(() => {
  return userCoupons.value.find(coupon => coupon.id === selectedCouponId.value);
});

const { error: couponError, pending } = useFetch<{
  coupons: Coupon[];
}>("/api/coupons", {
  method: "GET",
  headers: {
    authorization: `${liff.getIdToken()}`
  },
  lazy: true,
  onResponse: ({ response }) => {
    userCoupons.value = response._data.coupons;
  }
});

async function markCouponUsed () {
  let success = false;
  await useFetch(`/api/coupons/${selectedCouponId.value}`, {
    method: "PATCH",
    headers: {
      authorization: `${liff.getIdToken()}`
    },

    onResponseError: ({ response }) => {
      console.error(response);
    },
    onResponse: ({ response }) => {
      if (response.status === 200) {
        success = true;
      }
    }
  });

  return success;
}

async function handleConfirm () {
  const marked = await markCouponUsed();

  if (!marked) {
    toast({
      title: "兌換失敗",
      description: "兌換失敗，請稍後再試",
      variant: "destructive"
    });
    return;
  }

  await nextTick(); // wait for the coupon to be removed from the list
  confirmSheet.value = true;
  timerCount.value = WAITING_SECONDS;
  usedAt.value = Date.now();

  const timer = setInterval(async () => {
    if (timerCount.value === 0) {
      removeUsedCoupon();

      await nextTick();
      confirmSheet.value = false;
      selectedCouponId.value = null;
      confirmSheet.value = false;

      clearInterval(timer);
      return;
    }

    timerCount.value -= 1;
  }, 1000);
}

function formatTime (unix: number | null) {
  if (!unix) { return ""; }

  return dayjs(unix).utc().local().format("YYYY/MM/DD HH:mm");
}

function removeUsedCoupon () {
  userCoupons.value = userCoupons.value.filter(coupon => coupon.id !== selectedCouponId.value);
}

</script>
