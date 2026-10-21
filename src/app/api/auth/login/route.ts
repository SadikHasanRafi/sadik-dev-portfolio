import { NextResponse, type NextRequest } from "next/server";
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

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: { name?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  if (!isPasscode(name) || !isPasscode(email)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  attempts.delete(ip);
  const response = NextResponse.json({ ok: true, redirect: "/dashboard" });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    // Secure whenever the visitor is on HTTPS (also behind a reverse proxy)
    secure: (request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "")) === "https",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
