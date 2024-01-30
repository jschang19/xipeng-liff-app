<template>
  <div>
    <LazyHomeSpeakerInfo v-if="liff.user?.type.speaker" />
    <LazyHomeGameBoard v-else />
  </div>
</template>
<script setup lang="ts">
const liff = useLiff();
</script>
