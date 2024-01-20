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
          <div class="text-sm">
            {{ link.title }}
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLiffStore } from "~/stores/liff";
const liffStore = useLiffStore();

useHead({
  title: "活動連結"
});

const navLinks = [
  {
    title: "議程表",
    href: "/schedule"
  },
  {
    title: "會場地圖",
    href: "/map"
  },
  {
    title: "我的條碼",
    href: "/qrcode"
  },
  {
    title: "參與者大調查",
    href: "/survey"
  },
  {
    title: "工作人員",
    href: "/staff"
  }
];

</script>
