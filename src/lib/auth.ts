/**
 * Dashboard sessions: an HMAC-signed, expiring token in an HttpOnly cookie.
 * Uses Web Crypto so the same code runs in proxy.ts and in server actions.
 */
export const SESSION_COOKIE = "sr_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

const toBase64Url = (bytes: ArrayBuffer | Uint8Array) =>
  Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).toString("base64url");

async function hmac(data: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) throw new Error("SESSION_SECRET is missing or too short");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string) {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function createSessionToken() {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })));
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    if (!safeEqual(signature, await hmac(payload))) return false;
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Passcode check for the "Let's Talk" shortcut (the email field equals the code). */
export function isPasscode(value: string) {
  const code = process.env.DASHBOARD_PASSCODE;
  return Boolean(code) && safeEqual(value.trim(), code!);
}
