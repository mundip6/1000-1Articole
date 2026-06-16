"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminAuthenticated, getAdminPassword, isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminAuth";
import { updateOrderStatus, type OrderStatus } from "@/lib/orders";
import { createProduct, deleteProduct, updateProduct } from "@/lib/products";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password !== getAdminPassword()) {
    redirect("/admin?error=1");
  }

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
  await updateOrderStatus(String(formData.get("id") || ""), String(formData.get("status") || "") as OrderStatus);
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}
