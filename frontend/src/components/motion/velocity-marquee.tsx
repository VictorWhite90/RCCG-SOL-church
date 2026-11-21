"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A ribbon that drifts on its own, accelerates with scroll speed, follows
 * the scroll direction and leans (skews) into fast scrolls.
 */
export function VelocityMarquee({ children, speed = 0.6, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let direction = 1;
    let boost = 0;
    const skewTo = gsap.quickTo(el, "skewX", { duration: 0.5, ease: "power3" });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        const v = self.getVelocity();
        direction = self.direction;
        boost = Math.min(Math.abs(v) / 120, 18);
        skewTo(gsap.utils.clamp(-8, 8, -v / 350));
      },
    });

    const tick = () => {
      const half = el.scrollWidth / 2;
      x -= (speed + boost) * direction;
      boost *= 0.92;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(el, { x });
      if (Math.abs(boost) < 0.05) skewTo(0);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [speed]);

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
