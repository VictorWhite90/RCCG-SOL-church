"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Info, Loader2, Lock, Printer } from "lucide-react";
import { funds, presetAmounts, type FundId } from "@/content/giving";
import { formatNaira } from "@/lib/format";
import { buttonClass } from "./ui";

type PaystackTransaction = { reference: string };
type PaystackPopInstance = {
  newTransaction: (opts: {
    key: string;
    email: string;
    amount: number;
    currency: "NGN";
    metadata?: Record<string, unknown>;
    onSuccess: (tx: PaystackTransaction) => void;
    onCancel: () => void;
    onError?: (err: { message?: string }) => void;
  }) => void;
};
declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopInstance;
  }
}

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
const SCRIPT_SRC = "https://js.paystack.co/v2/inline.js";

/** Paystack local card fee: 1.5% + ₦100 (₦100 waived under ₦2,500), capped at ₦2,000. */
export function processingFee(amount: number) {
  if (!amount) return 0;
  const flat = amount >= 2500 ? 100 : 0;
  // Gross up so the church receives the full intended gift.
  const gross = (amount + flat) / (1 - 0.015);
  return Math.min(2000, Math.ceil(gross - amount));
}

function loadPaystack(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Paystack failed to load")));
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

type Receipt = { amount: number; fund: string; reference: string; date: string };

export function GiveForm({ initialFund = "tithe" }: { initialFund?: FundId }) {
  const [fund, setFund] = useState<FundId>(initialFund);
  const [preset, setPreset] = useState<number | null>(10000);
  const [custom, setCustom] = useState("");
  const [coverFee, setCoverFee] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "paying" | "verifying" | "error">("idle");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const amount = custom ? Math.floor(Number(custom.replace(/[^\d]/g, "")) || 0) : (preset ?? 0);
  const fee = coverFee ? processingFee(amount) : 0;
  const total = amount + fee;
  const fundLabel = funds.find((f) => f.id === fund)?.label ?? fund;

  useEffect(() => {
    if (PAYSTACK_KEY) loadPaystack().catch(() => {});
  }, []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (amount < 100) e.amount = "Enter an amount of at least ₦100.";
    if (amount > 50_000_000) e.amount = "For gifts above ₦50m please use bank transfer.";
    if (!name.trim() && !anonymous) e.name = "Enter your name, or choose to give anonymously.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = "Enter a valid email for your receipt.";
    if (phone && !/^\+?[\d\s()-]{7,20}$/.test(phone)) e.phone = "Enter a valid phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [amount, name, anonymous, email, phone]);

  async function verify(reference: string) {
    setStatus("verifying");
    try {
      const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
      const json = (await res.json()) as { ok: boolean; amount?: number; fund?: string; message?: string };
      if (!json.ok) throw new Error(json.message ?? "We could not confirm this payment.");
      setReceipt({ amount: json.amount ?? total, fund: fundLabel, reference, date: new Date().toISOString() });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setMessage(
        `${err instanceof Error ? err.message : "We could not confirm this payment."} If you were debited, please contact the church office with reference ${reference}.`,
      );
    }
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!validate() || !PAYSTACK_KEY) return;
    setStatus("paying");
    try {
      await loadPaystack();
      if (!window.PaystackPop) throw new Error("Paystack unavailable");
      const popup = new window.PaystackPop();
      popup.newTransaction({
        key: PAYSTACK_KEY,
        email: email.trim(),
        amount: total * 100,
        currency: "NGN",
        metadata: {
          fund,
          gift_amount: amount,
          fee_covered: fee,
          name: anonymous ? "Anonymous" : name.trim(),
          phone: phone.trim(),
          note: note.trim(),
          custom_fields: [
            { display_name: "Fund", variable_name: "fund", value: fundLabel },
            { display_name: "Donor", variable_name: "donor", value: anonymous ? "Anonymous" : name.trim() },
          ],
        },
        onSuccess: (tx) => void verify(tx.reference),
        onCancel: () => {
          setStatus("idle");
          setMessage("Payment cancelled. Nothing was charged.");
        },
        onError: (err) => {
          setStatus("error");
          setMessage(err?.message ?? "The payment window could not open.");
        },
      });
    } catch {
      setStatus("error");
      setMessage("We couldn't reach our payment provider. Please check your connection or use bank transfer.");
    }
  }

  if (receipt) {
    return (
      <div role="status" className="rounded-[4px] bg-royal-deep p-8 text-paper md:p-10" id="give-receipt">
        <CheckCircle2 className="mb-5 size-10 text-rose" aria-hidden />
        <p className="display text-3xl">Thank you for your generosity.</p>
        <p className="mt-3 text-white/70">Your gift has been received. A receipt has also been sent to {email}.</p>
        <dl className="mt-8 grid gap-4 rounded-[4px] bg-white/5 p-6 text-sm sm:grid-cols-2">
          <div><dt className="text-white/50">Amount</dt><dd className="display text-xl">{formatNaira(receipt.amount)}</dd></div>
          <div><dt className="text-white/50">Fund</dt><dd className="text-lg font-semibold">{receipt.fund}</dd></div>
          <div><dt className="text-white/50">Reference</dt><dd className="font-mono">{receipt.reference}</dd></div>
          <div><dt className="text-white/50">Date</dt><dd>{new Date(receipt.date).toLocaleString("en-NG")}</dd></div>
        </dl>
        <button type="button" onClick={() => window.print()} className={`${buttonClass("brand")} mt-8`}>
          <Printer className="size-4" aria-hidden /> Download receipt
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={pay} noValidate className="rounded-[4px] bg-white p-6 ring-1 ring-line md:p-10">
      <fieldset>
        <legend className="eyebrow mb-4 text-royal">1 · Choose a fund</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {funds.map((f) => (
            <label
              key={f.id}
              className={`cursor-pointer rounded-[4px] border p-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                fund === f.id ? "border-royal bg-royal/5 ring-1 ring-royal" : "border-line hover:border-ink/40"
              }`}
            >
              <input type="radio" name="fund" value={f.id} checked={fund === f.id} onChange={() => setFund(f.id)} className="sr-only" />
              <span className="block font-semibold">{f.label}</span>
              <span className="mt-0.5 block text-sm text-muted">{f.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="eyebrow mb-4 text-royal">2 · Amount</legend>
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((a) => {
            const active = !custom && preset === a;
            return (
              <label
                key={a}
                className={`cursor-pointer rounded-[3px] border px-5 py-2.5 font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                  active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name="preset"
                  value={a}
                  checked={active}
                  onChange={() => {
                    setPreset(a);
                    setCustom("");
                  }}
                  className="sr-only"
                />
                {formatNaira(a)}
              </label>
            );
          })}
        </div>
        <div className="mt-4">
          <label htmlFor="give-custom" className="mb-2 block text-sm font-semibold">Or enter another amount</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted">₦</span>
            <input
              id="give-custom"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Custom amount"
              aria-invalid={errors.amount ? true : undefined}
              aria-describedby={errors.amount ? "give-amount-error" : undefined}
              className="field pl-9"
            />
          </div>
          {errors.amount && <p id="give-amount-error" className="mt-1.5 text-sm text-ember">{errors.amount}</p>}
        </div>
        <label className="mt-5 flex items-start gap-3 text-sm">
          <input type="checkbox" checked={coverFee} onChange={(e) => setCoverFee(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-royal" />
          <span>
            <span className="font-semibold">Cover the card processing fee</span>
            <span className="block text-muted">So 100% of your gift goes to the {fundLabel.toLowerCase()}.</span>
          </span>
        </label>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="eyebrow mb-4 text-royal">3 · Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="give-name" label="Full name" value={name} onChange={setName} error={errors.name} autoComplete="name" required={!anonymous} />
          <TextField id="give-email" label="Email (for your receipt)" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" required />
          <TextField id="give-phone" label="Phone" type="tel" value={phone} onChange={setPhone} error={errors.phone} autoComplete="tel" />
          <TextField id="give-note" label="Note" value={note} onChange={setNote} placeholder="e.g. Thanksgiving for a new job" />
        </div>
        <label className="mt-5 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="size-5 accent-royal" />
          <span className="font-semibold">Give anonymously</span>
        </label>
      </fieldset>

      <div className="mt-10 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <div aria-live="polite">
          <p className="text-sm text-muted">Total today</p>
          <p className="display text-3xl">{formatNaira(total)}</p>
          {fee > 0 && <p className="text-sm text-muted">Includes {formatNaira(fee)} processing fee</p>}
        </div>
        {PAYSTACK_KEY ? (
          <button type="submit" disabled={status === "paying" || status === "verifying"} className={buttonClass("primary", "lg")}>
            {status === "paying" || status === "verifying" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
            {status === "verifying" ? "Confirming…" : status === "paying" ? "Opening secure checkout…" : `Give ${formatNaira(total)}`}
          </button>
        ) : (
          <p className="flex max-w-sm items-start gap-2 rounded-[4px] bg-brand-soft px-4 py-3 text-sm text-ink">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            Online card payments are being set up — please use bank transfer below for now.
          </p>
        )}
      </div>
      {message && (
        <p role="alert" className={`mt-5 rounded-[3px] px-4 py-3 text-sm font-medium ${status === "error" ? "bg-ember/10 text-ember" : "bg-ink/5 text-ink-soft"}`}>
          {message}
        </p>
      )}
      {PAYSTACK_KEY && (
        <p className="mt-5 flex items-center gap-2 text-xs text-muted">
          <Lock className="size-3.5" aria-hidden /> Secured by Paystack · PCI-DSS compliant. We never see or store your card details.
        </p>
      )}
    </form>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {required ? <span className="text-ember"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
      />
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-ember">{error}</p>}
    </div>
  );
}
