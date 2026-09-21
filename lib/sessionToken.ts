import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signing key for session cookies. SESSION_SECRET is preferred; ADMIN_PASSWORD
 * is accepted so existing deployments keep working without a new env var.
 * Rotating either value invalidates all outstanding sessions.
 *
 * In production with neither set this returns "" and every check fails closed —
 * nobody can sign in, but nobody can forge a session either.
 */
function signingKey(): string {
  const configured = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? "" : "dev-only-insecure-key";
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url");
}

/** Returns a signed `subject.expiry.signature` token, or null if no key is configured. */
export function createSessionToken(subject: string, ttlSeconds: number): string | null {
  const key = signingKey();
  if (!key) return null;

  const body = `${subject}.${Date.now() + ttlSeconds * 1000}`;
  return `${body}.${sign(body, key)}`;
}

/**
 * Verifies signature and expiry, then returns the subject the token asserts.
 * Returns null on any tampering, expiry or missing key — always fails closed.
 * Use this when the subject is not known ahead of time (e.g. a customer id).
 */
export function readSessionToken(token: string | undefined): string | null {
  const key = signingKey();
  if (!token || !key) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [subject, expiry, signature] = parts;

  const expiresAt = Number(expiry);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;

  const expected = Buffer.from(sign(`${subject}.${expiry}`, key));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  return subject;
}

/** Verifies signature, subject and expiry. Tampering or a missing key fails closed. */
export function verifySessionToken(token: string | undefined, subject: string): boolean {
  return readSessionToken(token) === subject;
}
