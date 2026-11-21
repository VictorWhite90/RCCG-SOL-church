import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarPlus, Clock, Download, MapPin, Navigation, Users } from "lucide-react";
import { events, getEvent, upcomingEvents } from "@/content/events";
import { site } from "@/content/site";
import { eventRange } from "@/lib/format";
import { googleCalendarUrl } from "@/lib/calendar";
import { Eyebrow, Section, SectionHeader, ButtonLink } from "@/components/ui";
import { EventCard, Morph } from "@/components/cards";
import { ShareButtons } from "@/components/share-buttons";
import { ActionForm, Hidden, Input, SubmitButton } from "@/components/forms";
import { Words } from "@/components/motion/words";

export const revalidate = 3600;

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    openGraph: { title: event.title, description: event.summary, images: [event.image.src] },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const past = new Date(event.end) < new Date();
  const more = upcomingEvents()
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapQuery)}`;
  const linkBtn =
    "flex w-full items-center gap-3 rounded-[3px] px-4 py-3 text-sm font-semibold ring-1 ring-line transition hover:bg-paper hover:ring-ink";

  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <Morph name={`event-${event.slug}`}>
          <div className="absolute inset-0">
            <Image src={event.image.src} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
          </div>
        </Morph>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="container-x relative pb-16 pt-32 md:pb-24 md:pt-40">
          <Link href="/events" className="meta mb-8 inline-flex items-center gap-2 uppercase text-white/60 hover:text-white" data-reveal>
            <ArrowLeft className="size-4" aria-hidden /> All events
          </Link>
          <Eyebrow tone="light" className="mb-4">
            {event.category}
          </Eyebrow>
          <h1 className="display max-w-4xl text-4xl md:text-5xl" data-split="load" data-delay="0.1"><Words>{event.title}</Words></h1>
          <p className="mt-6 max-w-2xl text-base text-white/75 md:text-lg" data-reveal data-delay="0.3">{event.summary}</p>
          <ul className="meta mt-8 flex flex-wrap gap-x-8 gap-y-3 text-white/85" data-reveal data-delay="0.4">
            <li className="flex items-center gap-2">
              <Clock className="size-5 text-rose" aria-hidden /> {eventRange(event.start, event.end)}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-5 text-rose" aria-hidden /> {event.location}
            </li>
          </ul>
        </div>
      </section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {past && (
              <p className="mb-6 rounded-[3px] bg-sand px-4 py-3 text-sm font-medium text-ink-soft">This event has ended. See what&apos;s coming up below.</p>
            )}
            <Eyebrow className="mb-4">About this event</Eyebrow>
            <div className="prose-church text-lg">
              {event.details.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-10 border-t border-line pt-8">
              <p className="mb-4 text-sm font-semibold">Invite a friend</p>
              <ShareButtons title={event.title} text={eventRange(event.start, event.end)} path={`/events/${event.slug}`} />
            </div>

            {!past && (
              <div className="mt-12" id="register">
                {event.registration ? (
                  <div className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-10" data-reveal>
                    <h2 className="display text-2xl md:text-3xl">Register</h2>
                    <p className="mb-8 mt-2 text-muted">
                      Free to attend. Registering helps us prepare.
                      {event.capacity && <> Limited to {event.capacity.toLocaleString()} seats.</>}
                    </p>
                    <ActionForm formId="event" successTitle="See you there!" className="grid gap-5 sm:grid-cols-2">
                      <Hidden name="event" value={event.title} />
                      <Input name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
                      <Input name="email" label="Email" type="email" required autoComplete="email" />
                      <Input name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" />
                      <Input name="guests" label="Extra guests" type="number" min="0" inputMode="numeric" hint="People coming with you" />
                      <div className="flex items-end sm:col-span-2">
                        <SubmitButton className="w-full sm:w-auto">Reserve my place</SubmitButton>
                      </div>
                    </ActionForm>
                  </div>
                ) : (
                  <div className="rounded-[4px] bg-brand-soft p-8" data-reveal>
                    <p className="display text-2xl">No registration needed — just come!</p>
                    <p className="mt-2 text-ink-soft">Arrive 15 minutes early to find parking and a seat.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-8">
              <dl className="space-y-5">
                <div className="flex gap-4">
                  <Clock className="mt-0.5 size-5 shrink-0 text-ember" aria-hidden />
                  <div>
                    <dt className="text-sm text-muted">When</dt>
                    <dd className="font-semibold">{eventRange(event.start, event.end)}</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-ember" aria-hidden />
                  <div>
                    <dt className="text-sm text-muted">Where</dt>
                    <dd className="font-semibold">{event.location}</dd>
                    <dd className="text-sm text-muted">
                      {site.address.line1}, {site.address.line2}
                    </dd>
                  </div>
                </div>
                {event.capacity && (
                  <div className="flex gap-4">
                    <Users className="mt-0.5 size-5 shrink-0 text-ember" aria-hidden />
                    <div>
                      <dt className="text-sm text-muted">Capacity</dt>
                      <dd className="font-semibold">{event.capacity.toLocaleString()} seats</dd>
                    </div>
                  </div>
                )}
              </dl>

              {!past && (
                <div className="mt-8 space-y-2 border-t border-line pt-6">
                  <p className="mb-3 text-sm font-semibold">Add to calendar</p>
                  <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer" className={linkBtn}>
                    <CalendarPlus className="size-4 text-royal" aria-hidden /> Google Calendar
                  </a>
                  <a href={`/api/events/${event.slug}/ics`} download className={linkBtn}>
                    <Download className="size-4 text-royal" aria-hidden /> Apple / Outlook (.ics)
                  </a>
                  <a href={directions} target="_blank" rel="noreferrer" className={linkBtn}>
                    <Navigation className="size-4 text-royal" aria-hidden /> Get directions
                  </a>
                </div>
              )}
              {!past && event.registration && (
                <a href="#register" className="mt-6 flex h-12 w-full items-center justify-center rounded-[3px] bg-brand font-semibold text-white transition hover:bg-brand-dark lg:hidden">
                  Register now
                </a>
              )}
            </div>
          </aside>
        </div>
      </Section>

      {more.length > 0 && (
        <Section tone="sand">
          <SectionHeader
            eyebrow="Coming up"
            title={
              <>
                More <em className="text-royal">events</em>
              </>
            }
            action={
              <ButtonLink href="/events" variant="outline" arrow>
                Full calendar
              </ButtonLink>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((e) => (
              <EventCard key={e.slug} event={e} variant="card" />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
