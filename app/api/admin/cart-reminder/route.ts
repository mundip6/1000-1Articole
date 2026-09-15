import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendAbandonedCartReminderEmail } from "@/lib/email";

type CartItem = { name: string; price: number; salePrice?: number; unit: string; qty: number };

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const carts = await prisma.abandonedCart.findMany({
    where: {
      converted: false,
      email: { not: null },
      reminderSentAt: null,
      createdAt: { lte: fiveHoursAgo, gte: sevenDaysAgo },
    },
    take: 50,
  });

  let sent = 0;
  const errors: string[] = [];

  for (const cart of carts) {
    try {
      await sendAbandonedCartReminderEmail(
        cart.email!,
        cart.items as CartItem[],
        cart.total,
        cart.contact,
      );
      await prisma.abandonedCart.update({
        where: { id: cart.id },
        data: { reminderSentAt: new Date() },
      });
      sent++;
    } catch (e) {
      errors.push(cart.email!);
    }
  }

  return NextResponse.json({ ok: true, sent, total: carts.length, errors });
}
