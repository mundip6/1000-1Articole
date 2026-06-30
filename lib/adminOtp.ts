import { prisma } from "@/lib/prisma";
import { sendAdminOtpEmail, sendPackerOtpEmail } from "@/lib/email";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAndSendOtp(): Promise<void> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.adminOtp.deleteMany({ where: { used: false } });
  await prisma.adminOtp.create({ data: { code, expiresAt } });
  await sendAdminOtpEmail(code);
}

export async function createAndSendPackerOtp(): Promise<void> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.adminOtp.deleteMany({ where: { used: false } });
  await prisma.adminOtp.create({ data: { code, expiresAt } });
  await sendPackerOtpEmail(code);
}

export async function verifyOtp(code: string): Promise<boolean> {
  const otp = await prisma.adminOtp.findFirst({
    where: { code, used: false, expiresAt: { gt: new Date() } },
  });
  if (!otp) return false;
  await prisma.adminOtp.update({ where: { id: otp.id }, data: { used: true } });
  return true;
}
