import type { Metadata } from "next";
import { HeartHandshake, Lock, Phone } from "lucide-react";
import { photos } from "@/content/media";
import { services, site, weekdayNames } from "@/content/site";
import { readPrayedCounts, readSubmissions } from "@/lib/submissions";
import { formatServiceTime } from "@/lib/schedule";
import { ActionForm, Checkbox, Input, Select, SubmitButton, TextArea } from "@/components/forms";
import { PrayedButton } from "@/components/prayed-button";
import { ButtonLink, Eyebrow, PageHero, Section, SectionHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prayer",
  description: "Send a prayer request to our prayer team, or stand with others on the prayer wall.",
};

const categories = ["Healing", "Family", "Finances", "Salvation", "Guidance", "Thanksgiving", "Other"];

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function truncate(text: string, max = 280) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export default async function PrayerPage() {
  const [submissions, counts] = await Promise.all([readSubmissions("prayer"), readPrayedCounts()]);
  const wall = submissions
    .filter((s) => s.data.public === true && typeof s.data.request === "string")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 24)
    .map((s) => ({
      id: s.id,
      firstName: String(s.data.name ?? "").trim().split(/\s+/)[0] || "Someone",
      category: String(s.data.category ?? ""),
      request: truncate(String(s.data.request)),
      createdAt: s.createdAt,
      count: counts[s.id] ?? 0,
    }));

  const faithClinic = services.find((s) => s.id === "thursday-service");
  const tel = site.contact.phone.replace(/\s/g, "");

  return (
    <>
      <PageHero
        eyebrow="Prayer"
        title={<>You don&apos;t have to <em className="text-rose">pray alone.</em></>}
        intro="Whatever you're carrying, our prayer team would be honoured to stand with you. Every request is read and prayed over by name."
        image={photos.worship}
      />

      <Section id="request">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-10" data-reveal>
            <Eyebrow className="mb-3">Prayer request</Eyebrow>
            <h2 className="display mb-8 text-3xl">How can we pray for you?</h2>
            <ActionForm formId="prayer" successTitle="We're praying with you." className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input name="name" label="Your name" autoComplete="name" />
                <Select name="category" label="Category" options={categories} />
                <Input name="email" label="Email" type="email" autoComplete="email" />
                <Input name="phone" label="Phone" type="tel" autoComplete="tel" />
              </div>
              <TextArea name="request" label="Your prayer request" required rows={6} placeholder="Share as much or as little as you like." />
              <div className="grid gap-4 rounded-[4px] bg-paper p-5">
                <Checkbox name="public" label="Share on the prayer wall" hint="Only your first name and request will be shown, so others can pray too." />
                <Checkbox name="contact" label="I'd like a pastor to contact me" hint="Please include an email or phone number above." />
              </div>
              <p className="flex items-start gap-2 text-sm text-muted">
                <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
                Private requests are only seen by our pastoral prayer team and are kept confidential.
              </p>
              <div>
                <SubmitButton>Send prayer request</SubmitButton>
              </div>
            </ActionForm>
          </div>

          <aside className="space-y-6" data-reveal>
            <div className="rounded-[4px] bg-royal-deep p-8 text-paper">
              <HeartHandshake className="size-9 text-rose" aria-hidden />
              <p className="display mt-5 text-2xl">Our prayer team</p>
              <p className="mt-3 text-white/70">
                Intercessors pray over every request before each service and throughout the week. We believe God hears and answers prayer.
              </p>
              {faithClinic && (
                <div className="mt-6 rounded-[4px] bg-white/5 p-5">
                  <p className="eyebrow text-rose">Pray with us in person</p>
                  <p className="mt-2 font-semibold">{faithClinic.name}</p>
                  <p className="text-sm text-white/65">
                    Every {weekdayNames[faithClinic.day]} · {formatServiceTime(faithClinic)}
                  </p>
                </div>
              )}
            </div>
            <div className="rounded-[4px] bg-sand p-8">
              <p className="display text-xl">Need urgent prayer?</p>
              <p className="mt-2 text-muted">Call the church office during office hours ({site.contact.officeHours}).</p>
              <a href={`tel:${tel}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-royal hover:underline">
                <Phone className="size-4" aria-hidden /> {site.contact.phone}
              </a>
              <p className="mt-5 text-sm text-muted">If you or someone else is in immediate danger, please call 112.</p>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="sand" id="wall">
        <SectionHeader
          eyebrow="Prayer wall"
          title={<>Stand with <em className="text-royal">one another.</em></>}
          intro="“Carry each other's burdens.” — Galatians 6:2. Take a moment to pray for someone, then let them know."
        />
        {wall.length ? (
          <ul className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {wall.map((p) => (
              <li key={p.id} className="mb-5 break-inside-avoid rounded-[4px] bg-white p-6 ring-1 ring-line">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold">{p.firstName}</span>
                  <span className="text-muted">{relativeTime(p.createdAt)}</span>
                </div>
                {p.category && <p className="eyebrow mt-3 text-royal">{p.category}</p>}
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">{p.request}</p>
                <div className="mt-5">
                  <PrayedButton id={p.id} initialCount={p.count} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[4px] border-2 border-dashed border-line bg-paper px-6 py-16 text-center" data-reveal>
            <p className="text-3xl" aria-hidden>🙏</p>
            <p className="display mt-4 text-2xl">The wall is quiet — for now.</p>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Be the first to share a request. Tick &ldquo;Share on the prayer wall&rdquo; and our church family will pray with you.
            </p>
            <ButtonLink href="#request" variant="outline" className="mt-7">Share a prayer request</ButtonLink>
          </div>
        )}
      </Section>
    </>
  );
}
