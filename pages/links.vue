<template>
  <div class="h-full w-full py-8 flex flex-col justify-center items-center px-6">
    <div class="h-full max-w-md w-full space-y-3">
      <div class="py-4">
        <div class="text-2xl font-bold">
          活動連結
        </div>
      </div>

      <div class="grid grid-cols-4 gap-8">
        <div v-for="link in navLinks" :key="link.title">
          <NuxtLink :to="link.href" class="flex flex-col gap-3 aspect-square h-[4.5rem] shadow-none text-slate-600" :target="link.openNewTab ? '_blank' : null">
            <Component :is="link.icon" class="w-6 h-6 mx-auto" />
            <div class="text-xs text-center font-medium">
              {{ link.title }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightIcon, ReaderIcon, PersonIcon, CornersIcon } from "@radix-icons/vue";
const liff = useLiff();
const isSpeaker = ref(liff.user!.type.speaker);

useHead({
  title: "活動連結"
});

const navLinks = ref([{
  title: "活動議程",
  href: "/agenda",
  icon: ReaderIcon

}, {
  title: "QR Code",
  href: "/qrcode",
  icon: CornersIcon
}, {
  title: "活動官網",
  href: "https://google.com",
  icon: ArrowTopRightIcon,
  openNewTab: true
}, {
  title: "折價券",
  href: "/coupons",
  icon: ArrowTopRightIcon
}
]
);

if (isSpeaker.value) {
  navLinks.value.push({
    title: "個人資料",
    href: "/profile",
    icon: PersonIcon
  });
}
</script>
