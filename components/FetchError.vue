<template>
  <div class="flex h-full flex-col items-center justify-center gap-3">
    <div>取得資料時出現錯誤，請重新整理頁面</div>
    <div>
      <Button @click="handleReload">
        重新整理
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
function handleReload () {
  reloadNuxtApp({
    force: true
  });
}
</script>
