export default defineNuxtPlugin({
  name: "liff",
  enforce: "pre",
  hooks: {
    "app:created": async () => {
      const liff = useLiff();
      await liff.init();
      const tokenValid = liff.checkTokenValidity();

      if (liff.isLoggedIn && tokenValid) {
        await liff.setUser();
      }
    }
  }
});
