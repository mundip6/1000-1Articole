export type Category =
  | "CARNE PASARE CONGELATA"
  | "BURTA VITA"
  | "SEMIPREPARATE"
  | "PATISERIE CONGELATA"
  | "PESTE"
  | "LEGUME CONGELATE"
  | "PRODUSE LACTATE"
  | "CONSERVE"
  | "CARNE PORC";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: "kg" | "buc" | "bax";
  weight?: string;
  imageUrl?: string;
  stock: number;
  packagedByUs: boolean;
  nutritionInfo?: string;
  specifications?: string;
  kgStep: number;
};

export const business = {
  name: "1000&1 Articole",
  subtitle: "Articole Engros",
  address: "Baia Mare, Bdul Regele Mihai I nr 49 G",
  region: "Maramures, Romania",
  phone: "+40 750 266 304",
  phoneHref: "tel:+40750266304",
  phone2: "0262 221 154",
  phoneHref2: "tel:+40262221154",
  email: "1001articole@gmail.com",
  cui: "2200749",
  delivery: "Maramures, Satu Mare, Salaj",
};

export const categories: { name: Category; icon: string; desc: string; label: string }[] = [
  { name: "CARNE PASARE CONGELATA", icon: "🍗", desc: "Aripi, pulpe, piept, pui grill", label: "CARNE PASARE" },
  { name: "BURTA VITA", icon: "🥩", desc: "Burta fideluta congelata", label: "BURTA" },
  { name: "SEMIPREPARATE", icon: "🌭", desc: "Mezeluri, pizza, crispy, snitel, lactate", label: "SEMIPREPARATE" },
  { name: "PATISERIE CONGELATA", icon: "🥐", desc: "Croissant, placinte, deserturi", label: "PATISERIE" },
  { name: "PESTE", icon: "🐟", desc: "Pastrav, Merlucius, cod, macrou", label: "PESTE" },
  { name: "LEGUME CONGELATE", icon: "🥦", desc: "Legume si mixuri congelate", label: "LEGUME" },
  { name: "PRODUSE LACTATE", icon: "🧀", desc: "Cascaval, unt, mozzarella", label: "PRODUSE LACTATE" },
  { name: "CONSERVE", icon: "🥫", desc: "Conserve legume, peste, carne", label: "CONSERVE" },
  { name: "CARNE PORC", icon: "🥓", desc: "Carne de porc congelata", label: "CARNE PORC" },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
