<template>
  <div class="flex size-full flex-col items-center justify-center px-6 py-8">
    <div class="flex size-full max-w-md flex-col">
      <div class="flex w-full flex-1 flex-col items-center justify-center">
        <div v-if="hasScanAccess" default-value="qrcode" class="mx-auto">
          <div class="flex size-60 flex-col items-center justify-center gap-6">
            <div class="space-y-3 text-center">
              <div class="text-2xl font-bold">
                掃描 QR Code
              </div>
              <div class="text-sm text-gray-500">
                請對方出示 QR Code 給你掃描
              </div>
            </div>
            <Button size="lg" :disabled="isLoading" @click="handleScanCode">
              <Camera v-show="!isLoading" class="mr-2 size-5" />
              <Loader2 v-show="isLoading" class="mr-2 size-5 animate-spin" />
              掃描條碼
            </Button>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center">
          <div class="text-2xl font-bold">
            Your QR Code
          </div>
          <NuxtImg
            :src="qrCodeUrl"
            preload
          />
          <div class="text-gray-500">
            請出示此 QR Code 給工作人員掃描
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera, Loader2 } from "lucide-vue-next";
import useQrcode from "~/compoables/useQrcode";

const {
  isLoading,
  handleScanCode
} = useQrcode();

useHead({
  title: "活動 QR Code"
});

const liff = useLiff();
const hasScanAccess = ref(liff.user!.type.staff);

const qrCodeUrl = computed(() => {
  return `https://chart.apis.google.com/chart?cht=qr&choe=UTF-8&chs=350x350&chl=${encodeURIComponent(`
      type=stamp&data=${liff.user!.userId}
    `)}`;
});

</script>
