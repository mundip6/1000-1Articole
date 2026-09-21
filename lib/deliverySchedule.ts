export type DeliveryDay = "Luni–Vineri" | "Marți" | "Miercuri" | "Joi" | "Vineri" | "Marți / Miercuri";

export interface CityDelivery {
  day: DeliveryDay;
  county: string;
}

export const CITY_SCHEDULE: Record<string, CityDelivery> = {
  // Baia Mare — headquarters, flexible delivery
  "Baia Mare":            { day: "Luni–Vineri",    county: "Maramureș" },
  // Maramureș — Tuesday route
  "Ulmeni":               { day: "Marți",          county: "Maramureș" },
  "Șomcuta Mare":         { day: "Marți",          county: "Maramureș" },
  "Borșa":                { day: "Marți",          county: "Maramureș" },
  "Moisei":               { day: "Marți",          county: "Maramureș" },
  // Maramureș — Wednesday route
  "Seini":                { day: "Miercuri",       county: "Maramureș" },
  "Vișeu de Sus":         { day: "Miercuri",       county: "Maramureș" },
  // Valley Izei on both Tue & Wed routes
  "Valea Izei":           { day: "Marți / Miercuri", county: "Maramureș" },
  // Maramureș — Thursday route
  "Sighetu Marmației":    { day: "Joi",            county: "Maramureș" },
  "Ocna Șugatag":         { day: "Joi",            county: "Maramureș" },
  "Cavnic":               { day: "Joi",            county: "Maramureș" },
  // Maramureș — Friday route
  "Târgu Lăpuș":          { day: "Vineri",         county: "Maramureș" },
  "Copalnic-Mănăștur":    { day: "Vineri",         county: "Maramureș" },
  // Satu Mare — Wednesday route
  "Satu Mare":            { day: "Miercuri",       county: "Satu Mare" },
  "Negrești-Oaș":         { day: "Miercuri",       county: "Satu Mare" },
  "Livada":               { day: "Miercuri",       county: "Satu Mare" },
  "Turț":                 { day: "Miercuri",       county: "Satu Mare" },
  // Sălaj — Tuesday route
  "Jibou":                { day: "Marți",          county: "Sălaj" },
  "Cehu Silvaniei":       { day: "Marți",          county: "Sălaj" },
  // Sălaj — Thursday route
  "Zalău":                { day: "Joi",            county: "Sălaj" },
  "Șimleul Silvaniei":    { day: "Joi",            county: "Sălaj" },
  // Sălaj — Friday route
  "Ileanda":              { day: "Vineri",         county: "Sălaj" },
  // Bistrița-Năsăud — Friday route
  "Beclean":              { day: "Vineri",         county: "Bistrița-Năsăud" },
  // Cluj — Friday route
  "Dej":                  { day: "Vineri",         county: "Cluj" },
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

const BAIA_MARE_KEY = normalizeCity("Baia Mare");

/**
 * Baia Mare has its own order minimum and shipping fee; every other locality,
 * including the rest of Maramureș, falls on the second tier. Matched the same
 * way as route cities so "BAIA mare" and "baia-mare" both qualify.
 */
export function isBaiaMare(city: string): boolean {
  return normalizeCity(city) === BAIA_MARE_KEY;
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
