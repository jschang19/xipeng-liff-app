// middleware/auth.ts
import { useLiff } from "~/stores/liff";

export default defineNuxtRouteMiddleware((to, _) => {
  const SIGN_IN_PATH = "/sign-in";

  const liff = useLiff();
  const tokenValid = liff.checkTokenValidity();

  if (to.path === SIGN_IN_PATH) {
    if (tokenValid) {
      return navigateTo("/");
    }

    // Not logged in user can access sign-in page
    // This is necessary to prevent infinite loop
    return;
  }

  // Logic to redirect user to sign-in page if not logged in
  if (!tokenValid || !liff.isLoggedIn) {
    return navigateTo(SIGN_IN_PATH);
  }
});
