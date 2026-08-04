import { NextResponse } from "next/server";
import XLSX from "xlsx";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Neautorizat." }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: { name: true, price: true, salePrice: true, unit: true, category: true },
  });

  const rows = products.map((p) => ({
    Produs: p.name,
    "Pret (lei)": p.salePrice ?? p.price,
    Unitate: p.unit,
    Categorie: p.category,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  ws["!cols"] = [{ wch: 48 }, { wch: 12 }, { wch: 10 }, { wch: 28 }];

  XLSX.utils.book_append_sheet(wb, ws, "Produse");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="produse-in-stoc.xlsx"',
    },
  });
}
