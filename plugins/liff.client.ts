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
        } else {
          await liffStore.setUser();
        }
      }

      ;
    },
    "page:finish": async () => {
      const liffStore = useLiffStore();
      const tokenValid = liffStore.checkTokenValidity();

      if (!tokenValid) {
        liffStore.logout();
        await navigateTo("/sign-in", {
          replace: true
        });
        return;
      }

      if (!liffStore.isLoggedIn) {
        console.log("not logged in");
        await navigateTo("/sign-in", {
          replace: true
        });
      }
    }
  }
});
