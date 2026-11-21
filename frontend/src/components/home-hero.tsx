"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, site } from "@/content/site";
import { formatServiceTime } from "@/lib/schedule";
import { HeroVideo } from "./hero-video";
import { Countdown } from "./live";
import { ButtonLink } from "./ui";
import { whenIntroDone } from "./motion/spring-intro";
import { Words, lineIndexes } from "./motion/words";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home hero choreography: after the opening ripple the headline lines rise,
 * a hand-drawn wave underlines "Become", then the details settle in.
 * Scrolling away sinks the film and lifts the type.
 */
export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const sunday = services.filter((s) => s.day === 0);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(el);
    const title = q("[data-hero-title]")[0] as HTMLElement;
    const wave = el.querySelector<SVGPathElement>("[data-hero-wave] path");

    // Words are rendered by React (<Words>); we only transform them.
    const words = Array.from(title.querySelectorAll<HTMLElement>(".sw-i"));
    gsap.set(words, { yPercent: 115 });
    gsap.set(title, { visibility: "visible" });
    gsap.set(wave, { strokeDashoffset: 1 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    tl.add(() => {
      const lines = lineIndexes(words);
      gsap.to(words, { yPercent: 0, duration: 1.4, ease: "expo.out", delay: (i) => lines[i] * 0.12 + i * 0.015, clearProps: "transform" });
    })
      .to(wave, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.85)
      .fromTo(q(".hero-in"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, clearProps: "transform" }, 0.5);
    const stopWaiting = whenIntroDone(() => tl.play());

    const ctx = gsap.context(() => {
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to(q("[data-hero-video]"), { scale: 1.15, yPercent: 12, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-hero-shade]"), { opacity: 0.85, ease: "none", scrollTrigger: st });
      gsap.to(q("[data-hero-content]"), { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
    }, el);

    return () => {
      stopWaiting();
      tl.kill();
      ctx.revert();
      gsap.set([title, wave, ...words, ...q(".hero-in")], { clearProps: "all" });
    };
  }, []);

  return (
    <section ref={root} className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper">
      <HeroVideo buttonClassName="absolute bottom-5 right-5 z-20 md:right-8" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" aria-hidden />
      <div className="absolute inset-0 bg-ink opacity-0" data-hero-shade aria-hidden />

      <div className="container-x relative mt-auto pb-24 pt-36 md:pb-28" data-hero-content>
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="hero-in meta mb-7 flex items-center gap-3 uppercase text-white/70">
              <span className="size-1.5 shrink-0 rounded-full bg-rose" aria-hidden />
              <span>
                <span className="hidden sm:inline">{site.parish}</span>
                <span className="sm:hidden">RCCG</span> — Utako, {site.city}
              </span>
            </p>
            <h1 data-hero-title className="text-[2.6rem] font-bold leading-[1.04] tracking-[-0.035em] [.js_&]:invisible sm:text-6xl lg:text-[4.1rem]">
              <Words>
              Come as you are.
              <br />
              <em className="relative inline-block not-italic text-rose">
                Become
                <svg data-hero-wave viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -bottom-[0.14em] left-0 h-[0.22em] w-full overflow-visible text-rose" aria-hidden>
                  <path d="M2 12 C 30 2, 50 20, 80 10 S 130 2, 160 11 S 190 14, 198 8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray="1" />
                </svg>
              </em>{" "}
              who you&apos;re
              <br />
              called to be.
              </Words>
            </h1>
            <p className="hero-in mt-7 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              A Spirit-filled family growing in faith, connected in love and living with purpose — and there&apos;s a seat saved for you.
            </p>
            <div className="hero-in mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/visit" variant="brand" size="lg" arrow magnetic>
                Plan your visit
              </ButtonLink>
              <ButtonLink href="/live" variant="outline-light" size="lg" magnetic>
                Watch online
              </ButtonLink>
            </div>
          </div>
          <div className="hero-in hidden lg:col-span-4 lg:block">
            <Countdown />
            <dl className="meta mt-5 space-y-2">
              {sunday.map((s) => (
                <div key={s.id} className="flex justify-between gap-6">
                  <dt className="text-white/55">{s.name}</dt>
                  <dd>{formatServiceTime(s).split(" – ")[0]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="hero-in absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex h-[4.5rem] items-center justify-between border-t border-white/15 pr-16">
          <p className="meta flex items-center gap-3 uppercase text-white/60">
            <span className="relative block h-7 w-px overflow-hidden bg-white/20" aria-hidden>
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-white" />
            </span>
            Scroll
          </p>
          <p className="meta hidden uppercase text-white/60 md:block">Sundays 8:00am · Utako, Abuja</p>
        </div>
      </div>
    </section>
  );
}
