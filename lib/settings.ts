import { prisma } from "@/lib/prisma";

export const SETTINGS_KEYS = {
  MIN_ORDER_BAIA_MARE: "min_order_baia_mare",
  MIN_ORDER_OTHER: "min_order_other",
  SHIPPING_FEE_BAIA_MARE: "shipping_fee_baia_mare",
  SHIPPING_FEE_OTHER: "shipping_fee_other",
} as const;

const DEFAULTS: Record<string, string> = {
  min_order_baia_mare: "50",
  min_order_other: "300",
  shipping_fee_baia_mare: "0",
  shipping_fee_other: "0",
};

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.siteSettings.findUnique({ where: { key } });
  return row?.value ?? DEFAULTS[key] ?? "";
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await prisma.siteSettings.findMany({ where: { key: { in: keys } } });
  const map: Record<string, string> = {};
  for (const key of keys) {
    map[key] = rows.find((r) => r.key === key)?.value ?? DEFAULTS[key] ?? "";
  }
  return map;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
