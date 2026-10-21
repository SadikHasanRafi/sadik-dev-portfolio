import type { ExperienceItem, IconName } from "@/types";

export const about = {
  title: ["Building the Invisible Engines", "That Let Businesses Grow"],
  accent: "with Confidence.",
  meta: [] as string[],
  background: {
    lead: "I'm a software engineer based in Dhaka who builds the backend side of business software — authentication, payments, accounting and the APIs that hold them together.",
    body: "Over 2.5+ years I've shipped enterprise portals at Celloscope and full ERP, POS and logistics systems for clients. I work with React, Next.js and Node.js on PostgreSQL and MySQL, and I'm hands-on with REST APIs, auth, debugging and AI-assisted development.",
  },
  thesis: {
    quote: "“Software should explain the business it runs — clearly enough that the owner understands it too.”",
    body: "I start by learning how a client's business actually operates, then turn it into working software and explain it in plain language. Strict schemas, honest permission boundaries and payment flows that survive retries matter more to me than clever code.",
  },
  availability: "Open to Projects",
};

export const toolGroups: { index: string; icon: IconName; title: string; body: string; tools: string[]; accent?: string }[] = [
  {
    index: "Languages",
    icon: "terminal",
    title: "Core Languages",
    body: "Strongly typed JavaScript on both sides of the wire, with solid web fundamentals underneath.",
    tools: ["TypeScript", "JavaScript", "HTML5", "CSS3", "SQL"],
    accent: "TypeScript",
  },
  {
    index: "Frameworks",
    icon: "layers",
    title: "Backend & Frontend",
    body: "Modular Node.js services and the frontends that consume them — React, Next.js and Angular.",
    tools: ["Node.js", "Express.js", "NestJS", "React", "Next.js", "Angular"],
    accent: "Node.js",
  },
  {
    index: "Storage",
    icon: "database",
    title: "Databases & ORM",
    body: "Relational first, document where it fits, with typed ORMs and real migrations.",
    tools: ["PostgreSQL", "MySQL", "MongoDB", "Prisma", "Drizzle", "Mongoose"],
    accent: "PostgreSQL",
  },
  {
    index: "Platform",
    icon: "server",
    title: "Real-time & DevOps",
    body: "Live updates, queues and the Linux tooling to deploy and keep systems running.",
    tools: ["Socket.IO", "WebSocket (STOMP)", "RabbitMQ", "Docker", "Linux / SSH", "Git"],
  },
];

export const integrations = ["bKash", "SSLCommerz", "Steadfast", "FCM", "Cloudinary", "JWT / bcrypt"];

export const experience: ExperienceItem[] = [
  {
    period: "Now",
    role: "Freelance Backend Developer",
    org: "Independent",
    context: "Retail, ERP & Logistics Clients",
    summary:
      "Building business systems directly with owners — currently a POS and shop management system for a footwear retailer, from the proposal and contract terms through to the code.",
    points: [
      "Integrated SSLCommerz plus bKash, card, cash and COD orders through the Steadfast courier API.",
      "Implemented admin / salesman role-based access, WhatsApp order notifications and a mini-CRM.",
    ],
    stack: ["Express", "TypeScript", "Prisma", "PostgreSQL", "React"],
  },
  {
    period: "Oct 2023 — Jul 2025",
    role: "Junior Software Engineer",
    org: "Celloscope",
    context: "Enterprise & Fintech Portals",
    summary:
      "Built authentication and authorization with JWT and role-based access control across enterprise portals including ABS Portal, Ampere Portal and SMS Alert, connecting REST APIs to server-side logic in an Angular, Spring Boot, RabbitMQ and PostgreSQL stack.",
    points: [
      "Built a Maker-Checker approval workflow (Create → Submit → Approve) for merchant account operations.",
      "Added real-time notifications over WebSocket (STOMP), audit trails and centralised error logging.",
      "Built PDF / CSV / Excel reporting and English–Bengali language support with Angular i18n.",
    ],
    stack: ["Angular", "Spring Boot", "RabbitMQ", "PostgreSQL", "STOMP"],
  },
  {
    period: "Apr 2023 — Oct 2023",
    role: "Software Engineer Intern",
    org: "Celloscope",
    context: "Enterprise Applications",
    summary:
      "Developed frontend features using Angular and TypeScript for enterprise applications and contributed to production systems including ABS Portal and Ampere Portal.",
    points: ["Collaborated with senior engineers in an Agile environment using Git / GitHub."],
    stack: ["Angular", "TypeScript", "Git"],
  },
];

export const principles: { rule: string; icon: IconName; title: string; body: string; footer: string }[] = [
  {
    rule: "01",
    icon: "repeat",
    title: "Replay-Safe Payments",
    body: "Gateways retry, networks drop and users double-click. Every payment callback checks what has already been settled before it writes, so a duplicate request never becomes a duplicate charge.",
    footer: "Idempotent Handlers",
  },
  {
    rule: "02",
    icon: "key",
    title: "Permissions Are Data",
    body: "Roles and access rules belong in the database, not hard-coded in routes. Changing who can approve, edit or view something should be a setting — not a redeploy.",
    footer: "Database-Driven RBAC",
  },
  {
    rule: "03",
    icon: "message",
    title: "Explain It Plainly",
    body: "A system the owner can't understand is a system they can't trust. I document decisions in plain language and walk clients through how their software actually works.",
    footer: "Clear Handover",
  },
];

export const recognition = {
  achievements: [
    "1st Place — University Business Idea Contest",
    "3rd Place — University Hackathon Competition",
    "Ranked 49th among 200+ participants in a Programming Contest",
  ],
  education: {
    degree: "B.Sc. in Computer Science and Engineering",
    school: "Daffodil International University",
    detail: "2019 — 2023 · CGPA 3.44",
  },
  courses: ["Complete Web Development — Jhankar Mahbub", "Learning & Earning Development Project (LEDP)"],
};
