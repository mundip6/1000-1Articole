export type DeliveryDay = "Luni–Vineri" | "Marți" | "Miercuri" | "Joi" | "Vineri" | "Marți / Vineri";

export interface CityDelivery {
  day: DeliveryDay;
  county: string;
}

/**
 * Localities actually served, taken from GPS route data rather than the older
 * announced routes. Cehu Silvaniei, Ulmeni, Livada, Ocna Șugatag, Cavnic and
 * Târgu Lăpuș were dropped because the vehicles never reach them.
 */
export const CITY_SCHEDULE: Record<string, CityDelivery> = {
  // Maramureș — Baia Mare is the depot, delivered any weekday
  "Baia Mare":            { day: "Luni–Vineri", county: "Maramureș" },
  // Maramureș — Tuesday route (Valea Izei)
  "Botiza":               { day: "Marți",       county: "Maramureș" },
  "Ieud":                 { day: "Marți",       county: "Maramureș" },
  "Săliștea de Sus":      { day: "Marți",       county: "Maramureș" },
  "Moisei":               { day: "Marți",       county: "Maramureș" },
  "Borșa":                { day: "Marți",       county: "Maramureș" },
  // Maramureș — Wednesday route
  "Seini":                { day: "Miercuri",    county: "Maramureș" },
  "Vișeu de Sus":         { day: "Miercuri",    county: "Maramureș" },
  "Leordina":             { day: "Miercuri",    county: "Maramureș" },
  "Ruscova":              { day: "Miercuri",    county: "Maramureș" },
  // Maramureș — Thursday route
  "Sighetu Marmației":    { day: "Joi",         county: "Maramureș" },
  "Călinești":            { day: "Joi",         county: "Maramureș" },
  // Maramureș — Friday route
  "Copalnic-Mănăștur":    { day: "Vineri",      county: "Maramureș" },

  // Satu Mare — Wednesday route
  "Satu Mare":            { day: "Miercuri",    county: "Satu Mare" },
  "Negrești-Oaș":         { day: "Miercuri",    county: "Satu Mare" },
  "Tarna Mare":           { day: "Miercuri",    county: "Satu Mare" },
  "Târșolț":              { day: "Miercuri",    county: "Satu Mare" },
  "Gherța Mică":          { day: "Miercuri",    county: "Satu Mare" },
  "Boinești":             { day: "Miercuri",    county: "Satu Mare" },
  "Medieșu Aurit":        { day: "Miercuri",    county: "Satu Mare" },

  // Sălaj — Tuesday route
  "Jibou":                { day: "Marți",         county: "Sălaj" },
  "Letca":                { day: "Marți",         county: "Sălaj" },
  "Buciumi":              { day: "Marți",         county: "Sălaj" },
  "Ileanda":              { day: "Marți / Vineri", county: "Sălaj" },
  // Sălaj — Thursday route
  "Zalău":                { day: "Joi",           county: "Sălaj" },
  "Măeriște":             { day: "Joi",           county: "Sălaj" },
  "Crișeni":              { day: "Joi",           county: "Sălaj" },
  "Șimleul Silvaniei":    { day: "Joi",           county: "Sălaj" },
  // Sălaj — Friday route
  "Poiana Blenchii":      { day: "Vineri",        county: "Sălaj" },

  // Bistrița-Năsăud
  "Beclean":              { day: "Joi",         county: "Bistrița-Năsăud" },
  "Reteag":               { day: "Vineri",      county: "Bistrița-Năsăud" },

  // Cluj — Friday route
  "Dej":                  { day: "Vineri",      county: "Cluj" },
  "Chiuiești":            { day: "Vineri",      county: "Cluj" },
};

export const COUNTIES = ["Maramureș", "Satu Mare", "Sălaj", "Bistrița-Năsăud", "Cluj"];

/** Route localities per county, alphabetical, derived so it cannot drift from the schedule. */
export const CITIES_BY_COUNTY: Record<string, string[]> = (() => {
  const byCounty: Record<string, string[]> = {};
  for (const [name, entry] of Object.entries(CITY_SCHEDULE)) {
    (byCounty[entry.county] ??= []).push(name);
  }
  for (const list of Object.values(byCounty)) list.sort((a, b) => a.localeCompare(b, "ro"));
  return byCounty;
})();

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
  | { kind: "none" };

/**
 * Resolves a locality to its delivery day. Matching ignores case, diacritics
 * and punctuation so values saved before the picker changed still resolve.
 * A locality no longer on the route returns "none" so the caller re-prompts.
 */
export function resolveDelivery(city: string, county?: string): DeliveryMatch {
  const typed = city.trim();
  if (!typed) return { kind: "none" };

  const name = ROUTE_CITY_BY_KEY.get(normalizeCity(typed));
  if (!name) return { kind: "none" };

  const entry = CITY_SCHEDULE[name];
  if (county && entry.county !== county) return { kind: "none" };

  return { kind: "route", city: name, day: entry.day, county: entry.county };
}
