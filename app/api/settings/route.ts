import { NextResponse } from "next/server";
import { getSettings, SETTINGS_KEYS } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings([
    SETTINGS_KEYS.MIN_ORDER_BAIA_MARE,
    SETTINGS_KEYS.MIN_ORDER_OTHER,
    SETTINGS_KEYS.SHIPPING_FEE_BAIA_MARE,
    SETTINGS_KEYS.SHIPPING_FEE_OTHER,
  ]);
  return NextResponse.json(settings);
}
