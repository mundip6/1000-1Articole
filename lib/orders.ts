import { prisma } from "@/lib/prisma";
import { type Category } from "@/lib/data";
import { isValidCui, normalizeCui } from "@/lib/cui";

export type OrderStatus = "Noua" | "Confirmata" | "Livrata" | "Anulata";

export type OrderItem = {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: "kg" | "buc";
  weight?: string;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  company: string;
  cui: string;
  contact: string;
  phone: string;
  email: string;
  county: string;
  city: string;
  address: string;
  notes: string;
  items: OrderItem[];
  total: number;
  weight: number;
};

export type OrderInput = {
  isBusiness?: boolean;
  company?: string;
  cui?: string;
  contact: string;
  phone: string;
  email: string;
  county: string;
  city?: string;
  address?: string;
  notes?: string;
  items: OrderItem[];
};

function orderTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function orderWeight(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + (item.unit === "kg" ? item.qty : 0), 0);
}

function toOrder(order: {
  id: string;
  createdAt: Date;
  status: string;
  company: string;
  cui: string;
  contact: string;
  phone: string;
  email: string;
  county: string;
  city: string;
  address: string;
  notes: string;
  total: number;
  weight: number;
  items: {
    productId: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    weight: string | null;
    qty: number;
  }[];
}): Order {
  return {
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    status: order.status as OrderStatus,
    company: order.company,
    cui: order.cui,
    contact: order.contact,
    phone: order.phone,
    email: order.email,
    county: order.county,
    city: order.city,
    address: order.address,
    notes: order.notes,
    total: order.total,
    weight: order.weight,
    items: order.items.map((item) => ({
      id: item.productId,
      name: item.name,
      category: item.category as Category,
      price: item.price,
      unit: item.unit === "buc" ? "buc" : "kg",
      ...(item.weight ? { weight: item.weight } : {}),
      qty: item.qty,
    })),
  };
}

export async function listOrders(): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toOrder);
}

export async function createOrder(input: OrderInput) {
  if (!input.contact || !input.phone || !input.email || !input.county || !input.items.length) {
    throw new Error("Comanda nu contine toate datele obligatorii.");
  }

  const cui = normalizeCui(input.cui || "");
  if (input.isBusiness && !isValidCui(cui)) {
    throw new Error("CUI invalid. Pentru comenzi pe firma, CUI este obligatoriu si trebuie sa fie valid.");
  }

  const order = await prisma.order.create({
    data: {
      id: `ORD-${Date.now()}`,
      status: "Noua",
      company: input.company || "",
      cui: input.isBusiness ? cui : "",
      contact: input.contact,
      phone: input.phone,
      email: input.email,
      county: input.county,
      city: input.city || "",
      address: input.address || "",
      notes: input.notes || "",
      total: Number(orderTotal(input.items).toFixed(2)),
      weight: Number(orderWeight(input.items).toFixed(2)),
      items: {
        create: input.items.map((item) => ({
          productId: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          unit: item.unit,
          weight: item.weight || null,
          qty: item.qty,
        })),
      },
    },
    include: { items: true },
  });

  return toOrder(order);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const allowed: OrderStatus[] = ["Noua", "Confirmata", "Livrata", "Anulata"];
  if (!allowed.includes(status)) {
    throw new Error("Status invalid.");
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  });
}

export async function listOrdersByEmail(email: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    where: { email },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toOrder);
}

export async function cancelCustomerOrder(id: string, email: string) {
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order || order.email !== email) {
    throw new Error("Comanda nu a fost gasita.");
  }

  if (order.status !== "Noua") {
    throw new Error("Comanda poate fi anulata doar daca are statusul Noua.");
  }

  await prisma.order.update({
    where: { id },
    data: { status: "Anulata" },
  });
}
