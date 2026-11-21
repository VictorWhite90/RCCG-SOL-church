import { photos, type Photo } from "./media";

export type EventCategory = "Worship" | "Prayer" | "Community" | "Youth" | "Family" | "Outreach";

export type ChurchEvent = {
  slug: string;
  title: string;
  category: EventCategory;
  start: string; // ISO with +01:00 offset
  end: string;
  location: string;
  summary: string;
  details: string[];
  image: Photo;
  registration: boolean;
  capacity?: number;
};

// CONFIRM: sample calendar. Replace with the church's approved programme.
export const events: ChurchEvent[] = [
  {
    slug: "thanksgiving-sunday-december",
    title: "Thanksgiving Sunday",
    category: "Worship",
    start: "2026-12-06T08:00:00+01:00",
    end: "2026-12-06T12:00:00+01:00",
    location: "Main Auditorium",
    summary: "Our monthly celebration of God's faithfulness — come with a song and a testimony.",
    details: [
      "The first Sunday of every month is set apart to give thanks for all God has done.",
      "Bring your family, your friends and your testimony. There will be special ministrations from our choir and a thanksgiving procession.",
    ],
    image: photos.arena,
    registration: false,
  },
  {
    slug: "carols-by-candlelight",
    title: "Carols by Candlelight",
    category: "Family",
    start: "2026-12-20T17:00:00+01:00",
    end: "2026-12-20T19:30:00+01:00",
    location: "Main Auditorium",
    summary: "An evening of carols, the Christmas story and candlelight for the whole family.",
    details: [
      "Invite a friend to our favourite night of the year. Choir, nine lessons, children's nativity and candlelight.",
      "Free entry. Seats are limited, so please register so we can prepare enough candles and refreshments.",
    ],
    image: photos.worship,
    registration: true,
    capacity: 600,
  },
  {
    slug: "christmas-outreach",
    title: "Christmas Community Outreach",
    category: "Outreach",
    start: "2026-12-23T09:00:00+01:00",
    end: "2026-12-23T14:00:00+01:00",
    location: "Meeting point: Church car park",
    summary: "Food packs, health checks and Christmas joy for families in our community.",
    details: [
      "We will pack and distribute food packs, run a free health check tent and share the love of Christ with our neighbours.",
      "Volunteers of all ages are welcome. Register so we can assign teams and transport.",
    ],
    image: photos.outreach,
    registration: true,
    capacity: 120,
  },
  {
    slug: "crossover-night-2027",
    title: "Crossover Night 2026 → 2027",
    category: "Worship",
    start: "2026-12-31T21:00:00+01:00",
    end: "2027-01-01T01:00:00+01:00",
    location: "Main Auditorium",
    summary: "Cross into the new year in worship, prayer and prophetic declaration.",
    details: [
      "End the year in God's presence. Worship, testimonies, communion and prayer as we cross into 2027 together.",
      "Children's church runs until 11:00pm. Security and parking stewards will be on duty all night.",
    ],
    image: photos.arena,
    registration: false,
  },
  {
    slug: "21-days-fasting-and-prayer",
    title: "21 Days of Fasting & Prayer",
    category: "Prayer",
    start: "2027-01-05T06:00:00+01:00",
    end: "2027-01-25T19:30:00+01:00",
    location: "Church & online",
    summary: "Start the year on our knees. Daily morning prayer online and evening gatherings.",
    details: [
      "Daily 6:00am prayer call online and 6:00pm evening gatherings at church (Monday–Friday).",
      "A daily prayer guide will be shared with everyone who registers.",
    ],
    image: photos.worship,
    registration: true,
  },
  {
    slug: "youth-hangout-january",
    title: "Youth Hangout: Fresh Start",
    category: "Youth",
    start: "2027-01-16T15:00:00+01:00",
    end: "2027-01-16T18:00:00+01:00",
    location: "Youth Hall",
    summary: "Games, food, music and a real conversation about purpose for ages 13–25.",
    details: [
      "Bring a friend for an afternoon of games, food and honest conversation about starting the year with purpose.",
    ],
    image: photos.welcome,
    registration: true,
    capacity: 150,
  },
  {
    slug: "marriage-enrichment-dinner",
    title: "Marriage Enrichment Dinner",
    category: "Family",
    start: "2027-02-13T18:00:00+01:00",
    end: "2027-02-13T21:00:00+01:00",
    location: "Church Banquet Hall",
    summary: "A relaxed evening for couples with dinner, a short talk and plenty of laughter.",
    details: ["Married and engaged couples welcome. Dinner is provided; please register both names."],
    image: photos.welcome,
    registration: true,
    capacity: 80,
  },
];

export const eventCategories: EventCategory[] = ["Worship", "Prayer", "Family", "Youth", "Community", "Outreach"];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

/** Events that have not yet ended, soonest first. */
export function upcomingEvents(now = new Date()) {
  return events
    .filter((e) => new Date(e.end) > now)
    .sort((a, b) => a.start.localeCompare(b.start));
}
