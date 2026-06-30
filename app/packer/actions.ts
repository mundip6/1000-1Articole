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
import { updateOrderItemsActualQty, updateOrderStatus, type OrderStatus } from "@/lib/orders";

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

export async function updateOrderActualWeightsPackerAction(formData: FormData) {
  await requirePacker();
  const orderId = String(formData.get("orderId") || "");
  const updates: { itemId: string; actualQty: number }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("actualQty_")) {
      const itemId = key.slice("actualQty_".length);
      const qty = parseFloat(String(value));
      if (itemId && !isNaN(qty) && qty >= 0) updates.push({ itemId, actualQty: qty });
    }
  }
  if (updates.length > 0) await updateOrderItemsActualQty(orderId, updates);
  revalidatePath(`/packer/orders/${orderId}`);
  redirect(`/packer/orders/${orderId}`);
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
