import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { photos } from "@/content/media";
import { ActionForm, Input, Select, SubmitButton, TextArea } from "@/components/forms";
import { Eyebrow, PageHero, Section, SectionHeader, tint } from "@/components/ui";

export const metadata: Metadata = {
  title: "I'm new · Next steps",
  description: "New to Spring of Life? Fill in a connect card and take your next step — salvation, baptism, membership, serving and more.",
};

const steps = [
  { n: "01", title: "Give your life to Jesus", text: "The greatest decision you'll ever make. We'd love to pray with you and help you start strong.", value: "I gave my life to Jesus" },
  { n: "02", title: "Get baptised", text: "Make a public declaration of your faith. Baptism classes run monthly before each baptism service.", value: "Water baptism" },
  { n: "03", title: "Believers' & membership class", text: "Four short sessions on the basics of faith, our church family and how to get involved.", value: "Membership class" },
  { n: "04", title: "Join a house fellowship", text: "Grow with a small group close to home during the week.", value: "House fellowship", href: "/groups" },
  { n: "05", title: "Join a workforce", text: "Use your gifts — choir, children, media, hospitality and more.", value: "Serve in a ministry", href: "/ministries" },
  { n: "06", title: "Talk to a pastor", text: "Counselling, a question about faith, or simply to say hello.", value: "Talk to a pastor" },
];

export default function ConnectPage() {
  return (
    <>
      <PageHero
        eyebrow="I'm new"
        title={<>Every journey has a <em className="text-rose">next step.</em></>}
        intro="Whether you visited last Sunday, watched online or are just exploring faith — we'd love to get to know you and help you take your next step."
        image={photos.welcome}
      />

      <Section>
        <SectionHeader eyebrow="Next steps" title={<>Where are you <em className="text-royal">on the journey?</em></>} />
        <ol className="grid gap-px overflow-hidden rounded-[4px] bg-line ring-1 ring-line md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.n} className="flex flex-col bg-paper p-8" data-reveal>
              <span className={`display text-3xl ${tint(i).text}`}>{s.n}</span>
              <h3 className="display mt-5 text-xl">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
              {s.href && (
                <Link href={s.href} className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-royal hover:underline">
                  Explore <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sand" id="connect-card">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div data-reveal>
            <Eyebrow className="mb-5">Connect card</Eyebrow>
            <h2 className="display text-3xl md:text-5xl">
              Let&apos;s get <em className="text-royal">connected.</em>
            </h2>
            <p className="mt-6 text-lg text-muted">
              Fill this in and a member of our connect team will reach out within a few days — by phone, WhatsApp or email, whichever you
              prefer.
            </p>
          </div>
          <div className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-10" data-reveal>
            <ActionForm formId="connect" successTitle="Welcome to the family!" className="grid gap-5 sm:grid-cols-2">
              <Input name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
              <Input name="email" label="Email" type="email" autoComplete="email" />
              <Input name="phone" label="Phone / WhatsApp" type="tel" autoComplete="tel" inputMode="tel" />
              <Select
                name="status"
                label="I am…"
                required
                className="sm:col-span-2"
                options={["Visiting for the first time", "A regular attender", "Watching online", "New to Abuja", "Returning to church"]}
              />
              <fieldset className="sm:col-span-2">
                <legend className="mb-3 text-sm font-semibold">I&apos;m interested in <span className="font-normal text-muted">(choose any)</span></legend>
                <div className="flex flex-wrap gap-2">
                  {steps.map((s) => (
                    <label key={s.value} className="cursor-pointer">
                      <input type="checkbox" name="step" value={s.value} className="peer sr-only" />
                      <span className="inline-block rounded-[3px] border border-line bg-paper px-4 py-2 text-sm transition peer-checked:border-royal peer-checked:bg-royal peer-checked:text-paper peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                        {s.value}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <TextArea name="message" label="Anything you'd like to share?" rows={3} className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <SubmitButton>Send my connect card</SubmitButton>
              </div>
            </ActionForm>
          </div>
        </div>
      </Section>
    </>
  );
}
