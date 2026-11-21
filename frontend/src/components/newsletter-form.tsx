"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { submitForm, type FormState } from "@/app/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-label="Subscribe" className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark">
      {pending ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
    </button>
  );
}

export function NewsletterForm() {
  const [state, action] = useActionState(submitForm.bind(null, "newsletter"), { status: "idle" } as FormState);
  if (state.status === "success") {
    return (
      <p role="status" className="flex items-center gap-3 self-center text-lg">
        <Check className="size-6 text-rose" /> {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="self-center" noValidate>
      <label htmlFor="newsletter-email" className="mb-3 block text-sm text-white/60">
        Your email address
      </label>
      <div className="flex items-center gap-2 rounded-[3px] border border-white/20 bg-white/5 p-1.5 pl-5 focus-within:border-brand">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values?.email}
          aria-invalid={state.errors?.email ? true : undefined}
          className="min-w-0 flex-1 bg-transparent py-2 text-paper placeholder:text-white/35 focus:outline-none"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <Submit />
      </div>
      {state.errors?.email && <p className="mt-2 pl-5 text-sm text-rose" role="alert">{state.errors.email}</p>}
    </form>
  );
}
