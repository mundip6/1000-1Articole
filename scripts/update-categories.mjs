import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryMap = new Map([
  ["Pui", "CARNE PASARE CONGELATA"],
  ["Burta vita", "BURTA VITA"],
  ["Semi-preparate", "SEMIPREPARATE"],
  ["Salamuri & Mezeluri", "SEMIPREPARATE"],
  ["Felii & Specialitati", "SEMIPREPARATE"],
  ["Carnati", "SEMIPREPARATE"],
  ["Specialitati Traditionale", "SEMIPREPARATE"],
  ["Produse lactate", "SEMIPREPARATE"],
  ["Patiserie congelata", "PATISERIE CONGELATA"],
  ["Peste", "PESTE"],
  ["Legume congelate", "LEGUME CONGELATE"],
]);

for (const [oldCategory, newCategory] of categoryMap.entries()) {
  await prisma.product.updateMany({
    where: { category: oldCategory },
    data: { category: newCategory },
  });

  await prisma.orderItem.updateMany({
    where: { category: oldCategory },
    data: { category: newCategory },
  });
}

console.log("Product and order item categories updated.");
await prisma.$disconnect();
