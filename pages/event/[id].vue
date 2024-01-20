<template>
  <div>
    {{ eventId }}
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const eventId = route.params.id;
</script>
