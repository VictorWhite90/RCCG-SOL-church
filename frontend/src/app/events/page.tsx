import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { photos } from "@/content/media";
import { eventCategories, upcomingEvents } from "@/content/events";
import { services, weekdayNames } from "@/content/site";
import { formatServiceTime } from "@/lib/schedule";
import { ButtonLink, Eyebrow, PageHero, Section } from "@/components/ui";
import { EventBrowser } from "@/components/event-browser";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description: "What's coming up at RCCG Spring of Life, Abuja — services, prayer, family nights, youth hangouts and outreaches.",
};

export default function EventsPage() {
  const list = upcomingEvents();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={
          <>
            There&apos;s always <em className="text-rose">something happening.</em>
          </>
        }
        intro="Worship nights, prayer, family moments and outreaches across the city. Find your next gathering and bring a friend."
        image={photos.worship}
      >
        <ButtonLink href="#calendar" variant="brand" size="lg">
          <CalendarDays className="size-5" aria-hidden /> See the calendar
        </ButtonLink>
      </PageHero>

      <section className="border-b border-line bg-sand">
        <div className="container-x py-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
            <Eyebrow>Every week</Eyebrow>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <li key={s.id} className="border-l-2 border-brand pl-4">
                  <span className="block font-semibold">{s.name}</span>
                  <span className="text-sm text-muted">
                    {weekdayNames[s.day]} · {formatServiceTime(s)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section tone="paper" id="calendar" className="scroll-mt-20">
        <EventBrowser events={list} categories={eventCategories} />
      </Section>
    </>
  );
}
