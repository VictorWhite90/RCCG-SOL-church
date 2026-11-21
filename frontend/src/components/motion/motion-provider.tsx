"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { lineIndexes } from "./words";

gsap.registerPlugin(ScrollTrigger);

type MotionWindow = Window & { __reveal?: boolean; __lenis?: Lenis };

const EASE = "expo.out";
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ────────────────────────────────────────────────────────────────────────
 * Declarative motion vocabulary (add the attribute, get the motion):
 *
 *   data-reveal            fade + rise when scrolled into view
 *   data-reveal-group      children rise in sequence
 *   data-split             headline lines rise from behind a mask (children wrapped in <Words>)
 *   data-split="load"      …immediately instead of on scroll
 *   data-clip              image wipes up from a mask while settling in scale
 *   data-parallax="12"     drifts ±12% while it crosses the viewport
 *   data-scrub-words       words brighten as the reader scrolls through (children in <Words>)
 *   data-count="96.5"      counts up (data-prefix / data-suffix / data-decimals)
 *   data-fill              progress bar grows from zero
 *   data-magnetic          leans toward the pointer
 *   data-cursor="Watch"    shows a label that follows the pointer
 *   data-delay="0.2"       delay (seconds) for any of the above
 * ──────────────────────────────────────────────────────────────────────── */

function onceInView(el: Element, cb: () => void, margin = "0px 0px -10% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin: margin, threshold: 0.01 },
  );
  io.observe(el);
  return io;
}

function delayOf(el: Element) {
  return parseFloat((el as HTMLElement).dataset.delay ?? "0") || 0;
}

/**
 * One-shot entrance animations. Each claimed element is tracked; when the
 * effect is torn down (route change, React dev double-mount) anything that
 * hasn't played yet is restored and released so the next run can claim it.
 * Played entrances are never reverted, so persistent layout stays visible.
 */
type Pending = { el: HTMLElement; played: boolean; io?: IntersectionObserver; undo?: () => void };

function setupEntrances(root: ParentNode, pending: Pending[]) {
  const claim = (sel: string) =>
    Array.from(root.querySelectorAll<HTMLElement>(sel)).filter((el) => {
      if (el.dataset.motion) return false;
      el.dataset.motion = "entrance";
      return true;
    });

  const register = (el: HTMLElement, play: () => void, undo?: () => void, immediate = false) => {
    const entry: Pending = { el, played: false, undo };
    const run = () => {
      entry.played = true;
      el.dataset.motion = "done";
      play();
    };
    if (immediate) run();
    else entry.io = onceInView(el, run);
    pending.push(entry);
  };

  for (const el of claim("[data-reveal]")) {
    register(el, () =>
      gsap.fromTo(el, { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 1.3, delay: delayOf(el), ease: EASE, clearProps: "transform" }),
    );
  }

  for (const el of claim("[data-reveal-group]")) {
    register(el, () =>
      gsap.fromTo(el.children, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, delay: delayOf(el), ease: EASE, clearProps: "transform" }),
    );
  }

  for (const el of claim("[data-clip]")) {
    const media = el.querySelector("img, video");
    register(el, () => {
      gsap.set(el, { opacity: 1 });
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, delay: delayOf(el), ease: "expo.inOut", clearProps: "clipPath" });
      if (media) gsap.fromTo(media, { scale: 1.35 }, { scale: 1, duration: 2, delay: delayOf(el), ease: EASE, clearProps: "scale" });
    });
  }

  for (const el of claim("[data-split]")) {
    // Only transforms React-rendered <Words> spans — never restructures the DOM.
    const words = Array.from(el.querySelectorAll<HTMLElement>(".sw-i"));
    if (!words.length) {
      gsap.set(el, { visibility: "visible" });
      register(el, () => gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, delay: delayOf(el), ease: EASE, clearProps: "transform" }));
      continue;
    }
    gsap.set(words, { yPercent: 115 });
    gsap.set(el, { visibility: "visible" });
    register(
      el,
      () => {
        const lines = lineIndexes(words);
        gsap.to(words, {
          yPercent: 0,
          duration: 1.2,
          ease: EASE,
          delay: (i) => delayOf(el) + lines[i] * 0.11 + i * 0.012,
          clearProps: "transform",
        });
      },
      () => gsap.set([el, ...words], { clearProps: "visibility,transform" }),
      el.dataset.split === "load",
    );
  }

  for (const el of claim("[data-count]")) {
    // Write into React's own text node (never replace it) so React's references stay valid.
    const text = el.firstChild;
    if (!text || text.nodeType !== Node.TEXT_NODE || el.childNodes.length !== 1) continue;
    const original = text.nodeValue;
    const target = parseFloat(el.dataset.count ?? "0");
    const decimals = parseInt(el.dataset.decimals ?? "0", 10);
    const fmt = (n: number) =>
      `${el.dataset.prefix ?? ""}${n.toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${el.dataset.suffix ?? ""}`;
    text.nodeValue = fmt(0);
    const state = { n: 0 };
    register(
      el,
      () => gsap.to(state, { n: target, duration: 2.2, delay: delayOf(el), ease: "power3.out", onUpdate: () => void (text.nodeValue = fmt(state.n)) }),
      () => void (text.nodeValue = original),
    );
  }

  for (const el of claim("[data-fill]")) {
    const width = el.style.width;
    gsap.set(el, { width: 0 });
    register(
      el,
      () => gsap.to(el, { width, duration: 1.8, delay: delayOf(el) + 0.2, ease: "expo.inOut" }),
      () => void (el.style.width = width),
    );
  }
}

function releasePending(pending: Pending[]) {
  for (const p of pending) {
    p.io?.disconnect();
    if (!p.played) {
      p.undo?.();
      delete p.el.dataset.motion;
    }
  }
}

/** Scroll-linked effects. Created inside a gsap.context and reverted per route. */
function setupScrubs(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("[data-parallax]:not([data-motion])").forEach((el) => {
    el.dataset.motion = "scrub";
    const amount = parseFloat(el.dataset.parallax || "10");
    gsap.fromTo(
      el,
      { yPercent: -amount, scale: 1.18 },
      { yPercent: amount, scale: 1.18, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });

  root.querySelectorAll<HTMLElement>("[data-scrub-words]:not([data-motion])").forEach((el) => {
    el.dataset.motion = "scrub";
    const words = el.querySelectorAll(".sw-i");
    if (!words.length) return;
    gsap.fromTo(
      words,
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: 0.6 } },
    );
  });
}

/** Liquid fill: colour floods in from where the pointer enters and drains toward where it leaves. */
function setupLiquidButtons() {
  const fills = new WeakMap<HTMLElement, HTMLSpanElement>();
  const point = (btn: HTMLElement, e: PointerEvent) => {
    const r = btn.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, d: Math.hypot(r.width, r.height) * 2.2 };
  };

  const enter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const btn = (e.target as Element).closest<HTMLElement>(".btn");
    if (!btn || btn.contains(e.relatedTarget as Node)) return;
    const { x, y, d } = point(btn, e);
    fills.get(btn)?.remove();
    const fill = document.createElement("span");
    fill.className = "btn-fill";
    fill.style.left = `${x}px`;
    fill.style.top = `${y}px`;
    btn.prepend(fill);
    fills.set(btn, fill);
    btn.dataset.filled = "";
    gsap.fromTo(fill, { width: 0, height: 0 }, { width: d, height: d, duration: 0.65, ease: "power3.out" });
  };

  const leave = (e: PointerEvent) => {
    const btn = (e.target as Element).closest<HTMLElement>(".btn");
    if (!btn || btn.contains(e.relatedTarget as Node)) return;
    const fill = fills.get(btn);
    delete btn.dataset.filled;
    if (!fill) return;
    const { x, y } = point(btn, e);
    gsap.to(fill, { left: x, top: y, width: 0, height: 0, duration: 0.5, ease: "power3.inOut", onComplete: () => fill.remove() });
    fills.delete(btn);
  };

  const press = (e: PointerEvent) => {
    const btn = (e.target as Element).closest<HTMLElement>(".btn");
    if (!btn) return;
    const { x, y, d } = point(btn, e);
    const ring = document.createElement("span");
    ring.className = "btn-ring";
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    btn.append(ring);
    gsap.fromTo(ring, { width: 0, height: 0, opacity: 0.9 }, { width: d * 0.7, height: d * 0.7, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ring.remove() });
  };

  document.addEventListener("pointerover", enter);
  document.addEventListener("pointerout", leave);
  document.addEventListener("pointerdown", press);
  return () => {
    document.removeEventListener("pointerover", enter);
    document.removeEventListener("pointerout", leave);
    document.removeEventListener("pointerdown", press);
  };
}

/** Magnetic elements and the floating cursor label. */
function setupPointerEffects(label: HTMLDivElement) {
  // GSAP owns this element's transform from here on.
  label.style.scale = "";
  gsap.set(label, { scale: 0, opacity: 0 });
  const xTo = gsap.quickTo(label, "x", { duration: 0.45, ease: "power3" });
  const yTo = gsap.quickTo(label, "y", { duration: 0.45, ease: "power3" });
  let current: string | null = null;

  const move = (e: PointerEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
    const target = e.target as Element;

    const cursorEl = target.closest<HTMLElement>("[data-cursor]");
    const text = cursorEl?.dataset.cursor ?? null;
    if (text !== current) {
      current = text;
      if (text) label.firstElementChild!.textContent = text;
      gsap.to(label, { scale: text ? 1 : 0, opacity: text ? 1 : 0, duration: 0.4, ease: "power3.out" });
    }

    const mag = target.closest<HTMLElement>("[data-magnetic]");
    if (mag) {
      const r = mag.getBoundingClientRect();
      gsap.to(mag, { x: (e.clientX - (r.left + r.width / 2)) * 0.25, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.6, ease: "power3.out" });
    }
  };
  const out = (e: PointerEvent) => {
    const mag = (e.target as Element).closest<HTMLElement>("[data-magnetic]");
    if (mag && !mag.contains(e.relatedTarget as Node)) gsap.to(mag, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerout", out);
  return () => {
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerout", out);
  };
}

export function MotionProvider() {
  const pathname = usePathname();
  const labelRef = useRef<HTMLDivElement>(null);

  // Global, once: smooth scroll + pointer interactions.
  useEffect(() => {
    const w = window as MotionWindow;
    w.__reveal = true;
    if (prefersReducedMotion()) return;

    const cleanups: (() => void)[] = [setupLiquidButtons()];

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 }, autoRaf: false });
    w.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete w.__lenis;
    });

    if (finePointer() && labelRef.current) cleanups.push(setupPointerEffects(labelRef.current));
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Per route: entrances + scroll-linked effects, including content that mounts later.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const w = window as MotionWindow;
    if (!window.location.hash) w.__lenis?.scrollTo(0, { immediate: true, force: true });

    const pending: Pending[] = [];
    const ctx = gsap.context(() => {});
    const scan = (root: ParentNode) => {
      setupEntrances(root, pending);
      ctx.add(() => setupScrubs(root));
    };
    scan(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) scan(n.parentNode ?? (n as Element));
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    window.addEventListener("load", refresh);
    return () => {
      mo.disconnect();
      releasePending(pending);
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
      // Scroll-linked effects were reverted above; release them for the next run.
      document.querySelectorAll<HTMLElement>('[data-motion="scrub"]').forEach((el) => delete el.dataset.motion);
    };
  }, [pathname]);

  return (
    <div
      ref={labelRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] flex size-20 items-center justify-center rounded-full bg-brand opacity-0"
      style={{ translate: "-50% -50%", scale: "0" }}
    >
      <span className="meta font-medium uppercase text-white" />
    </div>
  );
}
