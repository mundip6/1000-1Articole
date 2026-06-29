"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearPackerAuthenticated, isPackerAuthenticated } from "@/lib/packerAuth";
import { updateOrderStatus, type OrderStatus } from "@/lib/orders";

async function requirePacker() {
  if (!(await isPackerAuthenticated())) redirect("/admin");
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
