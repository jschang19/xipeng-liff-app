<template>
  <LazyHomeSpeakerInfo v-if="liff.user?.type.speaker" />
  <LazyHomeGameBoard v-else />
</template>
<script setup lang="ts">
const liff = useLiff();
</script>
