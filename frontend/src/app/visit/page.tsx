import type { Metadata } from "next";
import Image from "next/image";
import { Baby, Car, Clock, Coffee, HeartHandshake, MapPin, Music, Shirt } from "lucide-react";
import { services, site, weekdayNames } from "@/content/site";
import { photos } from "@/content/media";
import { faqs } from "@/content/community";
import { formatServiceTime } from "@/lib/schedule";
import { ActionForm, Checkbox, Input, Select, SubmitButton, TextArea } from "@/components/forms";
import { Faq } from "@/components/faq";
import { ButtonLink, Eyebrow, PageHero, Section, SectionHeader, tint } from "@/components/ui";

export const metadata: Metadata = {
  title: "Plan your visit",
  description: "Service times, directions and what to expect on your first Sunday at RCCG Spring of Life, Abuja.",
};

const expect = [
  { icon: Car, title: "Easy arrival", text: "Free parking with stewards to guide you. Accessible spaces sit right by the entrance." },
  { icon: Coffee, title: "A warm welcome", text: "Our welcome team will meet you at the door, help you find a seat and answer any questions." },
  { icon: Music, title: "Worship & the Word", text: "Vibrant praise, heartfelt worship and a practical, Bible-based message — starting at 8:00am." },
  { icon: Baby, title: "Kids are loved", text: "Safe, fun Children's Church for ages 0–12 with trained, checked teachers and secure pickup." },
  { icon: Shirt, title: "Come as you are", text: "Ankara, suit or jeans — there's no dress code. We just want you here." },
  { icon: HeartHandshake, title: "Meet the family", text: "Stop by the first-timers' lounge after service to meet a pastor and receive a small gift." },
];

export default function VisitPage() {
  return (
    <>
      <PageHero
        eyebrow="Plan your visit"
        title={<>We&apos;ve saved you a <em className="text-rose">seat.</em></>}
        intro="Visiting a new church can feel like a big step. Here's everything you need to know — and if you let us know you're coming, we'll be ready to welcome you."
        image={photos.welcome}
      >
        <ButtonLink href="#rsvp" variant="brand" size="lg" arrow>
          Let us know you&apos;re coming
        </ButtonLink>
        <ButtonLink href="#faq" variant="outline-light" size="lg">
          Questions?
        </ButtonLink>
      </PageHero>

      {/* Times & location */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[4px] bg-white p-8 ring-1 ring-line md:p-10" data-reveal>
            <Clock className="size-7 text-sky" aria-hidden />
            <h2 className="display mt-5 text-3xl">Service times</h2>
            <ul className="mt-8 divide-y divide-line">
              {services.map((s) => (
                <li key={s.id} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-muted">{s.description}</p>
                  </div>
                  <p className="shrink-0 font-semibold text-royal sm:text-right">
                    {weekdayNames[s.day]}
                    <span className="block text-sm font-normal text-muted">{formatServiceTime(s)}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col overflow-hidden rounded-[4px] bg-ink text-paper" data-reveal>
            <iframe
              title={`Map showing ${site.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.mapQuery)}&output=embed`}
              className="h-72 w-full border-0 grayscale-[30%] lg:h-auto lg:flex-1"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-8 md:p-10">
              <MapPin className="size-7 text-rose" aria-hidden />
              <h2 className="display mt-4 text-2xl">{site.address.line1}</h2>
              <p className="mt-1 text-white/70">{site.address.line2} · Plus Code {site.address.plusCode}</p>
              <p className="mt-4 text-sm text-white/60">{site.address.directions}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center rounded-[3px] bg-brand px-5 font-semibold text-white transition hover:bg-brand-dark"
                >
                  Get directions
                </a>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex h-11 items-center rounded-[3px] border border-white/30 px-5 font-semibold transition hover:bg-white hover:text-ink"
                >
                  Call {site.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* What to expect */}
      <Section tone="sand">
        <SectionHeader
          eyebrow="Your first Sunday"
          title={<>What to <em className="text-royal">expect.</em></>}
          intro="No surprises — just a warm, Spirit-filled service and a family that's glad you came."
        />
        <ol className="grid border-l border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
          {expect.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="group border-b border-r border-ink/12 p-7 transition-colors duration-500 hover:bg-white md:p-8">
              <div className="flex items-center justify-between">
                <span className="meta text-muted">{String(i + 1).padStart(2, "0")}</span>
                <Icon className={`size-5 transition-transform duration-500 group-hover:-translate-y-0.5 ${tint(i).text}`} strokeWidth={1.6} aria-hidden />
              </div>
              <h3 className="mt-10 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* RSVP */}
      <Section id="rsvp">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <Eyebrow className="mb-5">Let us know you&apos;re coming</Eyebrow>
            <h2 className="display text-3xl md:text-5xl">
              We&apos;ll be <em className="text-royal">ready</em> for you.
            </h2>
            <p className="mt-6 text-lg text-muted">
              Tell us when you&apos;re visiting and we&apos;ll reserve seats, pre-register your children and have someone meet you at the door. It
              takes 30 seconds.
            </p>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[4px] lg:block">
              <Image src={photos.worship.src} alt={photos.worship.alt} fill sizes="40vw" className="object-cover" />
            </div>
          </div>
          <div className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-10" data-reveal>
            <ActionForm formId="visit" successTitle="See you soon!" className="grid gap-5 sm:grid-cols-2">
              <Input name="name" label="Your name" required autoComplete="name" className="sm:col-span-2" />
              <Input name="email" label="Email" type="email" required autoComplete="email" />
              <Input name="phone" label="Phone / WhatsApp" type="tel" autoComplete="tel" inputMode="tel" />
              <Input name="date" label="Which Sunday?" type="date" required />
              <Select
                name="service"
                label="Service"
                required
                defaultValue="Sunday Service"
                options={services.map((s) => s.name)}
              />
              <Input name="party" label="How many in your group?" type="number" min="1" inputMode="numeric" defaultValue="1" />
              <div className="flex items-end pb-3">
                <Checkbox name="kids" label="I'm bringing children" hint="We'll prepare Children's Church" />
              </div>
              <TextArea name="notes" label="Anything we should know?" rows={3} className="sm:col-span-2" placeholder="Accessibility needs, questions, prayer…" />
              <div className="sm:col-span-2">
                <SubmitButton className="w-full sm:w-auto">Reserve my seat</SubmitButton>
                <p className="mt-3 text-xs text-muted">We&apos;ll only use your details to welcome you. Never shared.</p>
              </div>
            </ActionForm>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="sand" id="faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeader eyebrow="Good questions" title={<>Frequently <em className="text-royal">asked.</em></>} />
          <Faq items={faqs} />
        </div>
      </Section>
    </>
  );
}
