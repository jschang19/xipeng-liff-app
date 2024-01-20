import { defineStore } from "pinia";
import { liff } from "@line/liff";
import type { Profile } from "~/types";

export const useLiffStore = defineStore("liff", () => {
  const isLoggedIn = ref<boolean>(false);
  const pending = ref<boolean>(true);
  const user = ref<Profile>({
    userId: "",
    displayName: "",
    pictureUrl: "",
    email: null,
    access: "user"
  });
  const runtimeConfig = useRuntimeConfig();
  const liffId = runtimeConfig.public.LIFF_ID;

  // Initialize LIFF SDK
  async function initLiff () {
    pending.value = true;

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

  // Fetch additional user information from API
  async function fetchUser () {
    try {
      const { data: profileInfo } = await useFetch<Profile>("/api/user/info", {
        method: "GET",
        headers: {
          authorization: liff.getIDToken() as string
        }
      });

      if (profileInfo.value) {
        user.value = profileInfo.value;
      }
    } catch (error) {
      console.error("Error fetching additional user info:", error);
    }
  }

  function login () {
    liff.login();
  }

  function logout () {
    isLoggedIn.value = false;
    liff.logout();
  }

  async function scanCode () {
    const result = await liff.scanCodeV2();
    return result.value;
  }

  function getAccessToken () {
    if (!liff.isLoggedIn()) {
      throw new Error("Not logged in");
    }

    return liff.getAccessToken();
  }

  function getIdToken () {
    if (!liff.isLoggedIn()) {
      throw new Error("Not logged in");
    }

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

  return { isLoggedIn, initLiff, login, user, fetchUser, logout, getAccessToken, getIdToken, scanCode, pending, checkTokenValidity };
});
