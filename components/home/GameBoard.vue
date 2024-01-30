<template>
  <div class="flex size-full flex-col items-center justify-center px-6">
    <div class="flex size-full max-w-md flex-col space-y-6 py-8">
      <div class="flex flex-col gap-8 py-4">
        <div class="space-y-3">
          <h1 class="text-2xl font-bold">
            集章冊
          </h1>
        </div>
      </div>
      <div
        v-if="stampPending"
        class="flex flex-1 flex-col items-center justify-center"
      >
        <Loader2 class="size-8 animate-spin text-black" />
      </div>
      <FetchError v-else-if="stampError" />
      <div v-else class="flex flex-col space-y-6">
        <div
          class="xs:grid-cols-2 mx-auto grid grid-cols-3 place-items-center gap-3 rounded-md"
        >
          <Dialog>
            <div
              v-for="stamp in stamps"
              :key="stamp.id"
              class="flex size-24 items-center justify-center rounded-xl border-2"
              :class="{
                'border-green-200': stamp.type !== 'empty',
                'border-slate-100 bg-slate-100': stamp.type === 'empty',
              }"
            >
              <div v-if="stamp.type === 'empty'" />
              <div v-else DialogTrigger @click="handleTriggered(stamp.id)">
                <DialogTrigger>
                  <div class="flex size-full flex-col justify-between p-1">
                    <NuxtImg
                      :src="stamp.booth.imageUrl"
                      width="100"
                      height="100"
                      class="size-full p-2"
                    />
                  </div>
                </DialogTrigger>
              </div>
            </div>
            <DialogContent class="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{{ triggeredStamp?.booth.name }}</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div class="flex items-center space-x-2">
                  {{ triggeredStamp?.booth.description }}
                </div>
              </DialogDescription>
              <DialogFooter
                v-if="triggeredStamp?.booth.link"
                class="sm:justify-start"
              >
                <DialogClose as-child>
                  <NuxtLink
                    v-show="triggeredStamp.booth.link"
                    :to="triggeredStamp.booth.link + '?openExternalBrowser=1'"
                    class="mx-auto"
                    target="_blank"
                  >
                    <Button type="button" variant="link">
                      前往網站
                    </Button>
                  </NuxtLink>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
    <div class="space-y-6">
      <StampHint v-if="stamps" :stamps="stamps" />
      <div class="text-sm text-gray-400">
        在下午博覽會訪問學長姐，或到大學攤位完成任務都可以獲得對應的章。<br><br><span class="font-medium text-gray-500">每 2 個學長姐章 + 1 個大學攤位章可抽獎一次。</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import type { Stamp } from "@/types";

useHead({
  title: "集章冊"
});

const liff = useLiff();
const stamps = ref<Stamp[]>([]);
const USER_MAX_STAMP_NUM = 9;

const { error: stampError, pending: stampPending } = await useFetch<{
  stamps: Stamp[];
}>("/api/user/stamp", {
  method: "GET",
  headers: {
    authorization: `${liff.getIdToken()}`
  },
  pick: ["stamps"],
  lazy: true,
  onResponse: ({ response }) => {
    stamps.value = response._data.stamps;

    if (response._data.stamps.length < USER_MAX_STAMP_NUM) {
      const emptyStampNum = USER_MAX_STAMP_NUM - response._data.stamps.length;

      // add empty stamps
      for (let i = 0; i < emptyStampNum; i++) {
        stamps.value.push({
          id: `empty-${i}`,
          type: "empty",
          booth: {
            name: "",
            description: "",
            imageUrl: "",
            link: ""
          }
        });
      }
    }
  }
});

const triggeredId = ref("");
const triggeredStamp = computed(() => {
  return stamps.value.find(stamp => stamp.id === triggeredId.value);
});

function handleTriggered (id: string) {
  triggeredId.value = id;
}
</script>
