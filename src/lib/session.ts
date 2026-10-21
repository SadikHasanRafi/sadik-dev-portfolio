import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/** True when the request carries a valid dashboard session. Use in every write path. */
export async function isAuthenticated() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}
