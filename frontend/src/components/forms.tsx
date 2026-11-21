"use client";

import { createContext, useActionState, useContext, useId, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitForm, type FormState } from "@/app/actions";
import { buttonClass } from "./ui";

const FormContext = createContext<FormState>({ status: "idle" });

/**
 * Progressive-enhancement form bound to a server action.
 * Shows inline field errors and swaps to a success panel when done.
 */
export function ActionForm({
  formId,
  children,
  className = "",
  successTitle = "Thank you!",
  successExtra,
  compact = false,
}: {
  formId: string;
  children: ReactNode;
  className?: string;
  successTitle?: string;
  successExtra?: ReactNode;
  compact?: boolean;
}) {
  const [state, action] = useActionState(submitForm.bind(null, formId), { status: "idle" } as FormState);

  if (state.status === "success") {
    return (
      <div role="status" className={`rounded-[4px] bg-royal-deep p-8 text-paper ${compact ? "p-5" : ""}`}>
        <CheckCircle2 className="mb-4 size-9 text-rose" aria-hidden />
        <p className="display text-2xl">{successTitle}</p>
        <p className="mt-3 text-white/75">{state.message}</p>
        {successExtra}
      </div>
    );
  }

  return (
    <FormContext.Provider value={state}>
      <form action={action} className={className} noValidate>
        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {state.status === "error" && state.message && (
          <p role="alert" className="mb-5 rounded-[3px] bg-ember/10 px-4 py-3 text-sm font-medium text-ember">
            {state.message}
          </p>
        )}
        {children}
      </form>
    </FormContext.Provider>
  );
}

function useField(name: string) {
  const state = useContext(FormContext);
  return { error: state.errors?.[name], value: state.values?.[name] };
}

type FieldProps = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

function Wrapper({ id, label, hint, error, required, className = "", children }: FieldProps & { id: string; error?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-ember"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-ember">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ type = "text", autoComplete, placeholder, defaultValue, min, inputMode, ...props }: FieldProps & { type?: string; autoComplete?: string; placeholder?: string; defaultValue?: string; min?: string; inputMode?: "numeric" | "tel" | "email" }) {
  const id = useId();
  const { error, value } = useField(props.name);
  return (
    <Wrapper id={id} error={error} {...props}>
      <input
        id={id}
        name={props.name}
        type={type}
        required={props.required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        min={min}
        inputMode={inputMode}
        defaultValue={value ?? defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
      />
    </Wrapper>
  );
}

export function TextArea({ rows = 4, placeholder, ...props }: FieldProps & { rows?: number; placeholder?: string }) {
  const id = useId();
  const { error, value } = useField(props.name);
  return (
    <Wrapper id={id} error={error} {...props}>
      <textarea
        id={id}
        name={props.name}
        rows={rows}
        required={props.required}
        placeholder={placeholder}
        defaultValue={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field resize-y"
      />
    </Wrapper>
  );
}

export function Select({ options, defaultValue, ...props }: FieldProps & { options: (string | { value: string; label: string })[]; defaultValue?: string }) {
  const id = useId();
  const { error, value } = useField(props.name);
  return (
    <Wrapper id={id} error={error} {...props}>
      <select
        id={id}
        name={props.name}
        required={props.required}
        defaultValue={value ?? defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23121214%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10"
      >
        <option value="" disabled>
          Choose…
        </option>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </Wrapper>
  );
}

export function Checkbox({ name, label, hint, defaultChecked }: { name: string; label: ReactNode; hint?: string; defaultChecked?: boolean }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 size-5 shrink-0 accent-royal" />
      <label htmlFor={id} className="text-sm leading-relaxed text-ink-soft">
        <span className="font-semibold text-ink">{label}</span>
        {hint && <span className="block text-muted">{hint}</span>}
      </label>
    </div>
  );
}

export function Hidden({ name, value }: { name: string; value: string }) {
  return <input type="hidden" name={name} value={value} />;
}

export function SubmitButton({ children, variant = "primary", className = "" }: { children: ReactNode; variant?: "primary" | "brand"; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${buttonClass(variant, "lg")} ${className}`}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {pending ? "Sending…" : children}
    </button>
  );
}
