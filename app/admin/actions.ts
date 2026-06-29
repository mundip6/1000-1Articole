"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminAuthenticated,
  clearAdminPending,
  getAdminPassword,
  isAdminAuthenticated,
  isAdminPending,
  setAdminAuthenticated,
  setAdminPending,
} from "@/lib/adminAuth";
import { getPackerPassword, setPackerAuthenticated } from "@/lib/packerAuth";
import { createAndSendOtp, verifyOtp } from "@/lib/adminOtp";
import { checkRateLimit } from "@/lib/rateLimit";
import { updateOrderStatus, type OrderStatus } from "@/lib/orders";
import { createProduct, deleteProduct, updateProduct } from "@/lib/products";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
}

async function getIP(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function loginAdmin(formData: FormData) {
  const ip = await getIP();
  const { allowed, retryAfter } = await checkRateLimit(`admin-login:${ip}`, 5, 15 * 60);

  if (!allowed) {
    redirect(`/admin?error=rate&wait=${retryAfter}`);
  }

  const password = String(formData.get("password") || "");

  const packerPassword = getPackerPassword();
  if (packerPassword && password === packerPassword) {
    await setPackerAuthenticated();
    redirect("/packer/orders");
  }

  if (password !== getAdminPassword()) {
    redirect("/admin?error=1");
  }

  await createAndSendOtp();
  await setAdminPending();
  redirect("/admin/2fa");
}

export async function verifyAdminOtp(formData: FormData) {
  if (!(await isAdminPending())) redirect("/admin");

  const code = String(formData.get("code") || "").trim();
  const valid = await verifyOtp(code);

  if (!valid) redirect("/admin/2fa?error=1");

  await clearAdminPending();
  await setAdminAuthenticated();
  redirect("/admin/products");
}

export async function logoutAdmin() {
  await clearAdminAuthenticated();
  redirect("/admin");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  await createProduct(formData);
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  await updateProduct(formData);
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await deleteProduct(formData);
  revalidatePath("/catalog");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await updateOrderStatus(id, String(formData.get("status") || "") as OrderStatus);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  const redirectTo = String(formData.get("redirectTo") || "/admin/orders");
  redirect(redirectTo);
}
