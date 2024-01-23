<template>
  <div class="flex size-full flex-col items-center justify-center px-6 py-8">
    <div v-if="pending">
      <Loader2 class="size-8 animate-spin" />
    </div>
    <div
      v-else-if="!pending && eventError && eventError.statusCode === 400"
      class="flex flex-col"
    >
      <div class="text-xl font-bold">
        找不到此活動
      </div>
      <Button class="mx-auto mt-4" @click="$router.push('/agenda')">
        回議程表
      </Button>
    </div>
    <FetchError v-else-if="eventError" />
    <div v-else-if="event && event.info" class="size-full max-w-md space-y-3">
      <div class="pt-4">
        <div class="text-2xl font-bold">
          {{ event.info.title }}
        </div>
      </div>
      <div>
        <EventInfoBlock
          label="時間"
          :value="formatTimeRange(event.info.startAt, event.info.endAt)"
          :icon="ClockIcon"
        />
        <EventInfoBlock
          label="地點"
          :value="event.info.place"
          :icon="SewingPinIcon"
        />
      </div>
      <div class="flex flex-col gap-6">
        <div class="space-y-2">
          <div class="text-lg font-bold">
            講者
          </div>
          <div class="grid grid-cols-4 gap-1 py-3">
            <div class="col-span-4">
              <div
                v-show="event.speakers.length === 0"
                class="text-center text-sm text-gray-500"
              >
                目前沒有講者資料
              </div>
              <div v-for="speaker in event.speakers" :key="speaker.name">
                <Dialog>
                  <DialogTrigger>
                    <div class="flex flex-col items-center space-y-2">
                      <Avatar class="size-12">
                        <AvatarImage :src="speaker.pictureUrl" />
                        <AvatarFallback>
                          {{ speaker.name.substring(0, 1) }}
                        </AvatarFallback>
                      </Avatar>
                      <div class="text-sm">
                        {{ speaker.name }}
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <div class="space-y-1">
                      <DialogTitle>
                        <div class="text-lg font-bold">
                          {{ speaker.name }}
                        </div>
                      </DialogTitle>
                      <DialogDescription class="space-y-2">
                        <div class="text-sm text-slate-500">
                          {{ speaker.universityName }} {{ speaker.majorName }}
                        </div>
                        <div class="text-sm text-black">
                          {{
                            speaker.bio ?? "這位講者很神秘，沒有留下任何自介"
                          }}
                        </div>
                      </DialogDescription>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="text-lg font-bold">
              議程簡介
            </div>
            <div class="text-sm">
              {{ event.info.description ?? "這個活動很神秘，沒有留下任何說明" }}
            </div>
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

definePageMeta({
  keepalive: true
});

interface Event {
  id: string;
  info: {
    title: string;
    description?: string;
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
const liff = useLiff();
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
    authorization: `${liff.getIdToken()}`
  },
  lazy: true,
  onResponse: ({ response }) => {
    // set event
    event.value = response._data;
  }
});

const pageTitle = computed(() => {
  return event.value?.info.title ?? "活動";
});

useHead({
  title: pageTitle,
  meta: [
    {
      name: "description",
      content:
        event.value?.info.description ?? "這個活動很神秘，沒有留下任何說明"
    }
  ]
});

function formatTime (unix: number) {
  return dayjs(unix).utc().local().format("HH:mm a");
}

function formatTimeRange (start: number, end: number) {
  return `${formatTime(start)} - ${formatTime(end)}`;
}
</script>
