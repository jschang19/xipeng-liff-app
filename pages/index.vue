<template>
  <div>
    <LazyHomeSpeakerInfo v-if="liff.user?.type.speaker" />
    <LazyHomeBoothDashBoard v-else-if="liff.user?.type.staff" />
    <LazyHomeGameBoard v-else />
  </div>
</template>
<script setup lang="ts">
const liff = useLiff();
</script>
