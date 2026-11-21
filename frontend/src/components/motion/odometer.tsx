/** A digit that rolls to its value like a mechanical counter. */
export function OdometerDigit({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-bottom leading-none" aria-hidden>
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ transform: `translateY(${-value * 10}%)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] text-center">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Odometer({ value, digits = 2 }: { value: number; digits?: number }) {
  const str = String(value).padStart(digits, "0");
  return (
    <span className="inline-flex tabular-nums">
      <span className="sr-only">{value}</span>
      {str.split("").map((d, i) => (
        <OdometerDigit key={i} value={Number(d)} />
      ))}
    </span>
  );
}
