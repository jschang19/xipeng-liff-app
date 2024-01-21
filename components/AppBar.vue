<template>
  <div v-if="liff.user" class="w-full h-14 bg-white fixed top-auto bottom-0 shadow-sm items-center flex justify-around sm:hidden">
    <div v-for="(link, index) in links" :key="index" class="flex flex-col items-center justify-center py-3">
      <NuxtLink :to="link.link" class="flex flex-col items-center justify-center">
        <Component :is="link.icon" :class="activeLink === index ? 'text-gray-500' : 'text-black'" class="w-6 h-6" />
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { HomeIcon, CornersIcon, ReaderIcon, MixIcon } from "@radix-icons/vue";
import { useLiff } from "~/stores/liff";
const route = useRoute();
const liff = useLiff();
const links = ref([
  {
    link: "/",
    icon: HomeIcon
  },
  {
    link: "/agenda",
    icon: ReaderIcon
  },
  {
    link: "/qrcode",
    icon: CornersIcon
  }, {
    link: "/links",
    icon: MixIcon
  }
]);

const activeLink = computed(() => {
  return links.value.findIndex(link => link.link === route.path);
});
</script>
