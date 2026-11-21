import { site } from "@/content/site";

const tz = site.timezone;

export function formatDate(iso: string | Date, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-NG", { timeZone: tz, ...opts }).format(new Date(iso));
}

export function formatTime(iso: string | Date) {
  return new Intl.DateTimeFormat("en-NG", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true })
    .format(new Date(iso))
    .replace(/\s/g, "")
    .toLowerCase();
}

export function formatNaira(amount: number, { compact = false } = {}) {
  if (compact && amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toLocaleString("en-NG", { maximumFractionDigits: 1 })}m`;
  }
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function dateBadge(iso: string) {
  return {
    day: formatDate(iso, { day: "numeric" }),
    month: formatDate(iso, { month: "short" }),
    weekday: formatDate(iso, { weekday: "short" }),
  };
}

export function eventRange(start: string, end: string) {
  const sameDay = formatDate(start) === formatDate(end);
  if (sameDay) return `${formatDate(start, { weekday: "long", day: "numeric", month: "long" })} · ${formatTime(start)} – ${formatTime(end)}`;
  return `${formatDate(start, { day: "numeric", month: "short" })} – ${formatDate(end, { day: "numeric", month: "short", year: "numeric" })}`;
}
