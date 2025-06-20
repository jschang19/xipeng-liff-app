export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "攜澎引盼 2024 活動網站",
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
    "dayjs-nuxt",
    "nuxt-gtag"
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
  pinia: {
    storesDirs: ["./stores/**"]
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false // disable default redirect
  },
  nitro: {
    compressPublicAssets: true
  },
  gtag: {
    id: "G-Q47D8WY5JX",
    loadingStrategy: "async"
  }
});
