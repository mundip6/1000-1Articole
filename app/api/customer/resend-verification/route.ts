import { NextResponse } from "next/server";
import { resendVerificationEmail } from "@/lib/customers";

export async function POST() {
  try {
    await resendVerificationEmail();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Eroare." },
      { status: 400 },
    );
  }
}
