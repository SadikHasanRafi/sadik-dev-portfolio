import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "api",
    icon: "server",
    short: "API & Backend Dev",
    shortBody: "Scalable Node.js, Express & TypeScript APIs built clean and secure.",
    tag: "01",
    meta: "Typed Contracts",
    title: "APIs & backend",
    body: "Clean, modular REST APIs designed around how your business actually works. Strong typing end to end, clear error responses and authentication that is built in from the first route — not bolted on later.",
    deliverables: [
      "Documented REST endpoints with typed request / response contracts",
      "JWT authentication, bcrypt hashing and role-based access control",
      "Audit trails and centralised error logging for easy debugging",
      "Real-time updates with Socket.IO, WebSocket (STOMP) or RabbitMQ",
    ],
    stack: ["Node.js", "Express", "NestJS", "TypeScript", "Socket.IO"],
  },
  {
    slug: "erp-pos",
    icon: "database",
    short: "ERP / POS Systems",
    shortBody: "Inventory, accounting and billing systems for real shops and businesses.",
    tag: "02",
    meta: "Double-Entry Ledgers",
    title: "ERP, POS & inventory systems",
    body: "Transactional backends for retail and operations — variant-level inventory, barcode and receipt flows, and accounting modules where every invoice, bill and ledger entry adds up and is ready for an audit.",
    deliverables: [
      "Invoices, bills, general ledger, trial balance and balance sheet",
      "Variant-based inventory with barcode generation and receipt printing",
      "Maker-checker approval workflows (create → submit → approve)",
      "PDF, CSV and Excel exports for reports and reconciliation",
    ],
    stack: ["PostgreSQL", "MySQL", "Prisma", "Drizzle", "React"],
  },
  {
    slug: "payments",
    icon: "card",
    short: "Payment Integration",
    shortBody: "bKash, SSLCommerz and subscription billing flows done right.",
    tag: "03",
    meta: "Replay-Safe Webhooks",
    title: "Payments & billing",
    body: "Local payment integrations that hold up in production: bKash Tokenized Checkout, SSLCommerz, card, cash and cash-on-delivery — with courier booking and webhooks that stay correct when a gateway retries.",
    deliverables: [
      "bKash Tokenized Checkout: grant tokens, agreements and payments",
      "SSLCommerz checkout with server-side validation",
      "Recurring subscription billing with replay-safe webhook handlers",
      "Steadfast courier booking and WhatsApp / FCM order notifications",
    ],
    stack: ["bKash", "SSLCommerz", "Steadfast", "Webhooks", "FCM"],
  },
  {
    slug: "ai",
    icon: "chip",
    short: "AI & LLM Integration",
    shortBody: "Streaming chat, RAG and smart automation powered by LLMs.",
    tag: "04",
    meta: "Claude · GPT · Gemini",
    title: "AI & automation",
    body: "Practical AI features wired into the backend you already have: streaming chat, answers grounded in your own documents, and automations that take repetitive operations off your team's plate.",
    deliverables: [
      "Streaming chat responses over Server-Sent Events",
      "Retrieval-augmented answers over your business documents",
      "LLM-powered automations for reports, replies and data entry",
      "Provider-agnostic gateway across Claude, GPT and Gemini",
    ],
    stack: ["Node.js", "Claude", "GPT", "Gemini", "PostgreSQL"],
  },
];

export const process = [
  {
    phase: "Step 1",
    title: "Understand the business",
    body: "I learn how the business actually runs — roles, approvals, money flow — and turn it into entities, relationships and clear data rules before writing code.",
    deliverable: "You get: Schema & Flow Notes",
  },
  {
    phase: "Step 2",
    title: "Build the core",
    body: "Services, migrations, auth and the core business logic, validated against real seeded data instead of mocked payloads.",
    deliverable: "You get: Working Staging API",
  },
  {
    phase: "Step 3",
    title: "Connect & test",
    body: "Payment gateways, couriers and notifications wired in, then edge cases, retries, permissions and slow queries checked one by one.",
    deliverable: "You get: Tested Integrations",
  },
  {
    phase: "Step 4",
    title: "Launch & hand over",
    body: "Deployment on Linux with Docker, documentation written in plain language, and a walkthrough so your team knows exactly how it works.",
    deliverable: "You get: Live System & Docs",
  },
];

export const engagements = [
  {
    kicker: "Fixed project",
    title: "A defined build",
    body: "Defined scope, milestones and deliverables. Ideal for a new ERP or POS backend, a rebuild of a fragile system, or adding a payment gateway.",
    points: ["Clear milestones & deliverables", "Code handoff with documentation", "Post-launch bug-fix support"],
    commitment: "Milestone-based",
    featured: false,
  },
  {
    kicker: "Ongoing support",
    title: "Monthly support",
    body: "Ongoing care for a system that's already running: fixes, small features, query tuning and dependency updates, with a direct line to me.",
    points: ["Direct WhatsApp / email channel", "Regular performance check-ins", "Security & dependency updates"],
    commitment: "Monthly hours",
    featured: false,
  },
  {
    kicker: "Join your team",
    title: "One module, end to end",
    body: "I join your team to own one well-defined module end to end — auth, billing, reporting or real-time notifications.",
    points: ["Works within your Git & review flow", "Follows your existing conventions", "Fast start on familiar stacks"],
    commitment: "Part-time or full-time",
    featured: false,
  },
];
