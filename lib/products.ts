import { prisma } from "@/lib/prisma";
import { type Category, type Product } from "@/lib/data";

const validCategories: Category[] = [
  "Pui",
  "Peste",
  "Salamuri & Mezeluri",
  "Felii & Specialitati",
  "Carnati",
  "Specialitati Traditionale",
  "Legume congelate",
  "Semi-preparate",
  "Burta vita",
  "Patiserie congelata",
  "Produse lactate",
];

function isCategory(value: string): value is Category {
  return validCategories.includes(value as Category);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function toProduct(product: {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  weight: string | null;
}): Product {
  return {
    id: product.id,
    name: product.name,
    category: product.category as Category,
    price: product.price,
    unit: product.unit === "buc" ? "buc" : "kg",
    ...(product.weight ? { weight: product.weight } : {}),
  };
}

export async function listProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return products.map(toProduct);
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "");
  const price = Number(formData.get("price"));
  const unit = String(formData.get("unit") || "");
  const weight = String(formData.get("weight") || "").trim();

  if (!name || !isCategory(category) || !Number.isFinite(price) || price < 0 || (unit !== "kg" && unit !== "buc")) {
    throw new Error("Datele produsului nu sunt valide.");
  }

  const baseId = slugify(name) || "produs";
  let id = baseId;
  let index = 2;
  while (await prisma.product.findUnique({ where: { id } })) {
    id = `${baseId}-${index}`;
    index += 1;
  }

  await prisma.product.create({
    data: {
      id,
      name,
      category,
      price,
      unit,
      weight: weight || null,
    },
  });
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "");
  const price = Number(formData.get("price"));
  const unit = String(formData.get("unit") || "");
  const weight = String(formData.get("weight") || "").trim();

  if (!id || !name || !isCategory(category) || !Number.isFinite(price) || price < 0 || (unit !== "kg" && unit !== "buc")) {
    throw new Error("Datele produsului nu sunt valide.");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      price,
      unit,
      weight: weight || null,
    },
  });
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.product.delete({ where: { id } });
}
