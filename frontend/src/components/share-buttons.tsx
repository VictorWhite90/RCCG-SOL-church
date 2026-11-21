"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7a11.8 11.8 0 0 0 5.7 1.5c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.4-8.4Z" />
    </svg>
  );
}

/** Native share (where supported), WhatsApp and copy-link. */
export function ShareButtons({ title, text, path, tone = "light" }: { title: string; text?: string; path: string; tone?: "light" | "dark" }) {
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only values
    setUrl(new URL(path, window.location.origin).toString());
    setCanShare(typeof navigator.share === "function");
  }, [path]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch {
      /* dismissed */
    }
  };

  const base =
    tone === "dark"
      ? "border border-white/20 text-white hover:bg-white hover:text-ink"
      : "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-paper";
  const btn = `inline-flex h-10 items-center gap-2 rounded-[3px] px-4 text-sm font-semibold transition ${base}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title}${text ? ` — ${text}` : ""}\n${url}`)}`;

  return (
    <div className="flex flex-wrap gap-2">
      <a href={wa} target="_blank" rel="noreferrer" className={btn}>
        <WhatsAppIcon /> WhatsApp
      </a>
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        {copied ? "Copied" : "Copy link"}
      </button>
      {canShare && (
        <button type="button" onClick={share} className={btn}>
          <Share2 className="size-4" aria-hidden /> Share
        </button>
      )}
    </div>
  );
}
