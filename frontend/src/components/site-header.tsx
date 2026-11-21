"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navigation, site } from "@/content/site";
import { buttonClass } from "./ui";
import { Logo } from "./logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Solid once scrolled; tucks away while reading down, returns on any upward scroll.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const lenis = (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]));

  return (
    <header
      className={`sticky top-0 z-40 -mb-[72px] h-[72px] transition-[background-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [view-transition-name:site-header] ${
        solid ? "border-b border-line bg-paper/90 text-ink backdrop-blur-md" : "bg-transparent text-paper"
      } ${hidden && !open ? "-translate-y-full" : ""}`}
    >
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-1 px-3.5 py-2 text-[0.9rem] font-medium ${isActive(item.href) ? "" : "opacity-85 hover:opacity-100"}`}
                >
                  <span
                    className={`absolute inset-x-3.5 bottom-1 h-px origin-left bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 ${isActive(item.href) ? "scale-x-100" : "scale-x-0"}`}
                    aria-hidden
                  />
                  {item.label}
                  {"children" in item && <ChevronDown className="size-3.5 opacity-60 transition-transform group-hover:rotate-180" aria-hidden />}
                </Link>
                {"children" in item && (
                  <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="rounded-[4px] border border-line bg-white p-2 text-ink shadow-xl shadow-ink/10">
                      {item.children.map((child, i) => (
                        <li key={child.href + child.label}>
                          <Link href={child.href} className="group/item flex gap-4 rounded-[3px] px-4 py-3 hover:bg-paper">
                            <span className="meta pt-0.5 text-muted transition-colors group-hover/item:text-brand">0{i + 1}</span>
                            <span>
                            <span className="block font-semibold">{child.label}</span>
                            <span className="block text-sm text-muted">{child.description}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/live"
            className={`hidden h-10 items-center gap-2 rounded-[3px] px-4 text-sm font-semibold sm:inline-flex ${
              solid ? "border border-ink/15 hover:border-ink" : "border border-white/30 hover:bg-white/10"
            }`}
          >
            <span className="size-2 rounded-full bg-red-500" aria-hidden />
            Watch live
          </Link>
          <span className="hidden sm:block">
            <Link href="/visit" className={`${buttonClass("brand", "sm")} h-10`}>
              Plan a visit
            </Link>
          </span>
          <button
            type="button"
            className={`inline-flex size-11 items-center justify-center rounded-full lg:hidden ${solid ? "hover:bg-ink/5" : "hover:bg-white/10"}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" data-lenis-prevent className="absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-paper text-ink lg:hidden">
          <nav aria-label="Mobile" className="container-x py-6">
            {navigation.map((item) => (
              <div key={item.label} className="border-b border-line py-4">
                <Link href={item.href} className="display text-2xl">
                  {item.label}
                </Link>
                {"children" in item && (
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {item.children.map((child) => (
                      <li key={child.href + child.label}>
                        <Link href={child.href} className="text-ink-soft">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="mt-8 grid gap-3">
              <Link href="/visit" className={buttonClass("brand", "lg")}>
                Plan a visit
              </Link>
              <Link href="/live" className={buttonClass("outline", "lg")}>
                Watch live
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
