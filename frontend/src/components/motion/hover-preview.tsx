"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/**
 * Rows marked `data-preview="/img.jpg"` show a photo that trails the pointer,
 * tilting with its horizontal speed. Desktop (fine pointer) only.
 */
export function HoverPreview({ children, className = "" }: { children: ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const el = card.current;
    if (!host || !el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const rotTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    let src = "";

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rotTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
      const row = (e.target as Element).closest<HTMLElement>("[data-preview]");
      const next = row?.dataset.preview ?? "";
      if (next !== src) {
        src = next;
        if (next) el.style.backgroundImage = `url(${next})`;
        gsap.to(el, { scale: next ? 1 : 0, opacity: next ? 1 : 0, duration: 0.5, ease: "power3.out" });
      }
    };
    const leave = () => {
      src = "";
      gsap.to(el, { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" });
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={wrap} className={className}>
      {children}
      <div
        ref={card}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-52 w-72 rounded-[4px] bg-cover bg-center opacity-0 shadow-2xl shadow-ink/30 lg:block"
      />
    </div>
  );
}
