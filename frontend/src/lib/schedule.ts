import { services, site, type Service } from "@/content/site";

const OFFSET_MS = site.utcOffsetHours * 60 * 60 * 1000;

function minutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Wall-clock parts of `now` in the church's timezone. */
function localParts(now: Date) {
  const local = new Date(now.getTime() + OFFSET_MS);
  return {
    day: local.getUTCDay(),
    minutes: local.getUTCHours() * 60 + local.getUTCMinutes(),
    midnightUtc: Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - OFFSET_MS,
  };
}

export type Occurrence = { service: Service; start: Date; end: Date };

/** Next start (or current occurrence, if one is in progress) for a service. */
function occurrence(service: Service, now: Date): Occurrence {
  const { day, minutes: nowMin, midnightUtc } = localParts(now);
  let addDays = (service.day - day + 7) % 7;
  if (addDays === 0 && nowMin >= minutes(service.end)) addDays = 7;
  const dayStart = midnightUtc + addDays * 86_400_000;
  return {
    service,
    start: new Date(dayStart + minutes(service.start) * 60_000),
    end: new Date(dayStart + minutes(service.end) * 60_000),
  };
}

export function upcomingServices(now = new Date(), { streamedOnly = false } = {}) {
  return services
    .filter((s) => !streamedOnly || s.streamed)
    .map((s) => occurrence(s, now))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function liveStatus(now = new Date()) {
  const list = upcomingServices(now, { streamedOnly: true });
  const current = list.find((o) => o.start <= now && now < o.end);
  const next = list.find((o) => o.start > now) ?? list[0];
  return { live: current ?? null, next };
}

export function formatServiceTime(service: Pick<Service, "start" | "end">) {
  return `${to12h(service.start)} – ${to12h(service.end)}`;
}

export function to12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}
