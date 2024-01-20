<template>
  <div class="w-full p-3">
    <div class="flex gap-3">
      <div class="flex items-center">
        <component :is="props.icon" class="w-5 h-5 text-slate-700" />
      </div>
      <div class="flex flex-col">
        <div class="text-xs">
          {{ props.label }}
        </div>
        <div>
          {{ props.value }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string;
  icon: any;
}>();
</script>
