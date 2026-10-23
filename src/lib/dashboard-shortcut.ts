import { login } from "@/actions/auth";

const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Owner shortcut for the email fields: when the value doesn't look like an email, ask the server
 * whether it's the dashboard passcode (full match). Anything else is validated as a normal email.
 */
export async function tryDashboardLogin(email: string) {
  if (!email || LOOKS_LIKE_EMAIL.test(email)) return false;
  try {
    return (await login(email)).ok;
  } catch {
    return false;
  }
}
