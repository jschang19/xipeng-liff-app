<template>
  <div v-if="liffStore.user" class="h-full w-full py-8 flex flex-col justify-center items-center px-6">
    <div class="h-full max-w-md w-full space-y-3">
      <div class="py-4">
        <div class="text-2xl font-bold">
          活動連結
        </div>
      </div>

      <div class="grid grid-cols-4 gap-5">
        <Card v-for="link in navLinks" :key="link.title" class="flex aspect-square h-[4.5rem] shadow-none">
          <NuxtLink :to="link.href">
            <div class="text-sm">
              {{ link.title }}
            </div>
          </NuxtLink>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLiffStore } from "~/stores/liff";
const liffStore = useLiffStore();
const isSpeaker = ref(liffStore.user!.type.speaker);

useHead({
  title: "活動連結"
});

const navLinks = ref([{
  title: "活動議程",
  href: "/agenda"
}, {
  title: "活動 QR Code",
  href: "/qrcode"
}]);

if (isSpeaker.value) {
  navLinks.value.push({
    title: "個人資料",
    href: "/profile"
  });
}
</script>
