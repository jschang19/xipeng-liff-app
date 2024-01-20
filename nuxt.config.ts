// this import can be removed if you don't need to display the version on the page
import pkg from "./package.json";

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "LIFF Starter",
      htmlAttrs: {
        lang: "en"
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
  plugins: [],
  runtimeConfig: {
    public: {
      LIFF_ID: process.env.LIFF_ID,
      VERSION: pkg.version || "0.1.0"
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
    redirect: false
  }
});
