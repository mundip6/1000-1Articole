import { cookies } from "next/headers";

const COOKIE = "packer-auth";
const PENDING_COOKIE = "packer-pending";
const IS_PROD = process.env.NODE_ENV === "production";

export function getPackerPassword(): string {
  return process.env.PACKER_PASSWORD ?? "";
}

export async function setPackerAuthenticated() {
  const store = await cookies();
  store.set(COOKIE, "1", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function isPackerAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === "1";
}

export async function clearPackerAuthenticated() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function setPackerPending() {
  const store = await cookies();
  store.set(PENDING_COOKIE, "1", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
}

export async function isPackerPending(): Promise<boolean> {
  const store = await cookies();
  return store.get(PENDING_COOKIE)?.value === "1";
}

export async function clearPackerPending() {
  const store = await cookies();
  store.delete(PENDING_COOKIE);
}
