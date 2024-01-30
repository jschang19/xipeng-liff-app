<template>
  <div class="flex size-full flex-col items-center justify-center px-6">
    <div class="flex size-full max-w-md flex-col space-y-6 py-8">
      <div class="flex flex-col gap-8 pt-4">
        <div class="space-y-3">
          <h1 class="text-2xl font-bold">
            歡迎回來，{{ liff.user?.displayName }}
          </h1>
        </div>
      </div>
      <div
        v-if="pending"
        class="flex flex-1 flex-col items-center justify-center"
      >
        <Loader2 class="size-8 animate-spin text-black" />
      </div>
      <FetchError v-else-if="error" />
      <div v-else class="flex flex-col space-y-6">
        <div class="text-lg font-semibold">
          你的議程
        </div>
        <Card v-for="event in events" :key="event.id" class="border-none shadow-none">
          <CardContent
            class="flex flex-col gap-2 p-3"
            :class="checkIsOver(event) === true ? 'opacity-40' : ''"
          >
            <div class="flex gap-2">
              <Badge variant="secondary">
                {{ event.place }}
              </Badge>
              <div class="text-sm text-slate-600">
                {{ formatTimeRange(event.startAt, event.endAt) }}
              </div>
            </div>
            <NuxtLink :to="`/event/${event.id}`" class="block">
              <h2 class="text-[1.06rem]">
                {{ event.title }}
              </h2>
            </NuxtLink>
            <div v-if="!checkIsOver(event)" class="text-sm text-gray-600">
              還剩下 {{ calculateLastTime(event) }}
            </div>
          </CardContent>
        </Card>
        <Separator />
        <div class="text-lg font-semibold">
          講者福利
        </div>
        <Alert>
          <AlertTitle>感謝你的分享！</AlertTitle>
          <AlertDescription class="mt-3 space-y-1">
            <div>
              你已自動獲得本次活動的折價券，請至
              <NuxtLink to="/coupons">
                <span class="font-bold underline">
                  折價券
                </span>
              </NuxtLink>
              查看
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import dayjs from "dayjs";
import type { Event } from "@/types";

useHead({
  title: "講者主頁"
});

const liff = useLiff();
const events = ref<Event[]>([]);
const nuxtApp = useNuxtApp();

const { error, pending } = await useFetch<{
    events: Event[];
  }>(`/api/speakers/${liff.user?.uuid}/events`, {
    key: "speakers-events",
    method: "GET",
    headers: {
      authorization: `${liff.getIdToken()}`
    },
    pick: ["events"],
    lazy: true,
    onResponse: ({ response }) => {
      events.value = response._data.events;
    },
    getCachedData (key) {
      if (nuxtApp.payload.data[key]?.events) {
        events.value = nuxtApp.payload.data[key].events;
      }

      return nuxtApp.payload.data[key];
    }

  });

function checkIsOver (event: Event) {
  return dayjs().isAfter(dayjs(event.endAt));
}

function formatTime (unix: number) {
  return dayjs(unix).utc().local().format("HH:mm a");
}

function formatTimeRange (start: number, end: number) {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

function calculateLastTime (event: Event) {
  const lastMins = dayjs(event.endAt).diff(dayjs(), "minute");
  const lastHours = Math.floor(lastMins / 60);
  const lastDays = Math.floor(lastHours / 24);
  return `${lastDays} 天 ${lastHours % 24} 小時 ${lastMins % 60} 分鐘`;
}
</script>
