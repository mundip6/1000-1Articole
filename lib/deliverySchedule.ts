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

export const COUNTIES = Object.keys(CITIES_BY_COUNTY);

/** Matching key ignoring case, diacritics and punctuation: "BAIA mare" and "Baia-Mare" both give "baia mare". */
export function normalizeCity(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const ROUTE_CITY_BY_KEY = new Map(
  Object.keys(CITY_SCHEDULE).map((name) => [normalizeCity(name), name]),
);

const WEEKDAY_ORDER = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"];

/** The individual weekdays an entry covers. Baia Mare's flexible window is not a route day. */
function routeWeekdays(day: DeliveryDay): string[] {
  if (day === "Luni–Vineri") return [];
  return day.split(" / ").map((part) => part.trim());
}

/** Distinct weekdays a route actually runs in this county, in week order. */
export function countyRouteDays(county: string): string[] {
  const days = new Set<string>();
  for (const entry of Object.values(CITY_SCHEDULE)) {
    if (entry.county === county) {
      for (const day of routeWeekdays(entry.day)) days.add(day);
    }
  }
  return WEEKDAY_ORDER.filter((day) => days.has(day));
}

/** ["Marți","Miercuri","Joi"] → "Marți, Miercuri sau Joi" */
export function formatDays(days: string[]): string {
  if (days.length <= 1) return days[0] ?? "";
  return `${days.slice(0, -1).join(", ")} sau ${days[days.length - 1]}`;
}

/** The order minimum and shipping fee are keyed off the county, matching createOrder. */
export function isMaramuresCounty(county: string): boolean {
  return county === "Maramureș";
}

export type DeliveryMatch =
  | { kind: "route"; city: string; day: DeliveryDay; county: string }
  | { kind: "estimate"; county: string; days: string[] }
  | { kind: "none" };

/**
 * Resolves a typed locality. A city on the route matches however it was typed;
 * anything else falls back to the days we run routes in the selected county.
 * If the typed city belongs to a different county than the one selected, the
 * county wins — it is what drives pricing server-side.
 */
export function resolveDelivery(city: string, county?: string): DeliveryMatch {
  const typed = city.trim();

  if (typed) {
    const name = ROUTE_CITY_BY_KEY.get(normalizeCity(typed));
    if (name) {
      const entry = CITY_SCHEDULE[name];
      if (!county || entry.county === county) {
        return { kind: "route", city: name, day: entry.day, county: entry.county };
      }
    }
  }

  if (county) {
    const days = countyRouteDays(county);
    if (days.length) return { kind: "estimate", county, days };
  }

  return { kind: "none" };
}
