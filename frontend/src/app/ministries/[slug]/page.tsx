import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Users } from "lucide-react";
import { getMinistry, ministries } from "@/content/community";
import { ActionForm, Hidden, Input, Select, SubmitButton, TextArea } from "@/components/forms";
import { Eyebrow, PageHero, Section } from "@/components/ui";

export function generateStaticParams() {
  return ministries.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ministries/[slug]">): Promise<Metadata> {
  const m = getMinistry((await params).slug);
  return m ? { title: m.name, description: m.short } : {};
}

export default async function MinistryPage({ params }: PageProps<"/ministries/[slug]">) {
  const ministry = getMinistry((await params).slug);
  if (!ministry) notFound();

  return (
    <>
      <PageHero eyebrow={`Ministries · ${ministry.audience}`} title={ministry.name} intro={ministry.short} image={ministry.image} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <div className="prose-church text-lg" data-reveal>
              {ministry.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2" data-reveal>
              <div className="rounded-[4px] bg-white p-6 ring-1 ring-line">
                <CalendarDays className="size-6 text-royal" aria-hidden />
                <p className="mt-3 text-sm text-muted">When we meet</p>
                <p className="font-semibold">{ministry.meets}</p>
              </div>
              <div className="rounded-[4px] bg-white p-6 ring-1 ring-line">
                <Users className="size-6 text-royal" aria-hidden />
                <p className="mt-3 text-sm text-muted">Who it&apos;s for</p>
                <p className="font-semibold">{ministry.audience}</p>
              </div>
            </div>
            <div className="mt-10" data-reveal>
              <Eyebrow className="mb-4">Ways to serve</Eyebrow>
              <ul className="flex flex-wrap gap-2">
                {ministry.roles.map((r) => (
                  <li key={r} className="rounded-[3px] bg-sand px-4 py-2 text-sm font-medium">{r}</li>
                ))}
              </ul>
            </div>
            <div className="relative mt-12 aspect-video overflow-hidden rounded-[4px]" data-reveal>
              <Image src={ministry.image.src} alt={ministry.image.alt} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start" data-reveal>
            <div className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-8">
              <h2 className="display text-2xl">Get involved</h2>
              <p className="mt-2 text-muted">Leave your details and the ministry leader will reach out.</p>
              <ActionForm formId="ministry" successTitle="Thank you!" className="mt-6 grid gap-4" compact>
                <Hidden name="ministry" value={ministry.name} />
                <Input name="name" label="Name" required autoComplete="name" />
                <Input name="phone" label="Phone / WhatsApp" type="tel" autoComplete="tel" inputMode="tel" />
                <Input name="email" label="Email" type="email" autoComplete="email" />
                <Select name="role" label="I'm interested in" options={[...ministry.roles, "Not sure yet"]} />
                <TextArea name="message" label="Message" rows={3} />
                <SubmitButton className="w-full">Count me in</SubmitButton>
              </ActionForm>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
