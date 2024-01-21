import { defineStore } from "pinia";
import { liff } from "@line/liff";
import type { Profile } from "~/types";

export const useLiff = defineStore("liff", () => {
  const isLoggedIn = ref<boolean>(false);
  const user = ref<Profile | null>(null);
  const runtimeConfig = useRuntimeConfig();
  const liffId = runtimeConfig.public.LIFF_ID;

  // Initialize LIFF SDK
  async function init () {
    if (!liffId) {
      throw new Error("Please set LIFF_ID in .env file");
    }

    try {
      await liff.init({ liffId });
      isLoggedIn.value = liff.isLoggedIn();
      console.log("LIFF init success", "SDK version:", liff.getVersion());
    } catch (error) {
      console.error("LIFF initialization failed:", error);
    }
  }

  async function setUser () {
    // upsert user and fetch user data from supabase at same time
    // to keep user data up to date
    const { data: upsertedUser, error } = await useFetch<{
      profile: Profile;
    }>("/api/user", {
      key: "user",
      method: "POST",
      headers: {
        authorization: `${liff.getIDToken()}}`
      },
      pick: ["profile"]
    });

    if (error.value) {
      if (error.value.statusCode === 401) {
        logout();
        return;
      }

      throw error.value;
    }

    user.value = upsertedUser.value!.profile;
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

  function checkTokenValidity () {
    const payload = liff.getDecodedIDToken();
    // check exp in payload and determine if token is expired
    // return true if token is valid

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
    getAccessToken,
    getIdToken,
    scanCode,
    checkTokenValidity
  };
});
