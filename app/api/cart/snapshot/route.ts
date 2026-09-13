import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — create or update a cart snapshot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      id?: string;
      items: { id: string; name: string; price: number; salePrice?: number; unit: string; qty: number }[];
      total: number;
      email?: string;
      phone?: string;
      contact?: string;
      county?: string;
      city?: string;
    };

    if (!body.items?.length) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Update existing snapshot if id provided and not yet converted
    if (body.id) {
      const existing = await prisma.abandonedCart.findUnique({ where: { id: body.id } });
      if (existing && !existing.converted) {
        const updated = await prisma.abandonedCart.update({
          where: { id: body.id },
          data: {
            items: body.items,
            total: body.total,
            email: body.email || existing.email || null,
            phone: body.phone || existing.phone || null,
            contact: body.contact || existing.contact || null,
            county: body.county || existing.county || null,
            city: body.city || existing.city || null,
          },
        });
        return NextResponse.json({ ok: true, id: updated.id });
      }
    }

    // Create new snapshot
    const record = await prisma.abandonedCart.create({
      data: {
        items: body.items,
        total: body.total,
        email: body.email || null,
        phone: body.phone || null,
        contact: body.contact || null,
        county: body.county || null,
        city: body.city || null,
      },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// PATCH — mark a snapshot as converted
export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json() as { id: string };
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });

    await prisma.abandonedCart.update({
      where: { id },
      data: { converted: true },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
