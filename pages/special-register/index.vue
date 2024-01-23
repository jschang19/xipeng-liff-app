<template>
  <div class="flex size-full h-full flex-1 flex-col px-6">
    <div class="flex size-full flex-col items-center justify-center gap-4">
      <div class="">
        請選擇你的身份
      </div>
      <NuxtLink to="/special-register/speaker">
        <Button class="w-64" variant="secondary">
          大學生講者
        </Button>
      </NuxtLink>
      <Button class="w-64" variant="secondary">
        大專院校代表 / 校外贊助夥伴
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
