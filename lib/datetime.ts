/**
 * Timestamps are stored in UTC. Server components render on Vercel, whose
 * runtime timezone is UTC, so formatting without an explicit zone shows orders
 * 2-3 hours early. Everything user-facing is pinned to Romanian local time so
 * server and browser agree, and so an admin abroad still sees shop time.
 */
const TIME_ZONE = "Europe/Bucharest";

/** "22 octombrie 2026, 14:35" */
export function formatDateTime(value: Date | string): string {
  return new Date(value).toLocaleString("ro-RO", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

/** "22.10.2026" */
export function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** "22 oct. 2026" */
export function formatListDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "2-digit", month: "short", year: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** "14:35" */
export function formatTime(value: Date | string): string {
  return new Date(value).toLocaleTimeString("ro-RO", {
    hour: "2-digit", minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

/** "22.10, 14:35" — compact, for chat and email transcripts */
export function formatCompact(value: Date | string): string {
  return new Date(value).toLocaleString("ro-RO", {
    day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}
