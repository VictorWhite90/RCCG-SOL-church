import { photos, type Photo } from "./media";

export type Sermon = {
  slug: string;
  title: string;
  series: string;
  speaker: string;
  date: string; // ISO date
  scripture: string;
  duration: string;
  summary: string;
  image: Photo;
  /** YouTube video ID. When empty the player links to the channel instead. */
  youtubeId?: string;
  audioUrl?: string;
  points: string[];
  reflection: string[];
};

export type Series = { slug: string; title: string; description: string; image: Photo };

// CONFIRM: sample sermons. Replace with the church's real messages and video IDs.
export const series: Series[] = [
  {
    slug: "rooted",
    title: "Rooted",
    description: "Growing deep in Christ so we can stand strong in every season.",
    image: photos.preacher,
  },
  {
    slug: "the-prayer-life",
    title: "The Prayer Life",
    description: "Learning to pray like Jesus — honestly, boldly and with expectation.",
    image: photos.worship,
  },
  {
    slug: "love-in-motion",
    title: "Love in Motion",
    description: "Faith that shows up for our families, our city and our nation.",
    image: photos.outreach,
  },
];

export const sermons: Sermon[] = [
  {
    slug: "planted-by-the-waters",
    title: "Planted by the Waters",
    series: "rooted",
    speaker: "Pastor Daniel Adeyemi",
    date: "2026-11-15",
    scripture: "Jeremiah 17:7–8",
    duration: "48 min",
    summary:
      "A tree planted by the water does not fear the heat. What it means to draw life from God when circumstances are dry.",
    image: photos.preacher,
    points: [
      "Trust is a location, not a feeling — where are your roots?",
      "Drought reveals what roots have been doing in secret.",
      "Fruitfulness is the natural overflow of a well-watered life.",
    ],
    reflection: [
      "Where have you been drawing life from this season?",
      "What one daily habit would put your roots nearer the water?",
    ],
  },
  {
    slug: "deep-roots-strong-faith",
    title: "Deep Roots, Strong Faith",
    series: "rooted",
    speaker: "Pastor Grace Adeyemi",
    date: "2026-11-08",
    scripture: "Colossians 2:6–7",
    duration: "42 min",
    summary:
      "We received Christ — now we walk in Him. How to keep growing after the first season of faith.",
    image: photos.arena,
    points: [
      "Received, rooted, built up, established — the four stages of growth.",
      "Thankfulness is the evidence of a rooted heart.",
      "Community is the soil God uses to grow us.",
    ],
    reflection: [
      "Which stage of growth describes you right now?",
      "Who is walking alongside you in your faith?",
    ],
  },
  {
    slug: "the-god-who-answers",
    title: "The God Who Answers",
    series: "the-prayer-life",
    speaker: "Pastor Daniel Adeyemi",
    date: "2026-11-01",
    scripture: "1 Kings 18:36–39",
    duration: "51 min",
    summary:
      "Elijah's prayer on Mount Carmel was simple, short and backed by obedience. Fire still falls on prepared altars.",
    image: photos.worship,
    points: [
      "Repair the altar before you ask for fire.",
      "Prayer is relationship before it is request.",
      "God answers so that people will know He is God.",
    ],
    reflection: [
      "What altar in your life needs repairing?",
      "Write down one prayer you are trusting God to answer this month.",
    ],
  },
  {
    slug: "teach-us-to-pray",
    title: "Lord, Teach Us to Pray",
    series: "the-prayer-life",
    speaker: "Minister Tobi Okafor",
    date: "2026-10-25",
    scripture: "Luke 11:1–13",
    duration: "39 min",
    summary:
      "The disciples never asked Jesus to teach them to preach — they asked Him to teach them to pray.",
    image: photos.welcome,
    points: [
      "The Lord's Prayer is a pattern, not just a recital.",
      "Persistence is not convincing God — it is trusting Him.",
      "The Father gives the Holy Spirit to those who ask.",
    ],
    reflection: [
      "Pray through the Lord's Prayer slowly, one line at a time.",
      "Where do you need persistence in prayer?",
    ],
  },
  {
    slug: "neighbours",
    title: "Who Is My Neighbour?",
    series: "love-in-motion",
    speaker: "Pastor Grace Adeyemi",
    date: "2026-10-18",
    scripture: "Luke 10:25–37",
    duration: "44 min",
    summary:
      "The Good Samaritan crossed the road. Love in motion means interruptions become invitations.",
    image: photos.serve,
    points: [
      "Compassion sees, stops and stays.",
      "Love is costly — and worth it.",
      "Our city is our parish.",
    ],
    reflection: [
      "Who has God placed on your road this week?",
      "What would it cost you to cross the road for them?",
    ],
  },
  {
    slug: "faith-that-works",
    title: "Faith That Works",
    series: "love-in-motion",
    speaker: "Pastor Daniel Adeyemi",
    date: "2026-10-11",
    scripture: "James 2:14–26",
    duration: "46 min",
    summary:
      "Faith and works are not rivals; they are partners. Real belief always becomes visible.",
    image: photos.outreach,
    points: [
      "Saving faith is living faith.",
      "Abraham and Rahab: two very different people, one kind of faith.",
      "Small acts of obedience are big acts of faith.",
    ],
    reflection: [
      "Where is your faith ready to move into action?",
      "Choose one practical act of love to do before next Sunday.",
    ],
  },
];

export const speakers = [...new Set(sermons.map((s) => s.speaker))];

export function getSermon(slug: string) {
  return sermons.find((s) => s.slug === slug);
}

export function getSeries(slug: string) {
  return series.find((s) => s.slug === slug);
}
