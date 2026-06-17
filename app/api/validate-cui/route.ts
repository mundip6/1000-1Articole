import { NextResponse } from "next/server";
import { isValidCui, normalizeCui } from "@/lib/cui";

export async function POST(request: Request) {
  const body = (await request.json()) as { cui?: string };
  const normalized = normalizeCui(body.cui || "");
  const valid = isValidCui(normalized);

  return NextResponse.json({
    ok: true,
    valid,
    cui: normalized,
    message: valid ? "CUI valid." : "CUI invalid.",
  });
}
