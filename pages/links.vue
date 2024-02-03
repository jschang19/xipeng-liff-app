<template>
  <div class="flex size-full flex-col items-center justify-center px-6 py-8">
    <div class="size-full max-w-md space-y-3">
      <div class="py-4">
        <h1 class="text-2xl font-bold">
          活動連結
        </h1>
      </div>

      <div class="grid grid-cols-4 gap-8">
        <div v-for="link in navLinks" :key="link.title">
          <NuxtLink
            :to="link.href"
            class="flex aspect-square h-[4.5rem] flex-col gap-3 text-slate-600 shadow-none"
            :target="link.openNewTab ? '_blank' : null"
          >
            <Component :is="link.icon" class="mx-auto size-6" />
            <div class="text-center text-xs font-medium">
              {{ link.title }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowTopRightIcon,
  ReaderIcon,
  PersonIcon,
  Component2Icon,
  CornersIcon,
  CardStackIcon,
  FileIcon,
  HomeIcon
} from "@radix-icons/vue";
const liff = useLiff();
const isSpeaker = ref(liff.user!.type.speaker);

useHead({
  title: "活動連結"
});

const navLinks = ref([
  {
    title: (liff.user?.type.speaker || liff.user?.type.staff) ? "主頁" : "集章冊",
    href: "/",
    icon: (liff.user?.type.speaker || liff.user?.type.staff) ? HomeIcon : Component2Icon
  },
  {
    title: "活動議程",
    href: "/agenda",
    icon: ReaderIcon
  },
  {
    title: "QR Code",
    href: "/qrcode",
    icon: CornersIcon
  },
  {
    title: "活動官網",
    href: "https://google.com",
    icon: ArrowTopRightIcon,
    openNewTab: true
  },
  {
    title: "折價券",
    href: "/coupons",
    icon: CardStackIcon
  },
  {
    title: "回饋問卷",
    href: "/survey",
    icon: FileIcon
  }
]);

if (isSpeaker.value) {
  navLinks.value.push({
    title: "個人資料",
    href: "/profile",
    icon: PersonIcon
  });
}
</script>
