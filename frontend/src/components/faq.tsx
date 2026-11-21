import { Plus } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line" data-reveal>
      {items.map((item) => (
        <details key={item.q} className="group py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus className="size-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden />
          </summary>
          <p className="pb-5 pr-10 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
