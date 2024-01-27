<template>
  <Alert>
    <AlertTitle>遊戲提示</AlertTitle>
    <AlertDescription class="mt-3 space-y-1">
      <div class="flex items-center">
        <DotFilledIcon class="mr-1 inline-block size-4" />
        <div v-if="numToGetCoupon > 0">
          折價券：還差 {{ numToGetCoupon }} 個章
        </div>
        <div v-else>
          折價券：
          <NuxtLink
            to="/coupons"
            class="font-medium underline"
          >
            可領取 🎉
          </NuxtLink>
        </div>
      </div>
      <div class="flex items-center">
        <DotFilledIcon class="mr-1 inline-block size-4" />
        目前抽獎次數：{{ numLotteryChance }} 次
      </div>
      <div class="flex items-center">
        <DotFilledIcon class="mr-1 inline-block size-4" />
        下一張抽獎券：還差 {{ numToGetLotteryChance.booth }} 個攤位章，{{
          numToGetLotteryChance.speaker
        }}
        個講者章
      </div>
    </AlertDescription>
  </Alert>
</template>
<script setup lang="ts">
import { DotFilledIcon } from "@radix-icons/vue";
import type { Stamp } from "@/types";

// Stamp rules
// 1. 折價券至少要有 3 個 stamp，種類不限
// 2. 抽獎至少要有 3 個 stamp，至少要有 2 個 speaker stamp 跟 1 個 booth stamp
// 3. 每 2 個 booth stamp 跟 1 個 speaker stamp 就可以抽獎一次，最多可以抽 3 次
const COUPON_STAMP_REQUIRED = 3;
const LOTTERY_STAMP_REQUIRED_BOOTH = 1;
const LOTTERY_STAMP_REQUIRED_SPEAKER = 2;

const liff = useLiff();
const props = defineProps<{
  stamps: Stamp[];
}>();

const numToGetCoupon = computed(() => {
  if (liff.user?.type.speaker) {
    return 0;
  }

  let num = 0;

  for (const stamp of props.stamps) {
    if (stamp.type !== "empty") {
      num++;
    }
  }

  if (num >= COUPON_STAMP_REQUIRED) {
    return 0;
  }

  return COUPON_STAMP_REQUIRED - num;
});

// calculate how many lottery chance
const numLotteryChance = computed(() => {
  if (liff.user?.type.speaker) {
    return 3;
  }

  let numBooth = 0;
  let numSpeaker = 0;

  for (const stamp of props.stamps) {
    if (stamp.type === "booth") {
      numBooth++;
    }

    if (stamp.type === "speaker") {
      numSpeaker++;
    }
  }

  return Math.floor(
    Math.min(numBooth / LOTTERY_STAMP_REQUIRED_BOOTH, numSpeaker / LOTTERY_STAMP_REQUIRED_SPEAKER)
  );
});

// calculate how many stamps needed to get lottery chance
// return two numbers: [booth, speaker]
const numToGetLotteryChance = computed(() => {
  if (liff.user?.type.speaker) {
    return {
      booth: 0,
      speaker: 0
    };
  }

  let numBooth = 0;
  let numSpeaker = 0;

  for (const stamp of props.stamps) {
    if (stamp.type === "booth") {
      numBooth++;
    }

    if (stamp.type === "speaker") {
      numSpeaker++;
    }
  }

  return {
    booth: Math.max(0, LOTTERY_STAMP_REQUIRED_BOOTH - (numBooth % LOTTERY_STAMP_REQUIRED_BOOTH)),
    speaker: Math.max(
      0,
      LOTTERY_STAMP_REQUIRED_SPEAKER - (numSpeaker % LOTTERY_STAMP_REQUIRED_SPEAKER)
    )
  };
});
</script>
