export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "攜澎引盼 2024 活動網站",
      titleTemplate: "%s - 攜澎引盼 2024",
      htmlAttrs: {
        lang: "zh-Hant-TW"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
      ]
    }
  },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "@nuxt/image",
    "dayjs-nuxt"
  ],
  runtimeConfig: {
    public: {
      LIFF_ID: process.env.LIFF_ID
    },
    CLIENT_ID: process.env.CLIENT_ID
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui"
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false // disable default redirect
  }
});
