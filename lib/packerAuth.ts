import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "@/lib/sessionToken";

const COOKIE = "packer-auth";
const PENDING_COOKIE = "packer-pending";
const IS_PROD = process.env.NODE_ENV === "production";

const SESSION_TTL = 60 * 60 * 8;
const PENDING_TTL = 60 * 15;

const NO_KEY = "Sesiunea nu poate fi semnata: configureaza SESSION_SECRET sau ADMIN_PASSWORD.";

export function getPackerPassword(): string {
  return process.env.PACKER_PASSWORD ?? "";
}

export async function setPackerAuthenticated() {
  const token = createSessionToken("packer", SESSION_TTL);
  if (!token) throw new Error(NO_KEY);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function isPackerAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value, "packer");
}

export async function clearPackerAuthenticated() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function setPackerPending() {
  const token = createSessionToken("packer-2fa", PENDING_TTL);
  if (!token) throw new Error(NO_KEY);

  const store = await cookies();
  store.set(PENDING_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: PENDING_TTL,
  });
}

export async function isPackerPending(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(PENDING_COOKIE)?.value, "packer-2fa");
}

export async function clearPackerPending() {
  const store = await cookies();
  store.delete(PENDING_COOKIE);
}
