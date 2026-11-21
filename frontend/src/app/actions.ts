"use server";

import { revalidatePath } from "next/cache";
import { incrementPrayed, saveSubmission, type SubmissionKind } from "@/lib/submissions";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

type Rule = {
  label: string;
  required?: boolean;
  type?: "email" | "phone" | "text" | "number" | "checkbox";
  max?: number;
};

const name: Rule = { label: "Name", required: true, max: 80 };
const email: Rule = { label: "Email", type: "email", max: 120 };
const phone: Rule = { label: "Phone", type: "phone", max: 24 };

const forms: Record<string, { kind: SubmissionKind; fields: Record<string, Rule>; success: string; needsContact?: boolean }> = {
  visit: {
    kind: "visit",
    fields: {
      name,
      email: { ...email, required: true },
      phone,
      date: { label: "Visit date", required: true, max: 20 },
      service: { label: "Service", required: true, max: 60 },
      party: { label: "Party size", type: "number", max: 3 },
      kids: { label: "Children", type: "checkbox" },
      notes: { label: "Notes", max: 600 },
    },
    success: "You're all set! We'll save you a seat and someone from our welcome team will reach out before Sunday.",
  },
  prayer: {
    kind: "prayer",
    fields: {
      name: { ...name, required: false },
      email,
      phone,
      category: { label: "Category", max: 40 },
      request: { label: "Prayer request", required: true, max: 1200 },
      public: { label: "Share on prayer wall", type: "checkbox" },
      contact: { label: "Pastor follow-up", type: "checkbox" },
    },
    success: "Thank you for trusting us. Our prayer team will be praying for you this week.",
  },
  connect: {
    kind: "connect",
    fields: {
      name,
      email,
      phone,
      status: { label: "How are you connected", required: true, max: 60 },
      steps: { label: "Next steps", max: 300 },
      message: { label: "Message", max: 800 },
    },
    success: "Welcome to the family! Our connect team will reach out within a few days.",
    needsContact: true,
  },
  contact: {
    kind: "contact",
    fields: {
      name,
      email: { ...email, required: true },
      phone,
      topic: { label: "Topic", max: 60 },
      message: { label: "Message", required: true, max: 2000 },
    },
    success: "Message received. The church office will reply within two working days.",
  },
  event: {
    kind: "event-registration",
    fields: {
      event: { label: "Event", required: true, max: 120 },
      name,
      email: { ...email, required: true },
      phone,
      guests: { label: "Guests", type: "number", max: 2 },
    },
    success: "You're registered! A confirmation will be sent to your email.",
  },
  ministry: {
    kind: "ministry-interest",
    fields: {
      ministry: { label: "Ministry", required: true, max: 80 },
      name,
      email,
      phone,
      role: { label: "Role", max: 80 },
      message: { label: "Message", max: 800 },
    },
    success: "Thanks for stepping forward! The ministry leader will contact you soon.",
    needsContact: true,
  },
  fellowship: {
    kind: "fellowship-join",
    fields: {
      fellowship: { label: "Fellowship", required: true, max: 80 },
      name,
      phone: { ...phone, required: true },
      email,
    },
    success: "Request sent! The host will call you with directions before the next meeting.",
  },
  newsletter: {
    kind: "newsletter",
    fields: { email: { ...email, required: true } },
    success: "You're subscribed. Look out for our weekly update.",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

export async function submitForm(formId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const form = forms[formId];
  if (!form) return { status: "error", message: "Unknown form." };

  // Honeypot — bots fill every field.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: form.success };
  }

  const values: Record<string, string> = {};
  const data: Record<string, string | boolean | number> = {};
  const errors: Record<string, string> = {};

  for (const [key, rule] of Object.entries(form.fields)) {
    if (rule.type === "checkbox") {
      data[key] = formData.get(key) === "on";
      continue;
    }
    // Multi-select checkbox groups submit repeated `step` values.
    const raw = key === "steps" ? formData.getAll("step").map(String).join(", ") : formData.get(key);
    const value = String(raw ?? "").trim();
    values[key] = value;
    if (!value) {
      if (rule.required) errors[key] = `${rule.label} is required.`;
      continue;
    }
    if (rule.max && value.length > rule.max) errors[key] = `${rule.label} is too long.`;
    else if (rule.type === "email" && !EMAIL_RE.test(value)) errors[key] = "Enter a valid email address.";
    else if (rule.type === "phone" && !PHONE_RE.test(value)) errors[key] = "Enter a valid phone number.";
    else if (rule.type === "number" && (!/^\d+$/.test(value) || Number(value) > 50)) errors[key] = `Enter a valid ${rule.label.toLowerCase()}.`;
    data[key] = rule.type === "number" ? Number(value) : value;
  }

  if (form.needsContact && !values.email && !values.phone && !errors.email && !errors.phone) {
    errors.email = "Give us an email or phone number so we can reach you.";
  }

  if (Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  try {
    await saveSubmission(form.kind, data);
  } catch {
    return { status: "error", message: "Something went wrong on our side. Please try again, or contact the church office.", values };
  }

  if (form.kind === "prayer" && data.public) revalidatePath("/prayer");
  return { status: "success", message: form.success };
}

export async function markPrayed(id: string) {
  if (!/^[\w-]{1,64}$/.test(id)) return 0;
  return incrementPrayed(id);
}
