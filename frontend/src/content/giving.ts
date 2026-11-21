import { photos, type Photo } from "./media";

export const funds = [
  { id: "tithe", label: "Tithe", description: "Honouring God with the first tenth." },
  { id: "offering", label: "Offering", description: "Supporting the ministry and mission of the church." },
  { id: "thanksgiving", label: "Thanksgiving", description: "A seed of gratitude for what God has done." },
  { id: "building", label: "Building fund", description: "Room to grow for the next generation." },
  { id: "welfare", label: "Welfare & outreach", description: "Practical love for neighbours in need." },
  { id: "missions", label: "Missions", description: "Taking the gospel beyond our walls." },
] as const;

export type FundId = (typeof funds)[number]["id"];

// CONFIRM: official church bank accounts
export const bankAccounts = [
  { purpose: "Tithes & offerings", bank: "Bank name", accountName: "RCCG Spring of Life Parish", accountNumber: "0000000000" },
  { purpose: "Building fund", bank: "Bank name", accountName: "RCCG Spring of Life Building", accountNumber: "0000000001" },
];

export const presetAmounts = [5000, 10000, 20000, 50000, 100000];

export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  vision: string;
  image: Photo;
  goal: number;
  raised: number;
  supporters: number;
  story: string[];
  milestones: { title: string; status: "done" | "current" | "next"; note: string }[];
};

// CONFIRM: approved projects, targets and progress
export const projects: Project[] = [
  {
    slug: "building-for-generations",
    title: "Building for Generations",
    category: "Church development",
    summary: "A new 1,200-seat auditorium with children's wing, so every family has room to belong.",
    vision: "Room to grow. Space to belong.",
    image: photos.arena,
    goal: 250_000_000,
    raised: 96_500_000,
    supporters: 412,
    story: [
      "Our Sunday services are full. Families are standing at the back and children's classes are over capacity.",
      "This project builds a 1,200-seat auditorium and a dedicated children's wing with safe check-in, classrooms and a nursery.",
    ],
    milestones: [
      { title: "Land secured & approvals", status: "done", note: "Completed" },
      { title: "Foundation & structure", status: "current", note: "In progress" },
      { title: "Roofing & finishing", status: "next", note: "Upcoming" },
      { title: "Dedication service", status: "next", note: "Upcoming" },
    ],
  },
  {
    slug: "love-beyond-the-walls",
    title: "Love Beyond the Walls",
    category: "Community outreach",
    summary: "Feeding 1,000 families and running free health clinics across Abuja communities this year.",
    vision: "Compassion that reaches our city.",
    image: photos.outreach,
    goal: 15_000_000,
    raised: 9_850_000,
    supporters: 268,
    story: [
      "Every quarter our volunteers take food, medical care and the love of Christ to communities around Abuja.",
      "Each ₦15,000 provides a family food pack for a month.",
    ],
    milestones: [
      { title: "Q1 outreach · Lugbe", status: "done", note: "320 families" },
      { title: "Q2 outreach · Kubwa", status: "done", note: "280 families" },
      { title: "Christmas outreach", status: "current", note: "Dec 23" },
      { title: "Q1 2027 · Apo", status: "next", note: "Planned" },
    ],
  },
  {
    slug: "making-room-for-the-message",
    title: "Making Room for the Message",
    category: "Worship & media",
    summary: "New cameras, sound and livestream equipment so the Word reaches homes, hospitals and the diaspora.",
    vision: "Sharing truth. Encouraging faith.",
    image: photos.preacher,
    goal: 30_000_000,
    raised: 21_300_000,
    supporters: 187,
    story: [
      "Hundreds join our services online every week — the sick, the travelling and family abroad.",
      "This upgrade replaces ageing sound and camera equipment and adds a dedicated livestream suite.",
    ],
    milestones: [
      { title: "Sound system upgrade", status: "done", note: "Completed" },
      { title: "Cameras & streaming suite", status: "current", note: "In progress" },
      { title: "Training the media team", status: "next", note: "Upcoming" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
