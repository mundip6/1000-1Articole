import { NextResponse } from "next/server";
import XLSX from "xlsx";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = [
  "CARNE PASARE CONGELATA",
  "BURTA VITA",
  "SEMIPREPARATE",
  "PATISERIE CONGELATA",
  "PESTE",
  "LEGUME CONGELATE",
  "PRODUSE LACTATE",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function parsePrice(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return isFinite(val) ? Math.round(val * 100) / 100 : null;
  const n = parseFloat(String(val).replace(",", "."));
  return isFinite(n) ? Math.round(n * 100) / 100 : null;
}

function parseUnit(val: unknown): "kg" | "buc" | "bax" {
  const v = String(val || "").toLowerCase().trim();
  if (v === "buc") return "buc";
  if (v === "bax") return "bax";
  return "kg";
}

type CellWithStyle = {
  v?: unknown;
  s?: {
    patternType?: string;
    fgColor?: { rgb?: string };
  };
};

function isYellow(cell: CellWithStyle | undefined): boolean {
  return cell?.s?.patternType === "solid" && cell?.s?.fgColor?.rgb === "FFFF00";
}

function matchCategory(name: string): string | null {
  const upper = name.toUpperCase().trim();
  return VALID_CATEGORIES.find((c) => c === upper || upper.includes(c) || c.includes(upper)) ?? null;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Neautorizat." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Eroare la citirea fisierului." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ ok: false, message: "Fisierul lipseste." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buffer, { cellStyles: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet["!ref"]) return NextResponse.json({ ok: false, message: "Fisier Excel gol." }, { status: 400 });

  const range = XLSX.utils.decode_range(sheet["!ref"]);

  let currentCategory: string | null = null;
  let imported = 0;
  let skipped = 0;
  const idSeen = new Set<string>();

  for (let r = range.s.r; r <= range.e.r; r++) {
    const cellA = sheet[XLSX.utils.encode_cell({ r, c: 0 })] as CellWithStyle | undefined;
    if (!cellA?.v) continue;

    const cellName = String(cellA.v).trim();
    if (!cellName) continue;

    const cellB = sheet[XLSX.utils.encode_cell({ r, c: 1 })] as CellWithStyle | undefined;
    const cellD = sheet[XLSX.utils.encode_cell({ r, c: 3 })] as CellWithStyle | undefined;

    // Category header: has name in A but no unit in B and no price in D
    const hasUnit = cellB?.v !== undefined && cellB.v !== "";
    const hasPrice = cellD?.v !== undefined && cellD.v !== "";
    if (!hasUnit && !hasPrice) {
      currentCategory = matchCategory(cellName);
      continue;
    }

    if (!currentCategory) { skipped++; continue; }

    const price = parsePrice(cellD?.v);
    if (!price || price <= 0) { skipped++; continue; }

    const unit = parseUnit(cellB?.v);
    const packagedByUs = isYellow(cellA);

    const baseId = slugify(cellName) || "produs";
    let id = baseId;
    let idx = 2;
    while (idSeen.has(id)) id = `${baseId}-${idx++}`;
    idSeen.add(id);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (existing) {
      await prisma.product.update({
        where: { id },
        data: { name: cellName, category: currentCategory, price, unit, packagedByUs },
      });
    } else {
      await prisma.product.create({
        data: { id, name: cellName, category: currentCategory, price, unit, packagedByUs, stock: 100 },
      });
    }
    imported++;
  }

  return NextResponse.json({ ok: true, imported, skipped });
}
