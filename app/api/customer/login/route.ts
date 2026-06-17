import { NextResponse } from "next/server";
import { loginCustomer } from "@/lib/customers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await loginCustomer(String(body.email || ""), String(body.password || ""));
    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Autentificarea a esuat." },
      { status: 401 },
    );
  }
}
