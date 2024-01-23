<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
const liff = useLiff();

definePageMeta({
  title: "登入中",
  layout: "signin"
});

watchEffect(() => {
  if (liff.user) {
    navigateTo("/");
  }
});
</script>
<template>
  <div class="flex h-full flex-col">
    <div class="flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 class="size-10 animate-spin text-black" />
      <div>載入中</div>
    </div>
    <div class="py-2 text-center text-sm text-gray-400">
      <NuxtLink to="/sign-in">
        沒反應？點我重新登入
      </NuxtLink>
    </div>
  </div>
</template>
