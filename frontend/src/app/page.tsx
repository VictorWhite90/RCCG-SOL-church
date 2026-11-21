import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { site, services, weekdayNames } from "@/content/site";
import { photos } from "@/content/media";
import { sermons } from "@/content/sermons";
import { upcomingEvents } from "@/content/events";
import { fellowshipAreas, fellowships, ministries } from "@/content/community";
import { projects } from "@/content/giving";
import { formatServiceTime } from "@/lib/schedule";
import { formatDate } from "@/lib/format";
import { HomeHero } from "@/components/home-hero";
import { EventCard, Morph, SermonCard } from "@/components/cards";
import { ButtonLink, Eyebrow, ProgressBar, Ripples, Section, SectionHeader, SwapArrow } from "@/components/ui";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { HoverPreview } from "@/components/motion/hover-preview";
import { HorizontalScroll } from "@/components/motion/horizontal-scroll";
import { Words } from "@/components/motion/words";

export const revalidate = 3600;

const quickActions = [
  { href: "/visit", label: "Plan a visit", text: "Times, directions & what to expect", fill: "bg-royal" },
  { href: "/live", label: "Watch online", text: "Join live or catch up on messages", fill: "bg-brand" },
  { href: "/prayer", label: "Request prayer", text: "Our team will pray with you", fill: "bg-violet" },
  { href: "/give", label: "Give", text: "Tithes, offerings & projects", fill: "bg-mint" },
];

const ribbon = ["Growing in faith", "Connected in love", "Living with purpose", "Come as you are"];

export default function Home() {
  const events = upcomingEvents().slice(0, 4);
  const [latest, ...recent] = sermons;
  const project = projects[0];
  const pct = (project.raised / project.goal) * 100;

  return (
    <>
      <HomeHero />

      {/* ── Quick actions: liquid colour rises on hover ───────────────── */}
      <nav aria-label="Quick links" className="border-b border-ink/10 bg-white">
        <ul className="container-x grid grid-cols-2 lg:grid-cols-4" data-reveal-group>
          {quickActions.map(({ href, label, text, fill }, i) => (
            <li key={href} className={`border-ink/10 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:first:border-l`}>
              <Link href={href} className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden p-5 md:p-7">
                <span className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 ${fill}`} aria-hidden />
                <span className="meta relative flex items-center justify-between text-muted transition-colors duration-500 group-hover:text-white/70">
                  0{i + 1}
                  <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                </span>
                <span className="relative">
                  <span className="block text-lg font-semibold tracking-tight transition-colors duration-500 group-hover:text-white">{label}</span>
                  <span className="mt-1 block text-sm leading-snug text-muted transition-colors duration-500 group-hover:text-white/75">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── 01 Welcome: the manifesto reads itself as you scroll ──────── */}
      <Section>
        <div className="grid gap-5 border-t border-ink/12 pt-5 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <Eyebrow index="01">Welcome home</Eyebrow>
          </div>
          <p data-scrub-words className="text-[1.6rem] font-semibold leading-[1.18] tracking-[-0.025em] md:col-span-9 md:text-[2.4rem]"><Words>
            Spring of Life is more than a place you attend on Sunday. It&apos;s a family you grow with, a community you serve alongside, and a
            place to discover God&apos;s purpose for your life. <span className="text-royal">Whatever your story, you belong here.</span>
          </Words></p>
        </div>

        <div className="mt-16 grid items-end gap-10 md:mt-24 md:grid-cols-12 md:gap-8">
          <figure className="md:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-ink" data-clip>
              <div className="absolute inset-0" data-parallax="7">
                <Image src={photos.welcome.src} alt={photos.welcome.alt} fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="meta mt-3 flex justify-between text-muted">
              <span>Fig. 01 — First-Sunday welcome</span>
              <span>Abuja</span>
            </figcaption>
          </figure>
          <div className="md:col-span-5 md:pl-6" data-reveal>
            <blockquote className="border-l-2 border-brand pl-5 text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl">
              &ldquo;Whoever drinks the water I give will never thirst — it becomes a spring welling up to eternal life.&rdquo;
            </blockquote>
            <p className="meta mt-3 pl-5 text-muted">John 4:14</p>
            <p className="mt-8 leading-relaxed text-ink-soft">
              Our name comes from that promise. We&apos;re a parish of {site.parish} — a family of believers committed to knowing Christ and
              making Him known in Abuja and beyond.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/about" arrow>
                Our story
              </ButtonLink>
              <ButtonLink href="/about#beliefs" variant="outline">
                What we believe
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 02 Gatherings: a timetable, not a card pile ───────────────── */}
      <Section tone="sand">
        <SectionHeader
          index="02"
          eyebrow="This week"
          title={<>Gather with <em className="text-royal">us.</em></>}
          intro="In person in Abuja or online wherever you are. Every service is a chance to worship, hear the Word and meet the family."
          action={<ButtonLink href="/visit" variant="outline" arrow>Plan your visit</ButtonLink>}
        />
        <div className="border-t border-ink/15">
          {services.map((s) => (
            <div key={s.id} className="group relative grid grid-cols-[5.5rem_1fr] items-baseline gap-x-6 gap-y-2 border-b border-ink/15 py-6 md:grid-cols-[10rem_12rem_1fr_auto] md:py-7" data-reveal>
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" aria-hidden />
              <p className="meta relative uppercase text-brand">{weekdayNames[s.day]}</p>
              <p className="relative text-2xl font-semibold tabular-nums tracking-tight md:text-3xl">{formatServiceTime(s).split(" – ")[0]}</p>
              <div className="relative col-span-2 md:col-span-1">
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-muted">{s.description}</p>
              </div>
              <p className="meta relative col-span-2 flex items-center gap-2 text-ink-soft md:col-span-1">
                {s.streamed ? (
                  <>
                    <span className="size-1.5 rounded-full bg-red-500" aria-hidden /> In person + live
                  </>
                ) : (
                  "In person"
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3" data-reveal-group>
          <div>
            <p className="meta uppercase text-muted">Where</p>
            <p className="mt-2 font-semibold">{site.address.line1}</p>
            <p className="text-sm text-muted">{site.address.line2}</p>
          </div>
          <div>
            <p className="meta uppercase text-muted">Kids</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Children&apos;s Church runs for ages 0–12 during the Sunday service, with secure check-in.</p>
          </div>
          <div className="flex items-start md:justify-end">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.mapQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="btn group/btn inline-flex h-11 items-center gap-2.5 rounded-[3px] bg-brand px-5 text-[0.9rem] font-semibold text-white [--btn-fill:var(--color-ink)]"
            >
              Get directions <SwapArrow />
            </a>
          </div>
        </div>
      </Section>

      {/* ── Ribbon: speeds up and changes direction with your scroll ─── */}
      <VelocityMarquee className="bg-brand py-5 text-white md:py-7">
        {ribbon.map((t) => (
          <span key={t} className="flex items-center gap-8 pr-8 text-2xl font-semibold tracking-tight md:gap-12 md:pr-12 md:text-[2.6rem]">
            {t}
            <svg viewBox="0 0 24 24" className="size-5 text-white/60 md:size-7" aria-hidden>
              <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </VelocityMarquee>

      {/* ── 03 Messages ────────────────────────────────────────────── */}
      <Section tone="ink">
        <SectionHeader
          light
          index="03"
          eyebrow="Latest message"
          title={<>Truth for the <em className="text-rose">everyday.</em></>}
          action={<ButtonLink href="/sermons" variant="outline-light" arrow>All sermons</ButtonLink>}
        />
        <Link href={`/sermons/${latest.slug}`} className="group grid gap-8 md:grid-cols-12" data-cursor="Watch">
          <Morph name={`sermon-${latest.slug}`}>
            <div className="relative aspect-video overflow-hidden rounded-[4px] md:col-span-8" data-clip>
              <Image src={latest.image.src} alt="" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
              <span className="absolute inset-0 bg-ink/20" aria-hidden />
              <span className="absolute bottom-4 left-4 inline-flex size-14 items-center justify-center rounded-full bg-brand text-white lg:hidden">
                <Play className="size-5 translate-x-px fill-current" aria-hidden />
              </span>
            </div>
          </Morph>
          <div className="flex flex-col md:col-span-4" data-reveal data-delay="0.2">
            <p className="meta text-rose">{latest.scripture}</p>
            <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">{latest.title}</h3>
            <p className="meta mt-3 text-white/50">
              {latest.speaker} — {formatDate(latest.date, { day: "2-digit", month: "short" })} · {latest.duration}
            </p>
            <p className="mt-6 leading-relaxed text-white/75">{latest.summary}</p>
            <span className="mt-auto flex items-center gap-3 border-t border-white/15 pt-5 font-semibold text-rose">
              Watch the message <SwapArrow />
            </span>
          </div>
        </Link>
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {recent.slice(0, 3).map((s) => (
            <SermonCard key={s.slug} sermon={s} dark />
          ))}
        </div>
      </Section>

      {/* ── 04 Events: hover a row, its photo follows your cursor ───── */}
      <Section>
        <SectionHeader
          index="04"
          eyebrow="What's on"
          title={<>There&apos;s always something <em className="text-royal">happening.</em></>}
          intro="Worship nights, outreach, family evenings — find your next moment to gather, serve and grow."
          action={<ButtonLink href="/events" arrow>Full calendar</ButtonLink>}
        />
        <HoverPreview className="border-t border-ink/12">
          {events.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </HoverPreview>
      </Section>

      {/* ── 05 Ministries: the section pins and travels sideways ─────── */}
      <section className="overflow-x-clip bg-sand py-16 md:py-24 lg:py-0">
        <HorizontalScroll
          header={
            <div className="container-x">
              <SectionHeader
                index="05"
                eyebrow="Find your place"
                title={<>Life is better <em className="text-royal">together.</em></>}
                action={<ButtonLink href="/ministries" variant="outline" arrow>All ministries</ButtonLink>}
              />
            </div>
          }
        >
          {ministries.map((m, i) => (
            <Link
              key={m.slug}
              href={`/ministries/${m.slug}`}
              className="group relative aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[4px] bg-ink text-paper sm:w-[44vw] lg:w-[26vw]"
            >
              <Image src={m.image.src} alt="" fill sizes="(max-width: 640px) 78vw, 26vw" className="object-cover opacity-80 transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <span className="meta absolute left-5 top-5 text-white/70">
                {String(i + 1).padStart(2, "0")} / {String(ministries.length).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="meta uppercase text-rose">{m.audience}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{m.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/75 transition-opacity duration-700 lg:opacity-0 lg:group-hover:opacity-100">{m.short}</p>
              </div>
            </Link>
          ))}
        </HorizontalScroll>
      </section>

      {/* ── 06 House fellowships ────────────────────────────────────── */}
      <section className="grain relative overflow-hidden bg-royal-deep py-20 text-paper md:py-28">
        <Ripples className="absolute -left-[20vw] top-1/2 size-[80vw] max-w-[900px] -translate-y-1/2 text-white/10" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="06" tone="light" className="mb-6">
              House fellowships
            </Eyebrow>
            <h2 className="display text-3xl md:text-[2.75rem]" data-split><Words>
              Church, close to <em className="text-rose">home.</em>
            </Words></h2>
            <p className="mt-5 max-w-md text-white/70" data-reveal>
              Midweek, small groups meet in homes across Abuja to pray, study the Word and do life together.
            </p>
            <p className="mt-10 flex items-baseline gap-3" data-reveal>
              <span className="text-6xl font-semibold tracking-tighter md:text-7xl" data-count={fellowships.length}>
                {fellowships.length}
              </span>
              <span className="meta uppercase text-white/60">centres across the city</span>
            </p>
            <div className="mt-10" data-reveal>
              <ButtonLink href="/groups" variant="brand" size="lg" arrow magnetic>
                Find a fellowship
              </ButtonLink>
            </div>
          </div>
          <ul className="grid grid-cols-2 self-end border-l border-t border-white/15 sm:grid-cols-3 lg:col-span-6 lg:col-start-7" data-reveal-group>
            {fellowshipAreas.map((area) => (
              <li key={area} className="border-b border-r border-white/15">
                <Link href={`/groups?area=${encodeURIComponent(area)}`} className="group flex items-center justify-between gap-2 px-4 py-5 transition-colors duration-300 hover:bg-white hover:text-ink">
                  <span className="font-medium">{area}</span>
                  <ArrowUpRight className="size-4 opacity-40 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 07 Build & give ─────────────────────────────────────────── */}
      <Section>
        <SectionHeader index="07" eyebrow="Build with us" title={<>Faith that <em className="text-royal">builds.</em></>} />
        <div className="grid gap-6 lg:grid-cols-12">
          <Link href={`/projects/${project.slug}`} className="group relative overflow-hidden rounded-[4px] bg-ink text-paper lg:col-span-8" data-cursor="View">
            <div className="absolute inset-0" data-parallax="6">
              <Image src={project.image.src} alt="" fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover opacity-45" />
            </div>
            <div className="relative flex h-full min-h-[26rem] flex-col justify-end p-7 md:p-10">
              <p className="meta uppercase text-rose">Kingdom project · {project.category}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{project.title}</h3>
              <p className="mt-3 max-w-lg text-white/75">{project.summary}</p>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-6 border-t border-white/20 pt-5">
                <div>
                  <p className="text-2xl font-semibold tracking-tight" data-count={(project.raised / 1_000_000).toFixed(1)} data-decimals="1" data-prefix="₦" data-suffix="m">
                    ₦{(project.raised / 1_000_000).toFixed(1)}m
                  </p>
                  <p className="meta mt-1 text-white/55">raised</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight" data-count={Math.round(pct)} data-suffix="%">
                    {Math.round(pct)}%
                  </p>
                  <p className="meta mt-1 text-white/55">of ₦{project.goal / 1_000_000}m goal</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight" data-count={project.supporters}>
                    {project.supporters}
                  </p>
                  <p className="meta mt-1 text-white/55">supporters</p>
                </div>
              </div>
              <div className="mt-5 max-w-xl">
                <ProgressBar light value={pct} />
              </div>
            </div>
          </Link>
          <div className="grid gap-6 lg:col-span-4">
            <div className="relative flex flex-col overflow-hidden rounded-[4px] bg-gradient-to-br from-sky to-royal p-7 text-white md:p-8" data-reveal>
              <Ripples className="absolute -right-24 -top-24 size-72 text-white/25" />
              <p className="meta relative uppercase text-white/70">Give</p>
              <h3 className="relative mt-3 text-2xl font-semibold tracking-tight">Give with joy.</h3>
              <p className="relative mt-2 text-white/80">Tithes, offerings and seeds — securely online in seconds, or by bank transfer.</p>
              <div className="relative mt-auto pt-8">
                <ButtonLink href="/give" variant="light" arrow>
                  Give now
                </ButtonLink>
              </div>
            </div>
            <div className="flex flex-col rounded-[4px] border border-ink/12 bg-white p-7 md:p-8" data-reveal data-delay="0.1">
              <p className="meta uppercase text-violet">Prayer</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">You don&apos;t walk alone.</h3>
              <p className="mt-2 text-muted">Share your request — our team prays over every one, every week.</p>
              <div className="mt-auto pt-8">
                <ButtonLink href="/prayer" variant="outline" arrow>
                  Request prayer
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Invitation ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sand py-24 md:py-36">
        <Ripples className="absolute left-1/2 top-1/2 size-[110vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 text-royal/15" />
        <div className="container-x relative text-center">
          <Eyebrow className="mb-6 justify-center">Your invitation</Eyebrow>
          <h2 className="display mx-auto max-w-3xl text-4xl md:text-6xl" data-split><Words>
            There&apos;s a place for <em className="text-brand">you</em> here.
          </Words></h2>
          <p className="mx-auto mt-6 max-w-xl text-muted" data-reveal>
            Whether it&apos;s your first Sunday or you&apos;ve been looking for a church family, we&apos;d love to welcome you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3" data-reveal data-delay="0.15">
            <ButtonLink href="/visit" variant="brand" size="lg" arrow magnetic>
              Plan your visit
            </ButtonLink>
            <ButtonLink href="/connect" variant="outline" size="lg" magnetic>
              I&apos;m new here
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
