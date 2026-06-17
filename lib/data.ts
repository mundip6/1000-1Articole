export type Category =
  | "CARNE PASARE CONGELATA"
  | "BURTA VITA"
  | "SEMIPREPARATE"
  | "PATISERIE CONGELATA"
  | "PESTE"
  | "LEGUME CONGELATE";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: "kg" | "buc";
  weight?: string;
};

export const business = {
  name: "1000&1 Articole",
  subtitle: "Articole Engros",
  address: "Baia Mare, Bdul Regele Mihai I nr 49 G",
  region: "Maramures, Romania",
  phone: "+40 750 266 304",
  phoneHref: "tel:+40750266304",
  email: "1001articole@gmail.com",
  cui: "2200749",
  delivery: "Maramures, Satu Mare, Salaj",
};

export const categories: { name: Category; icon: string; desc: string }[] = [
  { name: "CARNE PASARE CONGELATA", icon: "CP", desc: "Aripi, pulpe, piept, pui grill" },
  { name: "BURTA VITA", icon: "BV", desc: "Burta fideluta congelata" },
  { name: "SEMIPREPARATE", icon: "SP", desc: "Mezeluri, pizza, crispy, snitel, lactate" },
  { name: "PATISERIE CONGELATA", icon: "PT", desc: "Croissant, placinte, deserturi" },
  { name: "PESTE", icon: "PE", desc: "Pastrav, Merlucius, cod, macrou" },
  { name: "LEGUME CONGELATE", icon: "LG", desc: "Legume si mixuri congelate" },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
