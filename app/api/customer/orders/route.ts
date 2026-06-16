import { NextResponse } from "next/server";
import { listOrders } from "@/lib/orders";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; phone?: string };
  const email = normalize(body.email || "");
  const phone = normalize(body.phone || "");

  if (!email || !phone) {
    return NextResponse.json({ ok: false, message: "Emailul si telefonul sunt obligatorii." }, { status: 400 });
  }

  const orders = await listOrders();
  const customerOrders = orders.filter(
    (order) => normalize(order.email) === email && normalize(order.phone) === phone,
  );

  const latest = customerOrders[0];

  return NextResponse.json({
    ok: true,
    customer: latest
      ? {
          company: latest.company,
          contact: latest.contact,
          phone: latest.phone,
          email: latest.email,
          county: latest.county,
          city: latest.city,
          address: latest.address,
        }
      : {
          phone: body.phone || "",
          email: body.email || "",
        },
    orders: customerOrders,
  });
}
