<template>
  <div class="h-full w-full flex flex-col justify-center items-center px-6">
    <div class="flex flex-col space-y-6 h-full max-w-md w-full py-8">
      <div class="flex flex-col gap-8 py-4">
        <div class="space-y-3">
          <div class="text-2xl font-bold">
            集章冊
          </div>
          <div class="text-md text-gray-500">
            透過參與下午場博覽會攤位的活動，可以獲得對應的章，集滿 16 個章後，即可獲得獎勵。
          </div>
        </div>
        <div class="text-xl text-center">
          目前獲得 0 點
        </div>
      </div>
      <Dialog>
        <div v-if="boothPending" class="py-10">
          <div class="flex flex-col flex-1 items-center justify-center">
            <Loader2 class="w-8 h-8 text-black animate-spin" />
          </div>
        </div>
        <div v-else class="grid grid-cols-4 place-items-center rounded-lg border-2">
          <div v-for="booth in booths" :key="booth.id" class="w-full h-full flex items-center justify-cente aspect-squarer relative">
            <DialogTrigger @click="handleTriggered(booth.id)">
              <div v-if="booth.hasStamp" class="absolute inset-0 flex items-center justify-center">
                <div class="font-bold">
                  已簽到
                </div>
              </div>
              <div class="h-full flex flex-col justify-between p-2" :class="booth.hasStamp && `opacity-15`">
                <NuxtImg src="https://fakeimg.pl/300x300" />
              </div>
            </DialogTrigger>
          </div>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{{ triggeredBooth!.name }}</DialogTitle>
            </DialogHeader>
            <div class="flex items-center space-x-2">
              {{ triggeredBooth!.description }}
            </div>
            <DialogFooter v-if="triggered" class="sm:justify-start">
              <DialogClose as-child>
                <Button type="button" variant="link" :onclick="triggeredBooth!.link">
                  前往網站
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { useLiffStore } from "~/stores/liff";

interface Booth {
  id: string;
  name: string;
  description: string;
  link: string;
  hasStamp: boolean;
}

const liffStore = useLiffStore();
const booths = ref<Booth[]>();

const { pending: boothPending } = await useFetch<{
  booths: Booth[];
}>("/api/booths", {
  headers: {
    Authorization: `${liffStore.getIdToken()}`
  },
  lazy: true,
  pick: ["booths"],
  onResponse: ({ response }) => {
    booths.value = response._data.booths;
  }
});

const triggeredId = ref("");
const triggeredBooth = computed(() => {
  return booths.value!.find(booth => booth.id === triggeredId.value);
});
const triggered = computed(() => {
  return triggeredBooth.value !== undefined;
});

function handleTriggered (id: string) {
  triggeredId.value = id;
}

</script>
