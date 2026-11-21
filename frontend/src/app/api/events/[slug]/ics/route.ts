import { events, getEvent } from "@/content/events";
import { icsFor } from "@/lib/calendar";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return new Response("Event not found", { status: 404 });
  const url = new URL(`/events/${event.slug}`, request.url).toString();
  return new Response(icsFor(event, url), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
