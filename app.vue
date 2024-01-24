<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
useHead({
  // ... or as a function
  titleTemplate: (title) => {
    return title
      ? `${title} - 攜澎引盼 2024 活動網站`
      : "攜澎引盼 2024 活動網站";
  }
});
</script>

<style>
  ::selection {
    background-color: #f5f5f5;
  }

  @supports (-webkit-touch-callout: none) {
    .h-screen {
      height: -webkit-fill-available;
    }
  }
  </style>
