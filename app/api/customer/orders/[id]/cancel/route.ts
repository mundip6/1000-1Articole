import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customers";
import { cancelCustomerOrder } from "@/lib/orders";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ ok: false, message: "Trebuie sa fii autentificat." }, { status: 401 });
    }

    const { id } = await params;
    await cancelCustomerOrder(id, customer.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Comanda nu a putut fi anulata." },
      { status: 400 },
    );
  }
}
