"use server";

import { track } from "@vercel/analytics/server";
import { cookies, headers } from "next/headers";
import { log } from "@/lib/log";
import { createSessionToken, isPasscode, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth";

// In-memory attempt limiter: 8 tries per IP per 15 minutes.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function limited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export type LoginResult = { ok: true } | { ok: false; error?: string };

/** Owner shortcut: the email field equals the dashboard passcode. Sets the session cookie. */
export async function login(email: string): Promise<LoginResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    log.warn("auth", "Login rate limit hit", { ip });
    await track("dashboard_login_blocked");
    return { ok: false, error: "Too many attempts. Try again later." };
  }

  if (typeof email !== "string" || !isPasscode(email)) {
    log.warn("auth", "Failed dashboard login", { ip });
    await track("dashboard_login_failed");
    return { ok: false };
  }

  log.info("auth", "Dashboard login", { ip });
  attempts.delete(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    // Secure whenever the visitor is on HTTPS (also behind a reverse proxy)
    secure: h.get("x-forwarded-proto") === "https",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return { ok: true };
}

export async function logout(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
