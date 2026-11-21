import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { services, site, socialLinks, weekdayNames } from "@/content/site";
import { formatServiceTime } from "@/lib/schedule";
import { SocialIcon } from "./ui";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { Words } from "./motion/words";

const columns = [
  {
    title: "Visit",
    links: [
      { label: "Plan a visit", href: "/visit" },
      { label: "About us", href: "/about" },
      { label: "Leadership", href: "/about#leadership" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Grow",
    links: [
      { label: "Watch live", href: "/live" },
      { label: "Sermons", href: "/sermons" },
      { label: "Events", href: "/events" },
      { label: "House fellowships", href: "/groups" },
    ],
  },
  {
    title: "Belong",
    links: [
      { label: "I'm new", href: "/connect" },
      { label: "Ministries", href: "/ministries" },
      { label: "Prayer", href: "/prayer" },
      { label: "Give", href: "/give" },
      { label: "Kingdom projects", href: "/projects" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="grain overflow-hidden bg-ink text-paper">
      <div className="container-x grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 md:py-20">
        <div>
          <p className="display text-3xl md:text-4xl">
            Stay in the <em className="text-rose">loop.</em>
          </p>
          <p className="mt-4 max-w-md text-white/60">One email a week: what&apos;s on, the latest message and ways to get involved. No spam, ever.</p>
        </div>
        <NewsletterForm />
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-6 max-w-xs text-white/60">{site.description}</p>
          <div className="mt-6 flex gap-2">
            {socialLinks.map(([n, url]) => (
              <a
                key={n}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${site.shortName} on ${n === "x" ? "X" : n[0].toUpperCase() + n.slice(1)}`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white hover:text-ink"
              >
                <SocialIcon name={n} className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-5 text-rose">Service times</p>
          <ul className="space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <span className="block font-semibold">{s.name}</span>
                <span className="text-white/60">
                  {weekdayNames[s.day]}s · {formatServiceTime(s)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-6 md:col-span-5">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-5 text-rose">{col.title}</p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-white/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-4 border-t border-white/10 py-8 text-sm text-white/60 md:grid-cols-3">
        <p className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-rose" aria-hidden /> {site.address.line1} · {site.address.plusCode}
        </p>
        <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
          <Phone className="size-4 shrink-0 text-rose" aria-hidden /> {site.contact.phone}
        </a>
        {site.contact.email ? (
          <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 hover:text-white">
            <Mail className="size-4 shrink-0 text-rose" aria-hidden /> {site.contact.email}
          </a>
        ) : (
          <a href={site.social.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
            <Mail className="size-4 shrink-0 text-rose" aria-hidden /> Message us on Facebook
          </a>
        )}
      </div>

      <div className="container-x meta flex flex-col gap-2 border-t border-white/10 py-6 text-white/40 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. A parish of {site.parish}.
        </p>
        {site.preview && <p>Preview build — some names, times and figures are sample content pending church confirmation.</p>}
      </div>
      <div className="container-x select-none" aria-hidden>
        <p
          className="-mb-[0.18em] whitespace-nowrap text-center text-[15.5vw] font-bold leading-[0.85] tracking-[-0.06em] text-white/[0.06] xl:text-[12.4rem]"
          data-split
        >
          <Words>Spring of Life</Words>
        </p>
      </div>
    </footer>
  );
}
