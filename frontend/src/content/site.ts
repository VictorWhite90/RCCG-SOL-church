/**
 * Central church configuration.
 *
 * Everything the church needs to edit — service times, contacts, bank details,
 * socials — lives here. Values marked `CONFIRM` are sample content and must be
 * verified by the church before public launch. While `preview` is true a small
 * banner tells visitors that some details are still being confirmed.
 */

export const site = {
  preview: true,
  name: "RCCG Spring of Life",
  shortName: "Spring of Life",
  parish: "The Redeemed Christian Church of God",
  city: "Abuja",
  tagline: "Come as you are. Become who you're called to be.",
  description:
    "A Spirit-filled family in Abuja growing in faith, connected in love and living with purpose. Join us this Sunday.",
  timezone: "Africa/Lagos",
  // Lagos is UTC+1 year-round (no daylight saving).
  utcOffsetHours: 1,

  address: {
    line1: "Utako, Abuja 900108",
    line2: "Federal Capital Territory",
    plusCode: "3C2F+85G",
    mapQuery: "3C2F+85G Utako, Abuja",
    directions:
      "We meet at one location in Utako. Search the Plus Code 3C2F+85G in Google Maps for exact directions.",
  },

  contact: {
    phone: "+234 9 291 6653",
    // Leave empty to hide. Add a WhatsApp number (digits only, e.g. 2348012345678) or email when available.
    whatsapp: "",
    email: "",
    officeHours: "Sundays from 8:00am · Tuesday & Thursday evenings",
  },

  // Only channels with a URL are shown on the site.
  social: {
    facebook: "https://www.facebook.com/rccg.rccgspringoflifezone.1/",
    instagram: "https://www.instagram.com/rccgspringoflifezone/",
    youtube: "",
    x: "",
  },

  live: {
    // Services are streamed live on the church Facebook page.
    platform: "facebook",
    facebookUrl: "https://www.facebook.com/rccg.rccgspringoflifezone.1/live_videos/",
    youtubeChannelId: "",
  },
} as const;

export type SocialNetwork = keyof typeof site.social;
export const socialLinks = (Object.entries(site.social) as [SocialNetwork, string][]).filter(([, url]) => url);

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Service = {
  id: string;
  name: string;
  day: Weekday;
  start: string; // "HH:MM" 24h, Lagos time
  end: string;
  description: string;
  streamed: boolean;
};

// One Sunday service at 8:00am. Midweek services are in the evening.
// CONFIRM: midweek start/end times (6:00pm is a placeholder) and service names; Sunday end time.
export const services: Service[] = [
  {
    id: "sunday-service",
    name: "Sunday Service",
    day: 0,
    start: "08:00",
    end: "11:00",
    description: "Praise, worship, the Word and fellowship for the whole family.",
    streamed: true,
  },
  {
    id: "tuesday-service",
    name: "Tuesday Service",
    day: 2,
    start: "18:00",
    end: "19:30",
    description: "A midweek time in the Word with room for questions.",
    streamed: true,
  },
  {
    id: "thursday-service",
    name: "Thursday Service",
    day: 4,
    start: "18:00",
    end: "19:30",
    description: "Prayer, intercession and encouragement for the week.",
    streamed: true,
  },
];

export const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const navigation = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our story & beliefs", href: "/about", description: "Who we are and what we believe" },
      { label: "Leadership", href: "/about#leadership", description: "Meet our pastors" },
      { label: "Plan a visit", href: "/visit", description: "Times, location and what to expect" },
      { label: "Contact", href: "/contact", description: "Reach the church office" },
    ],
  },
  {
    label: "Watch",
    href: "/sermons",
    children: [
      { label: "Watch live", href: "/live", description: "Join our services online" },
      { label: "Sermon library", href: "/sermons", description: "Messages, series and notes" },
    ],
  },
  {
    label: "Connect",
    href: "/connect",
    children: [
      { label: "I'm new", href: "/connect", description: "Take your next step with us" },
      { label: "Ministries", href: "/ministries", description: "Find your place to serve and grow" },
      { label: "House fellowships", href: "/groups", description: "Church close to home" },
      { label: "Events", href: "/events", description: "What's coming up" },
      { label: "Prayer", href: "/prayer", description: "Request prayer · prayer wall" },
    ],
  },
  { label: "Events", href: "/events" },
  {
    label: "Give",
    href: "/give",
    children: [
      { label: "Give online", href: "/give", description: "Tithes, offerings and seeds" },
      { label: "Kingdom projects", href: "/projects", description: "Build with us for generations" },
    ],
  },
] as const;
