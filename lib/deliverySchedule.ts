export type DeliveryDay = "Luni–Vineri" | "Marți" | "Miercuri" | "Joi" | "Vineri" | "Marți / Miercuri";

export interface CityDelivery {
  day: DeliveryDay;
  county: string;
  isMaramures: boolean; // drives the minimum order threshold
}

export const CITY_SCHEDULE: Record<string, CityDelivery> = {
  // Baia Mare — headquarters, flexible delivery
  "Baia Mare":            { day: "Luni–Vineri",    county: "Maramureș", isMaramures: true },
  // Maramureș — Tuesday route
  "Ulmeni":               { day: "Marți",          county: "Maramureș", isMaramures: true },
  "Șomcuta Mare":         { day: "Marți",          county: "Maramureș", isMaramures: true },
  "Borșa":                { day: "Marți",          county: "Maramureș", isMaramures: true },
  "Moisei":               { day: "Marți",          county: "Maramureș", isMaramures: true },
  // Maramureș — Wednesday route
  "Seini":                { day: "Miercuri",       county: "Maramureș", isMaramures: true },
  "Vișeu de Sus":         { day: "Miercuri",       county: "Maramureș", isMaramures: true },
  // Valley Izei on both Tue & Wed routes
  "Valea Izei":           { day: "Marți / Miercuri", county: "Maramureș", isMaramures: true },
  // Maramureș — Thursday route
  "Sighetu Marmației":    { day: "Joi",            county: "Maramureș", isMaramures: true },
  "Ocna Șugatag":         { day: "Joi",            county: "Maramureș", isMaramures: true },
  "Cavnic":               { day: "Joi",            county: "Maramureș", isMaramures: true },
  // Maramureș — Friday route
  "Târgu Lăpuș":          { day: "Vineri",         county: "Maramureș", isMaramures: true },
  "Copalnic-Mănăștur":    { day: "Vineri",         county: "Maramureș", isMaramures: true },
  // Satu Mare — Wednesday route
  "Satu Mare":            { day: "Miercuri",       county: "Satu Mare",  isMaramures: false },
  "Negrești-Oaș":         { day: "Miercuri",       county: "Satu Mare",  isMaramures: false },
  "Livada":               { day: "Miercuri",       county: "Satu Mare",  isMaramures: false },
  "Turț":                 { day: "Miercuri",       county: "Satu Mare",  isMaramures: false },
  // Sălaj — Tuesday route
  "Jibou":                { day: "Marți",          county: "Sălaj",      isMaramures: false },
  "Cehu Silvaniei":       { day: "Marți",          county: "Sălaj",      isMaramures: false },
  // Sălaj — Thursday route
  "Zalău":                { day: "Joi",            county: "Sălaj",      isMaramures: false },
  "Șimleul Silvaniei":    { day: "Joi",            county: "Sălaj",      isMaramures: false },
  // Sălaj — Friday route
  "Ileanda":              { day: "Vineri",         county: "Sălaj",      isMaramures: false },
  // Bistrița-Năsăud — Friday route
  "Beclean":              { day: "Vineri",         county: "Bistrița-Năsăud", isMaramures: false },
  // Cluj — Friday route
  "Dej":                  { day: "Vineri",         county: "Cluj",       isMaramures: false },
};

export const CITIES_BY_COUNTY: Record<string, string[]> = {
  "Maramureș": [
    "Baia Mare", "Ulmeni", "Șomcuta Mare", "Borșa", "Moisei",
    "Seini", "Vișeu de Sus", "Valea Izei", "Sighetu Marmației",
    "Ocna Șugatag", "Cavnic", "Târgu Lăpuș", "Copalnic-Mănăștur",
  ],
  "Satu Mare": ["Satu Mare", "Negrești-Oaș", "Livada", "Turț"],
  "Sălaj": ["Jibou", "Cehu Silvaniei", "Zalău", "Șimleul Silvaniei", "Ileanda"],
  "Bistrița-Năsăud": ["Beclean"],
  "Cluj": ["Dej"],
};
