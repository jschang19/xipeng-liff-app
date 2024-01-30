<template>
  <div
    v-if="liff.user"
    class="fixed bottom-0 top-auto h-[4.2rem] w-full bg-white bg-opacity-[98%] shadow-sm"
  >
    <div class="mx-auto flex h-full max-w-md items-center justify-around">
      <div
        v-for="(link, index) in links"
        :key="index"
        class="flex flex-col items-center justify-center py-2"
      >
        <NuxtLink
          :to="link.link"
          class="flex flex-col items-center justify-center gap-1"
          :class="activeLink === index ? 'text-black' : 'text-gray-500'"
        >
          <Component
            :is="link.icon"

            class="size-6 "
          />
          <div class="text-xs font-medium">
            {{ link.text }}
          </div>
        </NuxtLink>
      </div>
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
    icon: HomeIcon,
    text: "首頁"
  },
  {
    link: "/agenda",
    icon: ReaderIcon,
    text: "議程"
  },
  {
    link: "/qrcode",
    icon: CornersIcon,
    text: "QRCode"
  },
  {
    link: "/links",
    icon: MixIcon,
    text: "其他"
  }
]);

const activeLink = computed(() => {
  return links.value.findIndex(link => link.link === route.path);
});
</script>
