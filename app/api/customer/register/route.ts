import { NextResponse } from "next/server";
import { registerCustomer } from "@/lib/customers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await registerCustomer({
      firstName: String(body.firstName || ""),
      lastName: String(body.lastName || ""),
      email: String(body.email || ""),
      password: String(body.password || ""),
      isBusiness: Boolean(body.isBusiness),
    });
    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Contul nu a putut fi creat." },
      { status: 400 },
    );
  }
}
