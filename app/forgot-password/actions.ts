"use server";

import { randomBytes, scryptSync } from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendCustomerPasswordResetEmail } from "@/lib/email";

function generate6DigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function requestCustomerPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    redirect("/forgot-password?error=not-found");
  }

  await prisma.passwordResetToken.updateMany({
    where: { email, role: "customer", used: false },
    data: { used: true },
  });

  const code = generate6DigitCode();
  const token = await prisma.passwordResetToken.create({
    data: {
      role: "customer",
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await sendCustomerPasswordResetEmail(code, email);

  redirect(`/forgot-password/verify?token=${token.id}`);
}

export async function verifyCustomerResetCode(formData: FormData) {
  const tokenId = String(formData.get("tokenId") || "");
  const code = String(formData.get("code") || "").trim();

  const token = await prisma.passwordResetToken.findUnique({ where: { id: tokenId } });

  if (!token || token.used || token.role !== "customer" || token.expiresAt < new Date()) {
    redirect("/forgot-password?error=expired");
  }

  if (token.code !== code) {
    redirect(`/forgot-password/verify?token=${tokenId}&error=invalid`);
  }

  await prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { verified: true },
  });

  redirect(`/forgot-password/reset?token=${tokenId}`);
}

export async function saveCustomerNewPassword(formData: FormData) {
  const tokenId = String(formData.get("tokenId") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  const token = await prisma.passwordResetToken.findUnique({ where: { id: tokenId } });

  if (!token || !token.verified || token.used || token.role !== "customer" || !token.email || token.expiresAt < new Date()) {
    redirect("/forgot-password?error=expired");
  }

  if (password.length < 6) {
    redirect(`/forgot-password/reset?token=${tokenId}&error=short`);
  }

  if (password !== confirm) {
    redirect(`/forgot-password/reset?token=${tokenId}&error=mismatch`);
  }

  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  await prisma.customer.update({
    where: { email: token.email },
    data: { passwordHash: `${salt}:${hash}` },
  });

  await prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { used: true },
  });

  redirect("/cont?success=password-reset");
}
