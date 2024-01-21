export default defineNuxtPlugin({
  name: "liff",
  enforce: "pre",
  hooks: {
    "app:created": async () => {
      const liff = useLiff();
      await liff.init();

      if (liff.isLoggedIn) {
        const tokenValid = liff.checkTokenValidity();

        if (!tokenValid) {
          const nuxtApp = useNuxtApp();
          liff.logout();
          nuxtApp.$router.replace("/sign-in");
        } else {
          await liff.setUser();
        }
      }

      ;
    },
    "page:finish": async () => {
      const liff = useLiff();
      const tokenValid = liff.checkTokenValidity();

      if (!tokenValid) {
        liff.logout();
        await navigateTo("/sign-in", {
          replace: true
        });
        return;
      }

      if (!liff.isLoggedIn) {
        console.log("not logged in");
        await navigateTo("/sign-in", {
          replace: true
        });
      }
    }
  }
});
