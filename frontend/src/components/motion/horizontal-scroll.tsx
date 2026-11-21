"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * On large screens the section pins and its track travels sideways as the
 * reader scrolls down. On touch / small screens it's a native swipe carousel.
 */
export function HorizontalScroll({ header, children, className = "" }: { header: ReactNode; children: ReactNode; className?: string }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // Layout effect: GSAP's pin wraps this section in a spacer, and that must be
  // reverted *before* React removes the section during navigation.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - el.clientWidth;
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
        },
      });
      // While pinned, the track itself shouldn't scroll natively.
      el.style.overflowX = "visible";
      return () => {
        el.style.overflowX = "";
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={section} className={`flex flex-col justify-center overflow-x-clip lg:min-h-screen ${className}`}>
      {header}
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:px-8 lg:snap-none lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="container-x mt-8 hidden lg:block">
        <div className="h-px w-full bg-current/15">
          <div ref={bar} className="h-px origin-left bg-brand" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
