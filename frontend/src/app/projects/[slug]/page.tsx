import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Users } from "lucide-react";
import { getProject, projects, type FundId } from "@/content/giving";
import { formatNaira } from "@/lib/format";
import { Morph, ProjectCard } from "@/components/cards";
import { ButtonLink, Eyebrow, ProgressBar, Section, SectionHeader } from "@/components/ui";
import { Words } from "@/components/motion/words";

const projectFund: Record<string, FundId> = {
  "building-for-generations": "building",
  "love-beyond-the-walls": "welfare",
  "making-room-for-the-message": "offering",
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, openGraph: { images: [project.image.src] } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const pct = (project.raised / project.goal) * 100;
  const remaining = Math.max(0, project.goal - project.raised);
  const giveHref = `/give?fund=${projectFund[project.slug] ?? "offering"}`;
  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <Morph name={`project-${project.slug}`}>
          <div className="absolute inset-0">
            <Image src={project.image.src} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
          </div>
        </Morph>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
        <div className="container-x relative grid gap-10 pb-16 pt-36 md:pb-24 md:pt-44 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Eyebrow tone="light" className="mb-5">{project.category}</Eyebrow>
            <h1 className="display text-4xl md:text-5xl" data-split="load" data-delay="0.1"><Words>{project.title}</Words></h1>
            <p className="mt-6 max-w-xl text-base text-white/75 md:text-lg" data-reveal data-delay="0.3">{project.summary}</p>
          </div>
          <div className="rounded-[4px] bg-paper p-7 text-ink shadow-2xl md:p-8" data-reveal>
            <p className="text-sm text-muted">Raised so far</p>
            <p className="display text-4xl">{formatNaira(project.raised)}</p>
            <p className="mt-1 text-muted">of {formatNaira(project.goal)} goal</p>
            <div className="mt-6">
              <ProgressBar value={pct} />
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-muted">Funded</dt><dd className="display text-xl" data-count={Math.round(pct)} data-suffix="%">{Math.round(pct)}%</dd></div>
              <div><dt className="text-muted">Supporters</dt><dd className="display flex items-center gap-1 text-xl"><Users className="size-4 text-royal" aria-hidden />{project.supporters}</dd></div>
              <div><dt className="text-muted">To go</dt><dd className="display text-xl">{formatNaira(remaining, { compact: true })}</dd></div>
            </dl>
            <ButtonLink href={giveHref} size="lg" arrow className="mt-7 w-full">Give to this project</ButtonLink>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div data-reveal>
            <Eyebrow className="mb-4">The vision</Eyebrow>
            <p className="display text-3xl md:text-4xl">
              <em className="text-royal">{project.vision}</em>
            </p>
            <div className="prose-church mt-6 text-lg">
              {project.story.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
          <div data-reveal>
            <Eyebrow className="mb-6">Milestones</Eyebrow>
            <ol className="relative space-y-8 border-l-2 border-line pl-8">
              {project.milestones.map((m) => (
                <li key={m.title} className="relative">
                  <span
                    className={`absolute -left-[2.6rem] top-0.5 inline-flex size-6 items-center justify-center rounded-full ring-4 ring-paper ${
                      m.status === "done" ? "bg-royal text-paper" : m.status === "current" ? "bg-brand text-white" : "border-2 border-line bg-paper"
                    }`}
                    aria-hidden
                  >
                    {m.status === "done" && <Check className="size-3.5" />}
                    {m.status === "current" && <span className="size-2 animate-pulse-dot rounded-full bg-ink" />}
                  </span>
                  <p className={`font-semibold ${m.status === "next" ? "text-muted" : ""}`}>{m.title}</p>
                  <p className="text-sm text-muted">
                    <span className="sr-only">{m.status === "done" ? "Completed: " : m.status === "current" ? "In progress: " : "Upcoming: "}</span>
                    {m.note}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section tone="royal">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between" data-reveal>
          <p className="display max-w-2xl text-3xl md:text-4xl">
            Every gift moves this <em className="text-rose">forward.</em>
          </p>
          <ButtonLink href={giveHref} variant="brand" size="lg" arrow>Give now</ButtonLink>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeader eyebrow="More projects" title={<>Other ways to <em className="text-royal">build.</em></>} />
        <div className="grid gap-6 md:grid-cols-2">
          {others.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>
    </>
  );
}
