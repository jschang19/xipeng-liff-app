<template>
  <div class="flex h-full flex-col">
    <div class="flex h-full flex-1 flex-col items-center justify-center gap-6">
      <div class="text-3xl font-bold">
        Welcome back!
      </div>
      <Button class="w-56" @click="liff.login()">
        Login with LINE
      </Button>
    </div>

    <div class="py-4 text-center text-sm text-gray-400">
      Developed by Shawn
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

if (liff.isInClient()) {
  liff.login();
}

watch(
  () => liff.user,
  () => {
    if (liff.user) {
      navigateTo("/");
    }
  }
);
</script>
