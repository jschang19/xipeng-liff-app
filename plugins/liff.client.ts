export default defineNuxtPlugin({
  name: "liff",
  enforce: "pre",
  hooks: {
    "app:created": async () => {
      const liff = useLiff(); // LIFF is initialized in middleware/01.liff-init.global.ts
      const tokenValid = liff.checkTokenValidity();

      if (liff.isLoggedIn && tokenValid) {
        await liff.setUser();
      }
    }
  }
});
