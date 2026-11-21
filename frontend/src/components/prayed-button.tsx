"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";
import { markPrayed } from "@/app/actions";

const STORAGE_KEY = "sol-prayed";

function readPrayed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function PrayedButton({ id, initialCount }: { id: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [optimistic, addOptimistic] = useOptimistic(count, (c: number, delta: number) => c + delta);
  const [prayed, setPrayed] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with localStorage after mount
    if (readPrayed().includes(id)) setPrayed(true);
  }, [id]);

  function onClick() {
    if (prayed) return;
    setPrayed(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...readPrayed(), id].slice(-500)));
    } catch {
      /* storage unavailable */
    }
    startTransition(async () => {
      addOptimistic(1);
      const next = await markPrayed(id);
      setCount(next || count + 1);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={prayed}
      aria-pressed={prayed}
      className={`inline-flex h-9 items-center gap-2 rounded-[3px] px-4 text-sm font-semibold transition ${
        prayed ? "bg-royal text-paper" : "border border-line hover:border-ink hover:bg-ink hover:text-paper"
      }`}
    >
      <span aria-hidden>🙏</span>
      {prayed ? "Prayed" : "I prayed"}
      <span className="tabular-nums opacity-75">· {optimistic}</span>
    </button>
  );
}
