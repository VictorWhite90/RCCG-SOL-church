import type { Metadata } from "next";
import { FileText, Images, ShieldCheck } from "lucide-react";
import { projects } from "@/content/giving";
import { photos } from "@/content/media";
import { formatNaira } from "@/lib/format";
import { ProjectCard } from "@/components/cards";
import { ButtonLink, PageHero, Section, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Kingdom Projects",
  description: "Building for generations — see the projects shaping our church and city and how you can help.",
};

const transparency = [
  { icon: FileText, title: "Quarterly reports", text: "Every project publishes a progress and spending report each quarter, shared in church and online." },
  { icon: Images, title: "Real photos & milestones", text: "We share genuine photographs and milestone updates so you can see your gift at work." },
  { icon: ShieldCheck, title: "Audited & accountable", text: "Project funds are held in dedicated accounts and reviewed by the parish finance committee." },
];

export default function ProjectsPage() {
  const raised = projects.reduce((sum, p) => sum + p.raised, 0);
  const goal = projects.reduce((sum, p) => sum + p.goal, 0);
  const supporters = projects.reduce((sum, p) => sum + p.supporters, 0);
  const stats = [
    { value: formatNaira(raised, { compact: true }), label: "Raised so far" },
    { value: `${Math.round((raised / goal) * 100)}%`, label: "Of combined goals" },
    { value: supporters.toLocaleString("en-NG"), label: "Supporters" },
    { value: String(projects.length), label: "Active projects" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Kingdom projects"
        title={<>Build for the <em className="text-rose">next generation.</em></>}
        intro="Room for families to worship, compassion that reaches our city, and tools to carry the message further. Join us in building what will outlive us."
        image={photos.arena}
      >
        <ButtonLink href="/give?fund=building" variant="brand" size="lg" arrow>Give to a project</ButtonLink>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-x grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-8 md:px-8 md:py-10" data-reveal>
              <p className="display text-3xl md:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <SectionHeader eyebrow="Current projects" title={<>Where your gift <em className="text-royal">goes.</em></>} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <SectionHeader light eyebrow="Transparency" title={<>Every naira, <em className="text-rose">accounted for.</em></>} intro="Generosity deserves accountability. Here's how we steward what you give." />
        <div className="grid gap-5 md:grid-cols-3">
          {transparency.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[4px] bg-white/5 p-8 ring-1 ring-white/10" data-reveal>
              <Icon className="size-8 text-rose" aria-hidden />
              <p className="display mt-5 text-xl">{title}</p>
              <p className="mt-3 text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
