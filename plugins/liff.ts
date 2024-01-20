import liff from "@line/liff";
import { useLiffStore } from "~/stores/liff";
export default defineNuxtPlugin({
  name: "liff",
  hooks: {
    "app:created": async () => {
      const liffStore = useLiffStore();
      await liffStore.initLiff();

      // upsert user into supabase when app is created
      if (liffStore.isLoggedIn) {
        // await useFetch("/api/user", {
        //   method: "POST",
        //   headers: {
        //     authorization: `${liffStore.getIdToken()}`
        //   }
        // });
        // await liffStore.fetchUser();

        await Promise.all([
          useFetch("/api/user", {
            method: "POST",
            headers: {
              authorization: `${liffStore.getIdToken()}`
            }
          }),
          liffStore.fetchUser()
        ]);
      }
    },
    "page:finish": () => {
      const liffStore = useLiffStore();
      const tokenValid = liffStore.checkTokenValidity();

      if (!tokenValid) {
        liffStore.logout();
        liffStore.isLoggedIn = false;
        navigateTo("/sign-in");
      }

      if (!liffStore.isLoggedIn) {
        console.log("not logged in");
        navigateTo("/sign-in");
      }
    }
  }
});
