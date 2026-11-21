import type { Metadata } from "next";
import { Building2, Church, Landmark, Smartphone } from "lucide-react";
import { bankAccounts, funds, projects, type FundId } from "@/content/giving";
import { photos } from "@/content/media";
import { ProjectCard } from "@/components/cards";
import { CopyButton } from "@/components/copy-button";
import { GiveForm } from "@/components/give-form";
import { ButtonLink, PageHero, Section, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Give",
  description: "Give your tithes, offerings and seeds securely online or by bank transfer, and support our Kingdom projects.",
};

const reasons = [
  { ref: "Malachi 3:10", quote: "Bring the whole tithe into the storehouse… and see if I will not throw open the floodgates of heaven.", title: "We give in trust" },
  { ref: "2 Corinthians 9:7", quote: "Each of you should give what you have decided in your heart to give… for God loves a cheerful giver.", title: "We give with joy" },
  { ref: "Luke 6:38", quote: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over.", title: "We give in faith" },
];

const faqs = [
  { q: "Is online giving secure?", a: "Yes. Card payments are processed by Paystack, a PCI-DSS Level 1 certified provider. Your card details go straight to Paystack and are never seen or stored by the church." },
  { q: "Will I get a receipt?", a: "Yes. Paystack emails a receipt immediately, and you can download one on screen once your gift is confirmed. For bank transfers, contact the church office for an acknowledgement." },
  { q: "Can I give regularly?", a: "The simplest way to give monthly is a standing order from your bank app to the church account below. Recurring card giving is coming soon." },
  { q: "Is my giving tax-deductible?", a: "The church can provide an annual giving statement on request. Please speak with your tax adviser about how it applies to you." },
  { q: "I made a mistake with my gift. What should I do?", a: "Contact the church office with your payment reference and we will sort it out with you." },
];

const otherWays = [
  { icon: Church, title: "In service", text: "Give during the offering at any service using cash, card (POS) or the envelope at your seat." },
  { icon: Landmark, title: "Bank transfer", text: "Transfer directly to our church accounts. Use your name and fund (e.g. \"Ade – Tithe\") as the narration." },
  { icon: Building2, title: "Standing order", text: "Set up a monthly standing order in your bank app for faithful, hands-free giving." },
];

function isFund(v: unknown): v is FundId {
  return funds.some((f) => f.id === v);
}

export default async function GivePage({ searchParams }: { searchParams: Promise<{ fund?: string }> }) {
  const { fund } = await searchParams;
  const initialFund = isFund(fund) ? fund : "tithe";

  return (
    <>
      <PageHero
        eyebrow="Give"
        title={<>Generosity is <em className="text-rose">worship.</em></>}
        intro="Every gift fuels the gospel in Abuja and beyond — from Sunday services to food packs for families in need. Thank you for giving."
        image={photos.outreach}
      />

      <Section id="give-online">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div data-reveal>
            <GiveForm initialFund={initialFund} />
          </div>

          <aside className="space-y-6" data-reveal>
            <div className="rounded-[4px] bg-ink p-7 text-paper" id="bank-transfer">
              <p className="eyebrow text-rose">Bank transfer</p>
              <p className="display mt-3 text-2xl">Give by transfer</p>
              <ul className="mt-6 space-y-5">
                {bankAccounts.map((acc) => (
                  <li key={acc.accountNumber} className="rounded-[4px] bg-white/5 p-5">
                    <p className="text-sm text-white/55">{acc.purpose}</p>
                    <p className="mt-1 font-semibold">{acc.accountName}</p>
                    <p className="text-sm text-white/70">{acc.bank}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="display text-xl tabular-nums tracking-wider">{acc.accountNumber}</span>
                      <CopyButton value={acc.accountNumber} label={`${acc.purpose} account number`} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex gap-2 text-sm text-white/60">
                <Smartphone className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden />
                On the go? Use your bank&apos;s USSD code or mobile app to transfer to the account above.
              </p>
            </div>
            <div className="rounded-[4px] bg-sand p-7">
              <p className="eyebrow text-royal">Other ways to give</p>
              <ul className="mt-5 space-y-5">
                {otherWays.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-paper">
                      <Icon className="size-5 text-royal" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="text-sm text-muted">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="royal">
        <SectionHeader light eyebrow="Why we give" title={<>Not a transaction — <em className="text-rose">a response.</em></>} intro="We give because God first gave to us. Generosity is how we say thank you, how we trust Him, and how we join what He is doing." />
        <div className="grid gap-5 md:grid-cols-3">
          {reasons.map((r, i) => (
            <figure key={r.ref} className="rounded-[4px] bg-white/5 p-8 ring-1 ring-white/10" data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}>
              <p className="display text-xl text-rose">{r.title}</p>
              <blockquote className="mt-4 leading-relaxed text-white/75">“{r.quote}”</blockquote>
              <figcaption className="eyebrow mt-6 text-white/50">{r.ref}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeader eyebrow="Questions" title={<>Giving, <em className="text-royal">answered.</em></>} intro="Anything else? The church office is happy to help." />
          <div className="divide-y divide-line border-y border-line" data-reveal>
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-xl transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeader
          eyebrow="Kingdom projects"
          title={<>Build something that <em className="text-royal">outlives us.</em></>}
          intro="Beyond tithes and offerings, these projects are shaping our church and city for the next generation."
          action={<ButtonLink href="/projects" variant="outline" arrow>All projects</ButtonLink>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>
    </>
  );
}
