export function LogoMark({ className = "size-9" }: { className?: string }) {
  // A spring rising from a cross — illustrative mark until the official logo is supplied.
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="20" className="fill-brand" />
      <path d="M20 9v22M13 16h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M11 30c3-2.4 6-2.4 9 0s6 2.4 9 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="leading-none">
        <span className="block text-[1.15rem] font-bold tracking-tight">Spring of Life</span>
        <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] opacity-70">RCCG · Abuja</span>
      </span>
    </span>
  );
}
