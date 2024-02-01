<template>
  <div class="flex size-full flex-col items-center justify-center px-6">
    <div class="flex size-full max-w-md flex-col space-y-6 py-8">
      <div class="flex flex-col gap-8 pt-4">
        <div class="mb-4 space-y-3">
          <h1 class="text-center text-2xl font-bold">
            工作人員主頁
          </h1>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center space-y-6">
        <div class="text-lg font-semibold">
          本攤位已掃描人數
        </div>
        <div v-if="pending" class="mx-auto">
          <Loader2 class="size-7 animate-spin" />
        </div>
        <FetchError v-else-if="error" />
        <div v-else class="text-3xl font-semibold">
          {{ scannedNumber }} 人
        </div>
        <Separator />
        <div class="text-lg font-semibold">
          快捷功能
        </div>
        <div>
          <Button size="lg" @click="handleScanCode">
            掃描 QR Code
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import useQrcode from "~/compoables/useQrcode";

const { handleScanCode } = useQrcode();
useHead({
  title: "工作人員主頁"
});

const liff = useLiff();
const scannedNumber = ref(0);
const nuxtApp = useNuxtApp();

const { error, pending } = await useFetch("/api/booth/stamp/count", {
  headers: {
    authorization: `${liff.getIdToken()}`
  },
  lazy: true,
  key: "scanned",
  onResponse: ({ response }) => {
    scannedNumber.value = response._data.scanned;
  },
  getCachedData (key) {
    if (nuxtApp.payload.data[key]?.scanned) {
      scannedNumber.value = nuxtApp.payload.data[key].scanned;
    }

    return 0;
  }
});

</script>
