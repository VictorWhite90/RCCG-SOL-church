import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import type { Photo } from "@/content/media";
import { Words } from "./motion/words";

type Variant = "primary" | "brand" | "outline" | "ghost" | "light" | "outline-light";

// `--btn-fill` is the liquid colour that floods in on hover (see MotionProvider).
const variants: Record<Variant, string> = {
  primary: "bg-royal text-white [--btn-fill:var(--color-brand)]",
  brand: "bg-brand text-white [--btn-fill:var(--color-ink)]",
  outline: "border border-ink/25 text-ink [--btn-fill:var(--color-ink)] [&[data-filled]]:text-paper [&[data-filled]]:border-ink",
  ghost: "text-ink [--btn-fill:var(--color-sand)]",
  light: "bg-white text-ink [--btn-fill:var(--color-brand)] [&[data-filled]]:text-white",
  "outline-light": "border border-white/35 text-white [--btn-fill:#fff] [&[data-filled]]:text-ink [&[data-filled]]:border-white",
};

export function buttonClass(variant: Variant = "primary", size: "md" | "lg" | "sm" = "md") {
  const sizes = { sm: "h-9 px-4 text-[0.82rem]", md: "h-11 px-5 text-[0.9rem]", lg: "h-13 px-6 text-[0.95rem]" };
  return `btn group/btn inline-flex items-center justify-center gap-2.5 rounded-[3px] font-semibold tracking-[-0.01em] transition-[color,border-color] duration-300 disabled:opacity-60 disabled:pointer-events-none ${sizes[size]} ${variants[variant]}`;
}

/** Arrow that slides out to the right while its twin slides in from the left. */
export function SwapArrow({ className = "size-4" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden ${className}`} aria-hidden>
      <ArrowRight className="absolute inset-0 size-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full group-hover:translate-x-full" />
      <ArrowRight className="absolute inset-0 size-full -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0 group-hover:translate-x-0" />
    </span>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  magnetic = false,
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: "sm" | "md" | "lg"; arrow?: boolean; magnetic?: boolean }) {
  return (
    <Link href={href} className={`${buttonClass(variant, size)} ${className}`} data-magnetic={magnetic || undefined} {...rest}>
      {children}
      {arrow && <SwapArrow />}
    </Link>
  );
}

export function Eyebrow({
  children,
  index,
  className = "",
  tone = "brand",
}: {
  children: ReactNode;
  index?: string;
  className?: string;
  tone?: "brand" | "royal" | "muted" | "light";
}) {
  const tones = { brand: "text-ember", royal: "text-royal", muted: "text-muted", light: "text-rose" };
  return (
    <p className={`eyebrow flex items-center gap-3 ${tones[tone]} ${className}`}>
      {index && <span className="tabular-nums">{index}</span>}
      <span className="h-px w-7 bg-current opacity-60" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  index,
  title,
  intro,
  action,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center" | "stacked";
  light?: boolean;
}) {
  const muted = light ? "text-white/65" : "text-muted";
  if (align !== "left") {
    const center = align === "center";
    return (
      <div className={`mb-10 md:mb-12 ${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}>
        {eyebrow && <Eyebrow index={index} tone={light ? "light" : "brand"} className={`mb-5 ${center ? "justify-center" : ""}`}>{eyebrow}</Eyebrow>}
        <h2 className={`display text-3xl md:text-[2.75rem] ${light ? "text-paper" : ""}`} data-split><Words>{title}</Words></h2>
        {intro && <p className={`mt-4 text-base leading-relaxed md:text-lg ${muted}`} data-reveal data-delay="0.15">{intro}</p>}
        {action && <div className={`mt-7 ${center ? "flex justify-center" : ""}`} data-reveal data-delay="0.25">{action}</div>}
      </div>
    );
  }
  return (
    <div className={`mb-10 grid gap-5 border-t pt-5 md:mb-14 md:grid-cols-12 md:gap-8 ${light ? "border-white/15" : "border-ink/12"}`}>
      <div className="md:col-span-3">{eyebrow && <Eyebrow index={index} tone={light ? "light" : "brand"}>{eyebrow}</Eyebrow>}</div>
      <div className="flex flex-col gap-6 md:col-span-9 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className={`display text-3xl md:text-[2.75rem] ${light ? "text-paper" : ""}`} data-split><Words>{title}</Words></h2>
          {intro && <p className={`mt-4 text-base leading-relaxed md:text-lg ${muted}`} data-reveal data-delay="0.15">{intro}</p>}
        </div>
        {action && <div className="shrink-0" data-reveal data-delay="0.25">{action}</div>}
      </div>
    </div>
  );
}

/** Concentric rings radiating outward — the "spring" motif. Pure CSS animation. */
export function Ripples({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={`pointer-events-none ${className}`} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.25"
          className="origin-center animate-[ripple_8s_cubic-bezier(0.2,0.6,0.3,1)_infinite] motion-reduce:animate-none"
          style={{ animationDelay: `${i * -2}s`, transformBox: "fill-box" }}
        />
      ))}
    </svg>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: Photo;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink text-paper">
      {image && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute inset-0" data-parallax="8">
            <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/80 to-royal/40" />
        </div>
      )}
      <Ripples className="absolute -right-[12vw] top-1/2 size-[60vw] max-w-[760px] -translate-y-1/2 text-white/10 md:-right-[6vw]" />
      <div className="container-x relative pb-14 pt-32 md:pb-20 md:pt-40">
        <nav aria-label="Breadcrumb" className="meta mb-8 flex items-center gap-2 uppercase text-white/50" data-reveal>
          <Link href="/" className="link-underline hover:text-white">Spring of Life</Link>
          <span aria-hidden>/</span>
          <span className="text-rose">{eyebrow}</span>
        </nav>
        <h1 className="display max-w-4xl text-4xl md:text-5xl lg:text-[3.6rem]" data-split="load" data-delay="0.1"><Words>{title}</Words></h1>
        {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg" data-reveal data-delay="0.35">{intro}</p>}
        {children && <div className="mt-9 flex flex-wrap gap-3" data-reveal data-delay="0.5">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ children, className = "", id, tone = "paper" }: { children: ReactNode; className?: string; id?: string; tone?: "paper" | "sand" | "ink" | "royal" | "white" }) {
  const tones = { paper: "bg-paper", sand: "bg-sand", ink: "grain bg-ink text-paper", royal: "grain bg-royal-deep text-paper", white: "bg-white" };
  return (
    <section id={id} className={`py-16 md:py-24 ${tones[tone]} ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`meta inline-flex items-center gap-1.5 rounded-[3px] bg-ink/5 px-2.5 py-1 text-ink-soft ${className}`}>{children}</span>;
}

export function ProgressBar({ value, light = false }: { value: number; light?: boolean }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-1 w-full overflow-hidden ${light ? "bg-white/15" : "bg-ink/10"}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-gradient-to-r from-brand to-rose" style={{ width: `${pct}%` }} data-fill />
    </div>
  );
}

export function SocialIcon({ name, className = "size-5" }: { name: "youtube" | "instagram" | "facebook" | "x"; className?: string }) {
  const paths = {
    youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
    instagram: "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2ZM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z",
    facebook: "M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z",
    x: "M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.9 2.3h7l4.8 6.4 5.5-6.4Zm-1.2 17.9h1.9L7 4.2H5l12 16Z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

/** Supporting colours, cycled across icons, numbers and tags to keep pages lively. */
export const tints = [
  { chip: "bg-sky-soft text-sky", text: "text-sky", solid: "bg-sky", bar: "border-sky" },
  { chip: "bg-brand-soft text-brand", text: "text-brand", solid: "bg-brand", bar: "border-brand" },
  { chip: "bg-sun-soft text-[#b87400]", text: "text-sun", solid: "bg-sun", bar: "border-sun" },
  { chip: "bg-mint-soft text-mint", text: "text-mint", solid: "bg-mint", bar: "border-mint" },
  { chip: "bg-violet-soft text-violet", text: "text-violet", solid: "bg-violet", bar: "border-violet" },
  { chip: "bg-rose-soft text-rose", text: "text-rose", solid: "bg-rose", bar: "border-rose" },
] as const;

export const tint = (i: number) => tints[i % tints.length];
