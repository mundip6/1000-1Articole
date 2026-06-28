import { NextResponse } from "next/server";
import { loginCustomer } from "@/lib/customers";
import { checkRateLimit, getIP } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = getIP(request);
  const { allowed, retryAfter } = await checkRateLimit(`customer-login:${ip}`, 10, 15 * 60);

  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: `Prea multe incercari. Incearca din nou peste ${Math.ceil(retryAfter / 60)} minute.` },
      { status: 429 },
    );
  }

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
