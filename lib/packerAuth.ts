import { cookies } from "next/headers";

const COOKIE = "packer-auth";
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
