export type Category =
  | "Pui"
  | "Peste"
  | "Salamuri & Mezeluri"
  | "Felii & Specialitati"
  | "Carnati"
  | "Specialitati Traditionale"
  | "Legume congelate"
  | "Semi-preparate"
  | "Burta vita"
  | "Patiserie congelata"
  | "Produse lactate";

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
  { name: "Pui", icon: "P", desc: "Aripi, pulpe, piept, pui grill" },
  { name: "Peste", icon: "F", desc: "Pastrav, Merlucius, cod, macrou" },
  { name: "Salamuri & Mezeluri", icon: "M", desc: "Mezeluri, parizer, carne tocata" },
  { name: "Felii & Specialitati", icon: "S", desc: "Felii si specialitati ambalate" },
  { name: "Carnati", icon: "C", desc: "Carnati si produse afumate" },
  { name: "Specialitati Traditionale", icon: "T", desc: "Produse traditionale" },
  { name: "Legume congelate", icon: "L", desc: "Legume si mixuri congelate" },
  { name: "Semi-preparate", icon: "SP", desc: "Pizza, crispy, snitel, cascaval pane" },
  { name: "Burta vita", icon: "B", desc: "Burta fideluta congelata" },
  { name: "Patiserie congelata", icon: "PT", desc: "Croissant, placinte, deserturi" },
  { name: "Produse lactate", icon: "D", desc: "Cascaval, unt, mozzarella" },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
