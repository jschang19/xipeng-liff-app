<template>
  <div class="flex h-full flex-col">
    <div class="flex h-full flex-col items-center justify-center gap-6">
      <h1 class="text-2xl font-bold">
        歡迎回來
      </h1>
      <Button class="w-56" @click="liff.login()">
        以 LINE 帳號登入
      </Button>
    </div>

    <div class="py-4 text-center text-sm text-gray-400">
      Developed by <a href="https://jcshawn.com/about" target="_blank" class="underline">Shawn</a>
    </div>
  </div>
</template>

<script setup lang="ts">
const liff = useLiff();

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

watch(
  () => liff.user,
  () => {
    if (liff.user) {
      navigateTo("/");
    }
  }
);
</script>
