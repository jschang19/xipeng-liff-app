import { useLiff } from "~/stores/liff";

// Since the middleware runs before plugins, which is the lifecycle of Nuxt,
// We need to initialize LIFF SDK here instead of in plugins/liff.client.ts

export default defineNuxtRouteMiddleware(async () => {
  const liff = useLiff();
  // This will only initialize LIFF SDK once, since there's a check for isInited.value in stores/liff.ts
  await liff.init();
});
