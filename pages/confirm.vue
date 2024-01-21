<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
const liff = useLiff();

watchEffect(() => {
  if (liff.isLoggedIn) {
    navigateTo("/");
  }
});
</script>
<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col flex-1 items-center justify-center gap-4">
      <Loader2 class="w-10 h-10 text-black00 animate-spin" />
      <div>載入中</div>
    </div>
    <div class="text-center text-gray-400 py-2 text-sm">
      <NuxtLink to="/sign-in">
        沒反應？點我重新登入
      </NuxtLink>
    </div>
  </div>
</template>
