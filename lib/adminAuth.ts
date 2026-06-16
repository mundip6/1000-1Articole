import { cookies } from "next/headers";

const COOKIE_NAME = "admin-session";
const COOKIE_VALUE = "authenticated";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "Carnat";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export async function setAdminAuthenticated() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearAdminAuthenticated() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
