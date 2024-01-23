<template>
  <div class="relative flex h-screen w-full flex-col">
    <slot />
  </div>
</template>
<style scoped>
  .h-screen {
    height: 100vh; /* fallback for browsers that do not support Custom Properties */
    height: 100dvh;
  }
</style>
