import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "@/lib/sessionToken";

const COOKIE = "admin-session";
const PENDING_COOKIE = "admin-2fa-pending";
const IS_PROD = process.env.NODE_ENV === "production";

const SESSION_TTL = 60 * 60 * 12;
const PENDING_TTL = 600;

const NO_KEY = "Sesiunea nu poate fi semnata: configureaza SESSION_SECRET sau ADMIN_PASSWORD.";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

async function jar() {
  return cookies();
}

export async function isAdminAuthenticated() {
  return verifySessionToken((await jar()).get(COOKIE)?.value, "admin");
}

export async function setAdminAuthenticated() {
  const token = createSessionToken("admin", SESSION_TTL);
  if (!token) throw new Error(NO_KEY);

  (await jar()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function clearAdminAuthenticated() {
  (await jar()).delete(COOKIE);
}

export async function isAdminPending() {
  return verifySessionToken((await jar()).get(PENDING_COOKIE)?.value, "admin-2fa");
}

export async function setAdminPending() {
  const token = createSessionToken("admin-2fa", PENDING_TTL);
  if (!token) throw new Error(NO_KEY);

  (await jar()).set(PENDING_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    path: "/",
    maxAge: PENDING_TTL,
  });
}

export async function clearAdminPending() {
  (await jar()).delete(PENDING_COOKIE);
}
