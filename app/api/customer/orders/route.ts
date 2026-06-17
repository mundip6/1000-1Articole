import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customers";
import { listOrdersByEmail } from "@/lib/orders";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ ok: false, message: "Trebuie sa fii autentificat." }, { status: 401 });
  }

  const orders = await listOrdersByEmail(customer.email);
  return NextResponse.json({ ok: true, orders });
}
