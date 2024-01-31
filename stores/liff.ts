import { defineStore } from "pinia";
import { liff } from "@line/liff";
import type { Profile } from "~/types";

export const useLiff = defineStore("liff", () => {
  const isLoggedIn = ref<boolean>(false);
  const isInited = ref<boolean>(false);
  const user = ref<Profile | null>(null);
  const runtimeConfig = useRuntimeConfig();
  const liffId = runtimeConfig.public.LIFF_ID;

  // Initialize LIFF SDK
  async function init () {
    if (!liffId) {
      console.log(liffId);
      console.log(runtimeConfig.public);
      console.log(process.env.LIFF_ID);
      throw new Error("Please set LIFF_ID in .env file");
    }

    try {
      if (!isInited.value) {
        await liff.init({ liffId });
        isInited.value = true;
      }

      isLoggedIn.value = liff.isLoggedIn();
      // console.log("LIFF init success", "SDK version:", liff.getVersion());
    } catch (error) {
      console.error("LIFF initialization failed:", error);
      throw error;
    }
  }

  async function setUser () {
    // upsert user and fetch user data from supabase at same time
    // to keep user data up to date

    if (isLoggedIn.value) {
      await useFetch<{
        profile: Profile;
      }>("/api/user", {
        key: "user",
        method: "GET",
        headers: {
          authorization: `${liff.getIDToken()}`
        },
        pick: ["profile"],
        onResponseError: ({ response }) => {
          if (response.status === 401) {
            logout();
          }

          console.error(response.status, response.statusText);
        },
        onResponse: ({ response }) => {
          user.value = response._data.profile;
        }
      });
    }
  }

  function login () {
    liff.login();
  }

  function logout () {
    isLoggedIn.value = false;
    user.value = null;
    liff.logout();
  }

  async function scanCode () {
    const result = await liff.scanCodeV2();
    return result.value;
  }

  function getAccessToken () {
    return liff.getAccessToken();
  }

  function getIdToken () {
    return liff.getIDToken();
  }

  function isInClient () {
    return liff.isInClient();
  }

  function checkTokenValidity () {
    const payload = liff.getDecodedIDToken();

    if (!payload) {
      return false;
    }

    const exp = payload.exp ?? 0;
    const now = Math.floor(Date.now() / 1000);
    return now < exp;
  }

  return {
    isLoggedIn,
    init,
    login,
    user,
    setUser,
    logout,
    isInClient,
    getAccessToken,
    getIdToken,
    scanCode,
    checkTokenValidity
  };
});
