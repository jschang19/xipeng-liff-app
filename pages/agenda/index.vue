<template>
  <div class="h-full w-full flex flex-col px-6 justify-center items-center">
    <div class="h-full max-w-md w-full py-8">
      <div class="text-2xl py-4 font-bold">
        今日議程
      </div>
      <div class="flex flex-col gap-5">
        <div v-for="event in events" :key="event.id">
          <Card>
            <CardContent class="pt-6 flex flex-col gap-2" :class="checkIsOver(event) === true ? 'opacity-40':''">
              <div class="flex gap-2">
                <Badge variant="secondary">
                  {{ event.place }}
                </Badge>
                <div class="text-sm text-slate-600">
                  {{ unixToTime(event.time.start) }} - {{ unixToTime(event.time.end) }}
                </div>
              </div>
              <NuxtLink :to="`/event/${event.id}`" class="block">
                <h2 class="text-xl">
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
interface Event {
  id: string;
    title: string;
    place: string;
    time: {
        start: number;
        end: number;
    }
};

const dayjs = useDayjs();
const events: Event[] = [
  {
    id: "1as;dlkfj",
    title: "怎麼用 Vue 3",
    place: "階梯教室",
    time: {
      start: 1705643663000,
      end: 1705604063000
    }
  },
  {
    id: "1as;dlksssfj",
    title: "怎麼用 Vue 2",
    place: "階梯教室",
    time: {
      start: 1705604423000,
      end: 1705606223000

    }
  },
  {
    id: "1as;dlsdpohigfasodihgs",
    title: "我的學習歷程：從 Vue 2 到 Vue 3 建構電商網站",
    place: "place3",
    time: {
      start: 1705606223000,
      end: 1706682574000
    }
  }
];

function unixToTime (unix: number) {
  const date = new Date(unix);
  return dayjs(date).utc().format("HH:mm");
}

function checkIsOver (event: Event) {
  return event.time.end < Date.now();
}
</script>
