import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();
const root = process.cwd();

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function readJson(relativePath, fallback) {
  try {
    const raw = await readFile(path.join(root, relativePath), "utf8");
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""));
    return Array.isArray(parsed) ? parsed : parsed.value || fallback;
  } catch {
    return fallback;
  }
}

const products = await readJson("data/products.json", []);
const orders = await readJson("data/orders.json", []);

for (const product of products) {
  await prisma.product.upsert({
    where: { id: product.id },
    create: {
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      unit: product.unit,
      weight: product.weight || null,
    },
    update: {
      name: product.name,
      category: product.category,
      price: Number(product.price),
      unit: product.unit,
      weight: product.weight || null,
    },
  });
}

for (const order of orders) {
  await prisma.order.upsert({
    where: { id: order.id },
    create: {
      id: order.id,
      createdAt: toDate(order.createdAt),
      status: order.status || "Noua",
      company: order.company,
      contact: order.contact,
      phone: order.phone,
      email: order.email,
      county: order.county,
      city: order.city || "",
      address: order.address || "",
      notes: order.notes || "",
      total: Number(order.total),
      weight: Number(order.weight),
      items: {
        create: (order.items || []).map((item) => ({
          productId: item.id,
          name: item.name,
          category: item.category,
          price: Number(item.price),
          unit: item.unit,
          weight: item.weight || null,
          qty: Number(item.qty || 1),
        })),
      },
    },
    update: {
      status: order.status || "Noua",
      company: order.company,
      contact: order.contact,
      phone: order.phone,
      email: order.email,
      county: order.county,
      city: order.city || "",
      address: order.address || "",
      notes: order.notes || "",
      total: Number(order.total),
      weight: Number(order.weight),
    },
  });
}

console.log(`Seeded ${products.length} products and ${orders.length} orders.`);
await prisma.$disconnect();
