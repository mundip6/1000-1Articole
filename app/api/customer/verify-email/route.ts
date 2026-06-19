import { NextResponse } from "next/server";
import { verifyCustomerEmail } from "@/lib/customers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";

  try {
    await verifyCustomerEmail(token);
    return NextResponse.redirect(new URL("/cont?verified=1", request.url));
  } catch {
    return NextResponse.redirect(new URL("/cont?verified=0", request.url));
  }
}
