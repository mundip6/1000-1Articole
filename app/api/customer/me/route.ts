import { NextResponse } from "next/server";
import { getCurrentCustomer, updateCustomerProfile } from "@/lib/customers";

export async function GET() {
  const customer = await getCurrentCustomer();
  return NextResponse.json({ ok: true, customer });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const customer = await updateCustomerProfile({
      firstName: String(body.firstName || ""),
      lastName: String(body.lastName || ""),
      isBusiness: Boolean(body.isBusiness),
      company: String(body.company || ""),
      cui: String(body.cui || ""),
      phone: String(body.phone || ""),
      county: String(body.county || ""),
      city: String(body.city || ""),
      address: String(body.address || ""),
    });
    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Profilul nu a putut fi salvat." },
      { status: 400 },
    );
  }
}
