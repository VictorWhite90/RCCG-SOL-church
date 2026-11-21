import "server-only";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Minimal submission store.
 *
 * Each form submission is appended as one JSON line to `.data/<kind>.jsonl`
 * and, when `SUBMISSIONS_WEBHOOK_URL` is set, POSTed to that URL so the church
 * can route it to email, Slack, Google Sheets, Zapier/Make or a CRM.
 *
 * On read-only hosts (e.g. serverless) the file write is skipped and the
 * webhook is the delivery channel. Replace with the real backend when ready.
 */

export type SubmissionKind =
  | "visit"
  | "prayer"
  | "connect"
  | "contact"
  | "event-registration"
  | "ministry-interest"
  | "fellowship-join"
  | "newsletter"
  | "giving";

export type Submission = {
  id: string;
  kind: SubmissionKind;
  createdAt: string;
  data: Record<string, string | boolean | number>;
};

const dataDir = path.join(process.cwd(), ".data");

export async function saveSubmission(kind: SubmissionKind, data: Submission["data"]) {
  const record: Submission = { id: randomUUID(), kind, createdAt: new Date().toISOString(), data };
  let stored = false;
  try {
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, `${kind}.jsonl`), JSON.stringify(record) + "\n", "utf8");
    stored = true;
  } catch (error) {
    console.warn(`[submissions] could not write ${kind} locally`, error);
  }

  const webhook = process.env.SUBMISSIONS_WEBHOOK_URL;
  let delivered = false;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(8000),
      });
      delivered = res.ok;
    } catch (error) {
      console.warn(`[submissions] webhook delivery failed for ${kind}`, error);
    }
  }

  if (!stored && !delivered) throw new Error("Submission could not be stored");
  return record;
}

export async function readSubmissions(kind: SubmissionKind): Promise<Submission[]> {
  try {
    const raw = await readFile(path.join(dataDir, `${kind}.jsonl`), "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Submission);
  } catch {
    return [];
  }
}

const prayedFile = path.join(dataDir, "prayed-counts.json");

export async function readPrayedCounts(): Promise<Record<string, number>> {
  try {
    return JSON.parse(await readFile(prayedFile, "utf8"));
  } catch {
    return {};
  }
}

export async function incrementPrayed(id: string) {
  const counts = await readPrayedCounts();
  counts[id] = (counts[id] ?? 0) + 1;
  try {
    await mkdir(dataDir, { recursive: true });
    await writeFile(prayedFile, JSON.stringify(counts), "utf8");
  } catch (error) {
    console.warn("[submissions] could not store prayed count", error);
  }
  return counts[id];
}
