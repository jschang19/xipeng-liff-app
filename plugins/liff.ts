import { useLiffStore } from "~/stores/liff";
export default defineNuxtPlugin({
  name: "liff",
  hooks: {
    "app:created": async () => {
      const liffStore = useLiffStore();
      await liffStore.initLiff();

      if (liffStore.isLoggedIn) {
        const tokenValid = liffStore.checkTokenValidity();

        if (!tokenValid) {
          liffStore.logout();
          navigateTo("/sign-in");
          return;
        }

        await liffStore.setUser();
      }

      ;
    },
    "page:finish": () => {
      const liffStore = useLiffStore();
      const tokenValid = liffStore.checkTokenValidity();

      if (!tokenValid) {
        liffStore.logout();
        navigateTo("/sign-in");
      }

      if (!liffStore.isLoggedIn) {
        console.log("not logged in");
        navigateTo("/sign-in");
      }
    }
  }
});
