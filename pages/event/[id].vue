<template>
  <div class="h-full w-full py-8 flex flex-col justify-center items-center px-6">
    <div v-if="pending">
      <Loader2 class="w-8 h-8 animate-spin" />
    </div>
    <div v-else-if="!pending && eventError && eventError.statusCode === 400" class="flex flex-col">
      <div class="text-xl font-bold">
        找不到此活動
      </div>
      <Button class="mt-4 mx-auto" @click="$router.push('/agenda')">
        回議程表
      </Button>
    </div>
    <div v-else-if="event && event.info" class="h-full max-w-md w-full space-y-3">
      <div class="pt-4">
        <div class="text-2xl font-bold">
          {{ event.info.title }}
        </div>
      </div>
      <div>
        <EventInfoBlock label="時間" :value="formatTimeRange(event.info.startAt, event.info.endAt)" :icon="ClockIcon" />
        <EventInfoBlock label="地點" :value="event.info.place" :icon="SewingPinIcon" />
      </div>
      <div class="space-y-3">
        <div class="text-lg font-bold">
          講者
        </div>
        <div class="grid grid-cols-4 gap-1">
          <div v-for="speaker in event.speakers" :key="speaker.name">
            <Dialog>
              <DialogTrigger>
                <div class="flex flex-col items-center space-y-2">
                  <Avatar class="w-12 h-12">
                    <AvatarImage :src="speaker.pictureUrl" />
                    <AvatarFallback>{{ speaker.name.substring(0,1) }}</AvatarFallback>
                  </Avatar>
                  <div class="text-md">
                    {{ speaker.name }}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <div class="space-y-1">
                  <div class="text-lg font-bold">
                    {{ speaker.name }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ speaker.universityName }} {{ speaker.majorName }}
                  </div>
                  <div class="text-sm">
                    {{ speaker.bio ?? "這位講者很神秘，沒有留下任何自介" }}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon, SewingPinIcon } from "@radix-icons/vue";
import dayjs from "dayjs";
import { Loader2 } from "lucide-vue-next";
import { useLiffStore } from "~/stores/liff";

interface Event {
  id: string;
  info: {
    title: string;
    place: string;
    startAt: number;
    endAt: number;
  };
  speakers: {
    name: string;
    pictureUrl: string;
    bio?: string;
    universityName?: string;
    majorName?: string;
  }[];
}

const route = useRoute();
const event = ref<Event | null>(null);
const liffStore = useLiffStore();
const eventId = route.params.id;

const { error: eventError, pending } = await useFetch<{
  info: {
    title: string;
    place: string;
    startAt: number;
    endAt: number;
  };
  speakers: {
    name: string;
    bio?: string;
    universityName?: string;
    majorName?: string;
  }[];
}>(`/api/event/${eventId}`, {
  headers: {
    authorization: `${liffStore.getIdToken()}`
  },
  lazy: true,
  onResponse: ({ response }) => {
    // set event
    event.value = response._data;
  }
});

function formatTime (unix: number) {
  return dayjs(unix).utc().local().format("HH:mm a");
}

function formatTimeRange (start: number, end: number) {
  return `${formatTime(start)} - ${formatTime(end)}`;
}
</script>
