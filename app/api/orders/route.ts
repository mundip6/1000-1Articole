import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { checkRateLimit, getIP } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = getIP(request);
  const { allowed, retryAfter } = await checkRateLimit(`order:${ip}`, 5, 60 * 60);

  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: `Prea multe comenzi. Incearca din nou peste ${Math.ceil(retryAfter / 60)} minute.` },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Comanda nu a putut fi salvata.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
