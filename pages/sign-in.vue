<template>
  <div class="h-full flex flex-col">
    <div class="h-full flex-1 flex items-center justify-center flex-col gap-6">
      <div class="text-3xl font-bold">
        Welcome back!
      </div>
      <Button
        class="w-56"
        @click="liffStore.login()"
      >
        Login with LINE
      </Button>
    </div>

    <div class="text-center py-4 text-gray-400 text-sm">
      Developed by Shawn
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLiffStore } from "~/stores/liff";
const liffStore = useLiffStore();

definePageMeta({
  layout: "signin"
});

useHead({
  title: "登入"
});

useSeoMeta({
  title: "登入",
  description: "登入",
  robots: "noindex nofollow"
});

watch(() => liffStore.isLoggedIn, () => {
  if (liffStore.isLoggedIn) {
    navigateTo("/");
  }
});
</script>
