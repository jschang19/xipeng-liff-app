<template>
  <div class="flex size-full flex-col items-center justify-center px-6">
    <div class="size-full max-w-md py-8">
      <div class="py-4 text-2xl font-bold">
        今日議程
      </div>
      <div v-if="eventPending" class="flex h-full items-center justify-center">
        <Loader2 class="size-8 animate-spin" />
      </div>
      <div v-else class="flex flex-col gap-3 pt-4">
        <div v-for="event in events" :key="event.id">
          <Card class="border-none bg-slate-100 shadow-none">
            <CardContent
              class="flex flex-col gap-3 p-4"
              :class="checkIsOver(event) === true ? 'opacity-40' : ''"
            >
              <div class="flex items-center gap-2">
                <Badge variant="secondary" class="bg-slate-300">
                  {{ event.place }}
                </Badge>
                <div class="text-sm text-slate-600">
                  {{ formatTimeRange(event.startAt, event.endAt) }}
                </div>
              </div>
              <NuxtLink :to="`/event/${event.id}`" class="block">
                <h2 class="text-lg">
                  {{ event.title }}
                </h2>
              </NuxtLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDayjs } from "#dayjs";
import { Loader2 } from "lucide-vue-next";

useHead({
  title: "活動議程"
});

interface Event {
  id: string;
  title: string;
  place: string;
  startAt: number;
  endAt: number;
}

const liff = useLiff();
const dayjs = useDayjs();
const events: Ref<Event[]> = ref([]);
const eventPending = ref(false);
const nuxtApp = useNuxtApp();

const { pending } = await useFetch("/api/event", {
  method: "GET",
  key: "events",
  headers: {
    authorization: `${liff.getIdToken()}`
  },
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

watchEffect(() => {
  eventPending.value = pending.value;
});

function formatTime (unix: number) {
  return dayjs(unix).utc().local().format("HH:mm a");
}

function formatTimeRange (startAt: number, endAt: number) {
  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

function checkIsOver (event: Event) {
  return event.endAt < Date.now();
}
</script>
