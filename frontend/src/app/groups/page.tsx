import type { Metadata } from "next";
import { Suspense } from "react";
import { BookOpen, HeartHandshake, Users } from "lucide-react";
import { fellowships } from "@/content/community";
import { photos } from "@/content/media";
import { FellowshipFinder } from "@/components/fellowship-finder";
import { PageHero, Section, tint } from "@/components/ui";

export const metadata: Metadata = {
  title: "House fellowships",
  description: "Find a house fellowship near you in Abuja — small groups that pray, study the Word and do life together.",
};

const why = [
  { icon: BookOpen, title: "Study the Word", text: "Go deeper into Sunday's message with discussion and questions." },
  { icon: HeartHandshake, title: "Pray together", text: "Carry each other's burdens and celebrate answered prayer." },
  { icon: Users, title: "Real friendships", text: "Know and be known — church becomes family." },
];

export default function GroupsPage() {
  return (
    <>
      <PageHero
        eyebrow="House fellowships"
        title={<>Church, close to <em className="text-rose">home.</em></>}
        intro={`${fellowships.length} house fellowship centres meet across Abuja every week. Find one near you and we'll connect you with the host.`}
        image={photos.welcome}
      />
      <Section tone="sand" className="!py-14">
        <div className="grid gap-8 md:grid-cols-3" data-reveal-group>
          {why.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="flex gap-4 border-t border-ink/12 pt-5">
              <Icon className={`mt-0.5 size-5 shrink-0 ${tint(i).text}`} strokeWidth={1.6} aria-hidden />
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <Suspense>
          <FellowshipFinder />
        </Suspense>
      </Section>
    </>
  );
}
