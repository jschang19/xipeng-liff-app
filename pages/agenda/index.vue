<template>
  <div v-if="liffStore.user" class="h-full w-full flex flex-col px-6 justify-center items-center">
    <div class="h-full max-w-md w-full py-8">
      <div class="text-2xl py-4 font-bold">
        今日議程
      </div>
      <div v-if="eventPending" class="flex h-full justify-center items-center">
        <Loader2 class="w-8 h-8 animate-spin" />
      </div>
      <div v-else class="flex flex-col gap-5">
        <div v-for="event in events" :key="event.id">
          <Card>
            <CardContent class="pt-6 flex flex-col gap-2" :class="checkIsOver(event) === true ? 'opacity-40':''">
              <div class="flex gap-2">
                <Badge variant="secondary">
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
import { useLiffStore } from "~/stores/liff";

useHead({
  title: "活動議程"
});

interface Event {
  id: string;
    title: string;
    place: string;
    startAt: number;
    endAt: number;
};

const liffStore = useLiffStore();
const dayjs = useDayjs();
const events: Ref<Event[]> = ref([]);
const eventPending = ref(false);

const cachedEvents = useNuxtData<{
  events: Event[];
}>("events");

if (!cachedEvents.data.value) {
  const { pending } = await useFetch("/api/event", {
    method: "GET",
    key: "events",
    headers: {
      authorization: `${liffStore.getIdToken()}`
    },
    lazy: true,
    pick: ["events"],
    onResponse: ({ response }) => {
      events.value = response._data.events;
    }
  });

  watchEffect(() => {
    eventPending.value = pending.value;
  });
} else {
  events.value = cachedEvents.data.value.events;
}

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
