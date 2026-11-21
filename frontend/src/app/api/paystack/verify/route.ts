import type { NextRequest } from "next/server";
import { funds } from "@/content/giving";
import { saveSubmission } from "@/lib/submissions";

type PaystackVerify = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number; // kobo
    currency: string;
    paid_at: string;
    customer?: { email?: string };
    metadata?: { fund?: string; gift_amount?: number; fee_covered?: number; name?: string; phone?: string; note?: string } | string;
  };
};

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference") ?? "";
  if (!/^[\w.=-]{1,100}$/.test(reference)) {
    return Response.json({ ok: false, message: "Invalid payment reference." }, { status: 400 });
  }
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return Response.json({ ok: false, message: "Online giving is not configured." }, { status: 503 });
  }

  let body: PaystackVerify;
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    body = (await res.json()) as PaystackVerify;
  } catch {
    return Response.json({ ok: false, message: "Could not reach Paystack to confirm the payment." }, { status: 502 });
  }

  const tx = body.data;
  if (!body.status || !tx || tx.status !== "success" || tx.currency !== "NGN") {
    return Response.json({ ok: false, message: "This payment was not successful." }, { status: 402 });
  }

  const meta = typeof tx.metadata === "object" && tx.metadata ? tx.metadata : {};
  const fundId = funds.some((f) => f.id === meta.fund) ? String(meta.fund) : "offering";
  const amount = tx.amount / 100;

  try {
    await saveSubmission("giving", {
      reference: tx.reference,
      fund: fundId,
      amount,
      giftAmount: Number(meta.gift_amount ?? amount),
      feeCovered: Number(meta.fee_covered ?? 0),
      name: String(meta.name ?? ""),
      email: tx.customer?.email ?? "",
      phone: String(meta.phone ?? ""),
      note: String(meta.note ?? ""),
      paidAt: tx.paid_at,
    });
  } catch {
    // Payment succeeded on Paystack; the record is still available in the Paystack dashboard.
  }

  return Response.json({ ok: true, amount, fund: fundId, reference: tx.reference });
}
