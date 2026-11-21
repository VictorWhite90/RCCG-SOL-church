"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type IntroWindow = Window & { __introDone?: boolean };

/** Signals that the page may start its own entrance choreography. */
export function whenIntroDone(cb: () => void) {
  const w = window as IntroWindow;
  if (w.__introDone || document.documentElement.classList.contains("no-intro")) {
    cb();
    return () => {};
  }
  window.addEventListener("spring:intro-done", cb, { once: true });
  return () => window.removeEventListener("spring:intro-done", cb);
}

/**
 * Opening sequence, once per session: a drop falls onto still water, the
 * impact sends out rings, and the page opens through the ripple.
 * Skipped (before first paint) for reduced motion and repeat visits.
 */
export function SpringIntro() {
  const root = useRef<HTMLDivElement>(null);
  // React unmounts the overlay — it is never removed from the DOM behind React's back.
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    const w = window as IntroWindow;
    const signal = () => {
      if (w.__introDone) return;
      w.__introDone = true;
      window.dispatchEvent(new Event("spring:intro-done"));
    };
    const finish = () => {
      signal();
      setDone(true);
    };
    // Skipped intro: the overlay is already hidden by CSS; just release the page.
    if (!el || document.documentElement.classList.contains("no-intro")) {
      signal();
      return;
    }
    try {
      sessionStorage.setItem("sol-intro", "1");
    } catch {}

    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });
    tl.set(el, { "--r": "0vmax" })
      .from(q(".intro-word"), { yPercent: 120, duration: 0.8, stagger: 0.06, ease: "expo.out" }, 0.1)
      .fromTo(q(".intro-drop"), { y: "-46vh", scaleY: 1.6 }, { y: 0, scaleY: 1, duration: 0.6, ease: "power2.in" }, 0.25)
      .to(q(".intro-drop"), { scaleX: 2.4, scaleY: 0.2, opacity: 0, duration: 0.18 })
      .addLabel("impact", "<")
      .fromTo(
        q(".intro-ring"),
        { attr: { r: 2 }, opacity: 0.9 },
        { attr: { r: 60 }, opacity: 0, duration: 1.2, stagger: 0.14, ease: "power2.out" },
        "impact",
      )
      .to(q(".intro-word"), { yPercent: -120, duration: 0.5, stagger: 0.04, ease: "power3.in" }, "impact")
      .to(el, { "--r": "150vmax", duration: 1.15, ease: "expo.inOut" }, "impact+=0.12");

    // Safety: never trap the visitor behind the overlay.
    const failsafe = window.setTimeout(finish, 4500);
    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="spring-intro fixed inset-0 z-[100] flex items-center justify-center bg-ink text-white"
      style={{
        maskImage: "radial-gradient(circle at 50% 50%, transparent var(--r, 0vmax), #000 calc(var(--r, 0vmax) + 1px))",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--r, 0vmax), #000 calc(var(--r, 0vmax) + 1px))",
      }}
    >
      <svg viewBox="-60 -60 120 120" className="absolute size-[70vmin] text-rose">
        {[0, 1, 2].map((i) => (
          <circle key={i} className="intro-ring" r="2" fill="none" stroke="currentColor" strokeWidth={0.4} opacity={0} />
        ))}
      </svg>
      <span className="intro-drop absolute size-3 rounded-full bg-rose" style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
      <p className="absolute bottom-[12vh] flex gap-[0.6em] overflow-hidden font-mono text-xs uppercase tracking-[0.3em] text-white/70">
        {["Spring", "of", "Life"].map((w) => (
          <span key={w} className="intro-word inline-block">
            {w}
          </span>
        ))}
      </p>
    </div>
  );
}
