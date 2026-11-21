import { photos, type Photo } from "./media";

export type Ministry = {
  slug: string;
  name: string;
  audience: string;
  short: string;
  description: string[];
  meets: string;
  image: Photo;
  roles: string[];
};

// CONFIRM: ministries and meeting times
export const ministries: Ministry[] = [
  {
    slug: "children",
    name: "Children's Church",
    audience: "Ages 0–12",
    short: "Safe, joyful and Bible-filled. Kids learn about Jesus at their level every Sunday.",
    description: [
      "Children's Church runs during the Sunday Service in age-appropriate classes: nursery, pre-school and juniors.",
      "Every teacher is trained and checked. Parents receive a pickup tag at check-in, and children are only released to the tag holder.",
    ],
    meets: "Sundays during service",
    image: photos.welcome,
    roles: ["Teacher", "Classroom helper", "Check-in desk", "Nursery care"],
  },
  {
    slug: "youth",
    name: "Youth & Young Adults",
    audience: "Ages 13–30",
    short: "A generation on fire for God — worship, real talk, mentoring and friendships that last.",
    description: [
      "Our youth church meets on Sundays and hosts monthly hangouts, retreats and outreaches.",
      "Young adults also meet for career and purpose mentoring with professionals in our church family.",
    ],
    meets: "Sundays · monthly hangouts",
    image: photos.arena,
    roles: ["Small group leader", "Media", "Events team", "Mentor"],
  },
  {
    slug: "choir",
    name: "Choir & Worship",
    audience: "Singers and musicians",
    short: "Lead the church into God's presence through music and song.",
    description: [
      "Our choir and band lead worship at every service. Rehearsals are held on Saturdays.",
      "New members take a short audition and orientation. Musicians are welcome too.",
    ],
    meets: "Rehearsals · Saturdays 4pm",
    image: photos.preacher,
    roles: ["Vocalist", "Instrumentalist", "Sound engineer"],
  },
  {
    slug: "welfare",
    name: "Welfare & Outreach",
    audience: "Everyone",
    short: "Love in motion — food drives, hospital visits and practical care across Abuja.",
    description: [
      "We support members and neighbours in need through food packs, school fees support, hospital and prison visits.",
      "Quarterly community outreaches bring health checks and relief to communities around Abuja.",
    ],
    meets: "Monthly · outreaches quarterly",
    image: photos.outreach,
    roles: ["Outreach volunteer", "Visitation", "Logistics", "Medical volunteer"],
  },
  {
    slug: "hospitality",
    name: "Hospitality & Ushering",
    audience: "Everyone",
    short: "Be the first smile people see. Welcome guests and make everyone feel at home.",
    description: [
      "Greeters, ushers and the first-timers team make sure every guest feels expected and cared for.",
    ],
    meets: "Sundays · rota basis",
    image: photos.welcome,
    roles: ["Greeter", "Usher", "First-timers host", "Parking steward"],
  },
  {
    slug: "media",
    name: "Media & Technical",
    audience: "Creatives and techies",
    short: "Cameras, livestream, sound, lights and design that carry the message further.",
    description: [
      "The media team runs our livestream, projection, photography and social media.",
      "No experience? We'll train you.",
    ],
    meets: "Sundays · Thursday training",
    image: photos.arena,
    roles: ["Camera", "Livestream", "Projection", "Photography", "Design"],
  },
  {
    slug: "men-and-women",
    name: "Men's & Women's Fellowship",
    audience: "Adults",
    short: "Brotherhood and sisterhood — prayer, accountability and growing together.",
    description: [
      "Good Women and Excellent Men's fellowships meet monthly for prayer, teaching and friendship.",
    ],
    meets: "Monthly · 2nd Saturday",
    image: photos.serve,
    roles: ["Prayer partner", "Events", "Mentoring"],
  },
  {
    slug: "prayer-team",
    name: "Prayer & Intercession",
    audience: "Everyone",
    short: "Stand in the gap for our church, city and nation. Every prayer request is prayed over.",
    description: [
      "The intercessory team prays before every service and over every prayer request submitted to the church.",
    ],
    meets: "Before services · Thursdays",
    image: photos.worship,
    roles: ["Intercessor", "Prayer line volunteer"],
  },
];

export function getMinistry(slug: string) {
  return ministries.find((m) => m.slug === slug);
}

export type Fellowship = {
  id: string;
  name: string;
  area: string;
  day: string;
  time: string;
  host: string;
  kind: "Mixed" | "Young adults" | "Couples" | "Women" | "Men";
};

// CONFIRM: house fellowship centres. Hosts' exact addresses are shared only after a join request.
export const fellowships: Fellowship[] = [
  { id: "wuse-2", name: "Wuse II Centre", area: "Wuse II", day: "Wednesday", time: "6:30pm", host: "Bro. & Sis. Okon", kind: "Mixed" },
  { id: "gwarinpa", name: "Gwarinpa Estate Centre", area: "Gwarinpa", day: "Wednesday", time: "6:30pm", host: "Deacon Bello", kind: "Mixed" },
  { id: "lugbe", name: "Lugbe Centre", area: "Lugbe", day: "Thursday", time: "7:00pm", host: "Sis. Amaka", kind: "Mixed" },
  { id: "maitama", name: "Maitama Young Pros", area: "Maitama", day: "Friday", time: "7:00pm", host: "Bro. Femi", kind: "Young adults" },
  { id: "kubwa", name: "Kubwa Centre", area: "Kubwa", day: "Wednesday", time: "6:00pm", host: "Pastor & Mrs Eze", kind: "Mixed" },
  { id: "jabi", name: "Jabi Couples", area: "Jabi", day: "Saturday", time: "5:00pm", host: "Mr & Mrs Lawal", kind: "Couples" },
  { id: "garki", name: "Garki Centre", area: "Garki", day: "Thursday", time: "6:30pm", host: "Deaconess Uche", kind: "Mixed" },
  { id: "life-camp", name: "Life Camp Women", area: "Life Camp", day: "Tuesday", time: "10:00am", host: "Sis. Hauwa", kind: "Women" },
  { id: "apo", name: "Apo Centre", area: "Apo", day: "Wednesday", time: "6:30pm", host: "Bro. Musa", kind: "Mixed" },
];

export const fellowshipAreas = [...new Set(fellowships.map((f) => f.area))].sort();

export type Leader = { name: string; role: string; bio: string; image?: Photo; initials: string };

// CONFIRM: leadership names, roles and photos
export const leaders: Leader[] = [
  {
    name: "Pastor Daniel Adeyemi",
    role: "Parish Pastor",
    bio: "Pastor Daniel has served in ministry for over fifteen years and is passionate about teaching the Word plainly and raising disciples.",
    image: photos.preacher,
    initials: "DA",
  },
  {
    name: "Pastor Grace Adeyemi",
    role: "Associate Pastor · Women & Family",
    bio: "Pastor Grace leads our family and women's ministries and loves to see homes built on Christ.",
    initials: "GA",
  },
  {
    name: "Minister Tobi Okafor",
    role: "Youth Pastor",
    bio: "Tobi champions the next generation — worship, mentoring and real conversations about faith and purpose.",
    initials: "TO",
  },
  {
    name: "Deaconess Uche Nwosu",
    role: "Head of Welfare",
    bio: "Uche coordinates our care, welfare and outreach teams across the city.",
    initials: "UN",
  },
];

export const beliefs = [
  { title: "The Bible", text: "We believe the Bible is the inspired, infallible Word of God and our final authority for faith and life." },
  { title: "One God", text: "We believe in one God, eternally existing as Father, Son and Holy Spirit." },
  { title: "Jesus Christ", text: "We believe Jesus is the Son of God, born of a virgin, who died for our sins, rose again and is coming back." },
  { title: "Salvation", text: "We believe salvation is by grace through faith in Jesus Christ alone, and that everyone can be born again." },
  { title: "The Holy Spirit", text: "We believe in the baptism of the Holy Spirit and in the gifts of the Spirit at work in the church today." },
  { title: "Holiness", text: "We believe God calls His people to a life of holiness, love and service, empowered by His grace." },
];

export const faqs = [
  { q: "What time should I arrive?", a: "Aim for 15 minutes before service starts. It gives you time to park, check your children in and grab a seat without rushing." },
  { q: "What should I wear?", a: "Come as you are. You'll see everything from traditional attire to jeans. What matters most is that you're here." },
  { q: "What about my children?", a: "Children's Church runs during the Sunday service for ages 0–12 with trained, checked teachers. Check-in is at the Kids desk by the main entrance." },
  { q: "What time does service start?", a: "Our Sunday Service starts at 8:00am — praise, worship, the Word and prayer. We also meet on Tuesday and Thursday evenings." },
  { q: "Where exactly are you?", a: "We meet at one location in Utako, Abuja. Search the Plus Code 3C2F+85G in Google Maps, or tap Get directions on this page." },
  { q: "Will I be asked to stand up or give?", a: "No pressure. We'll warmly welcome first-time guests, but you'll never be singled out, and giving is for those who call this church home." },
];
