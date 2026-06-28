import { cookies } from "next/headers";

const COOKIE = "admin-session";
const PENDING_COOKIE = "admin-2fa-pending";
const IS_PROD = process.env.NODE_ENV === "production";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

async function jar() {
  return cookies();
}

export async function isAdminAuthenticated() {
  return (await jar()).get(COOKIE)?.value === "authenticated";
}

export async function setAdminAuthenticated() {
  (await jar()).set(COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    path: "/",
  });
}

export async function clearAdminAuthenticated() {
  (await jar()).delete(COOKIE);
}

export async function isAdminPending() {
  return (await jar()).get(PENDING_COOKIE)?.value === "1";
}

export async function setAdminPending() {
  (await jar()).set(PENDING_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    path: "/",
    maxAge: 600,
  });
}

export async function clearAdminPending() {
  (await jar()).delete(PENDING_COOKIE);
}
