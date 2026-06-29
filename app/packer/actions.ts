"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearPackerAuthenticated,
  clearPackerPending,
  isPackerAuthenticated,
  isPackerPending,
  setPackerAuthenticated,
} from "@/lib/packerAuth";
import { verifyOtp } from "@/lib/adminOtp";
import { updateOrderStatus, type OrderStatus } from "@/lib/orders";

async function requirePacker() {
  if (!(await isPackerAuthenticated())) redirect("/admin");
}

export async function verifyPackerOtp(formData: FormData) {
  if (!(await isPackerPending())) redirect("/admin");

  const code = String(formData.get("code") || "").trim();
  const valid = await verifyOtp(code);

  if (!valid) redirect("/packer/2fa?error=1");

  await clearPackerPending();
  await setPackerAuthenticated();
  redirect("/packer/orders");
}

export async function logoutPacker() {
  await clearPackerAuthenticated();
  redirect("/admin");
}

export async function updateOrderStatusPackerAction(formData: FormData) {
  await requirePacker();
  const id = String(formData.get("id") || "");
  await updateOrderStatus(id, String(formData.get("status") || "") as OrderStatus);
  revalidatePath("/packer/orders");
  revalidatePath(`/packer/orders/${id}`);
  const redirectTo = String(formData.get("redirectTo") || "/packer/orders");
  redirect(redirectTo);
}
