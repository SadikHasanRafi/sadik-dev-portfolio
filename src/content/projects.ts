import type { Project, ProjectCategory } from "@/types";

/**
 * Case studies. Order here = order on the site.
 * Outcomes are facts from the build (counts, scope) — keep them honest.
 */
export const projects: Project[] = [
  {
    slug: "liguni-pos",
    name: "Liguni POS",
    category: "Retail POS & Inventory",
    categories: ["pos", "payments"],
    eyebrow: ["Retail POS Server", "Footwear Retailer"],
    title: { lead: "Liguni POS", accent: "Variant-Aware", tail: " Retail & Checkout" },
    summary:
      "A point-of-sale and shop management system for a footwear retailer. Every shoe exists in many sizes and colours, so inventory is tracked per variant with generated barcodes and printed receipts — and online orders flow through the same stock ledger as walk-in sales.",
    challenge: {
      label: "The challenge",
      body: "One order can be paid by SSLCommerz, bKash, card, cash or cash-on-delivery, and COD orders must be booked with the Steadfast courier. Payment and delivery state had to stay consistent with stock across every path.",
    },
    highlights: [
      "Variant-based inventory with barcode generation and receipt printing",
      "SSLCommerz, bKash, card, cash and COD through one order pipeline",
      "Steadfast courier API booking for delivery orders",
      "Admin / salesman role-based access, WhatsApp order alerts and a mini-CRM",
    ],
    outcomes: [
      { value: "5", label: "Payment Methods", note: "One unified order flow" },
      { value: "1:1", label: "Owner Collaboration", note: "Proposal & contract written by me" },
    ],
    stack: ["React", "TanStack Query", "Express", "TypeScript", "Prisma", "PostgreSQL"],
    preview: { kind: "terminal", header: "POS Terminal / Live", status: "live", items: ["INV-0982 • ৳ 4,250 • bKash"], caption: "" },
    link: { label: "", href: "" },
    status: "In Progress",
    visible: true,
    image: null,
  },
  {
    slug: "village-agro-farm",
    name: "Village Agro Farm",
    category: "ERP & Accounting",
    categories: ["pos", "payments"],
    eyebrow: ["Agricultural ERP", "Accounting System"],
    title: { lead: "Village Agro Farm", accent: "Double-Entry", tail: " Farm ERP" },
    summary:
      "An ERP that merges farm operations, money management and accounting, sold as a subscription. I built the accounting core — invoices, bills, general ledger, trial balance, balance sheet, tax summary and bank reconciliation — plus the billing that keeps subscriptions alive.",
    challenge: {
      label: "The tricky part",
      body: "bKash Tokenized Checkout needs a grant-token lifecycle, agreement creation and payment execution, with webhooks that can arrive late or twice. Handlers were written to be safe to replay so a retry never double-bills a farm.",
    },
    highlights: [
      "Seven accounting modules from invoices to bank reconciliation",
      "Subscription billing on bKash Tokenized Checkout with webhook handlers",
      "Normalised schema, seed data and a full ORM migration from Prisma to Drizzle",
      "PDF, CSV and Excel exports; React screens for billing, projects and settings",
    ],
    outcomes: [
      { value: "7", label: "Accounting Modules", note: "Invoices → reconciliation" },
      { value: "100%", label: "ORM Migrated", note: "Prisma → Drizzle, full codebase" },
    ],
    stack: ["React", "TypeScript", "Express", "Drizzle ORM", "MySQL", "bKash"],
    preview: { kind: "metrics", header: "Agro ERP / Ledger", status: "v2.4", items: ["Trial Balance: Balanced", "Subscription: Active"], caption: "" },
    link: { label: "", href: "" },
    status: "Subscription SaaS",
    visible: true,
    image: null,
  },
  {
    slug: "e-china",
    name: "E-China",
    category: "Logistics & Import Platform",
    categories: ["platforms"],
    eyebrow: ["Import Logistics", "Procurement Platform"],
    title: { lead: "E-China", accent: "Import Pipeline", tail: " From Sourcing to Delivery" },
    summary:
      "A full-stack system that manages product sourcing from China, import logistics to Bangladesh and local sales. Procurement, inventory and sales are modelled as one connected lifecycle — from order creation to import tracking and final delivery.",
    challenge: {
      label: "Who sees what",
      body: "Suppliers, admins and sales staff share one platform but must never see each other's data. JWT authentication with RBAC enforces permission boundaries on every route, and typed API contracts keep frontend and backend in agreement.",
    },
    highlights: [
      "JWT authentication with RBAC across supplier, admin and sales roles",
      "REST APIs and PostgreSQL models with Prisma for procurement, inventory and sales",
      "Typed API contracts between frontend and backend for consistent data",
      "Operational dashboard in Next.js and shadcn/ui for pipelines and procurement status",
    ],
    outcomes: [
      { value: "3", label: "Role Boundaries", note: "Supplier · Admin · Sales" },
      { value: "E2E", label: "Procurement Lifecycle", note: "Order → import → delivery" },
    ],
    stack: ["Next.js", "TypeScript", "Redux", "Node.js", "Express", "Prisma", "PostgreSQL"],
    preview: { kind: "pipeline", header: "Import Pipeline", status: "Live", items: ["Sourcing", "Shipping", "Customs", "Delivered"], caption: "" },
    link: { label: "echinaexpress.com", href: "https://echinaexpress.com/" },
    status: "Live",
    visible: true,
    image: null,
  },
  {
    slug: "pink-life-line",
    name: "Pink Life Line",
    category: "Health Tracking Platform",
    categories: ["platforms"],
    eyebrow: ["Women's Health Platform", "Modular Backend"],
    title: { lead: "Pink Life Line", accent: "Permission-Driven", tail: " Health Platform" },
    summary:
      "A modular Express and MongoDB backend for a women's health platform that combines period tracking, doctor tele-consultation booking, community forums and self-assessment tools in one system.",
    challenge: {
      label: "Access rules",
      body: "Admin permissions are stored in the database and resolved per route at runtime, so access rules change without a redeploy. Doctor scheduling supports recurring weekly availability, holiday overrides and slot-capacity limits.",
    },
    highlights: [
      "Dynamic, database-driven RBAC per admin role — no redeploy to change access",
      "Doctor scheduling with recurring availability, holidays and slot capacity",
      "FCM notifications with a cron scheduler for predicted-cycle reminders",
      "Reddit-style community with nested comments, voting, saves and moderation",
    ],
    outcomes: [
      { value: "4", label: "Modules, One System", note: "Tracking · Care · Forum · Tests" },
      { value: "0", label: "Redeploys for Access Rules", note: "Permissions live in the DB" },
    ],
    stack: ["Node.js", "Express", "MongoDB", "Mongoose", "FCM", "Cloudinary", "JWT"],
    preview: { kind: "bars", header: "Bookings / Weekly", status: "FCM On", items: ["3", "5", "8", "4", "6"], caption: "Slots booked:" },
    link: { label: "pinklifeline.com", href: "https://adminpannel.pinklifeline.com/" },
    status: "Live",
    visible: true,
    image: null,
  },
];

export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "pos", label: "ERP & POS" },
  { id: "payments", label: "Payments & Billing" },
  { id: "platforms", label: "Multi-Role Platforms" },
];

export const coreValues = [
  {
    icon: "database" as const,
    kicker: "Data",
    title: "Well-shaped databases",
    body: "Normalised relational cores, clear foreign keys and seed data from day one. When a schema stops fitting, I migrate it properly — like moving a live ERP from Prisma to Drizzle.",
    footer: "Normalisation // Typed ORM Models",
  },
  {
    icon: "key" as const,
    kicker: "Security",
    title: "Clear access rules",
    body: "JWT sessions, bcrypt hashing and role-based access control on every route. Suppliers, salesmen, doctors and admins each see exactly what they should — nothing more.",
    footer: "JWT // RBAC // Audit Trails",
  },
  {
    icon: "repeat" as const,
    kicker: "Payments",
    title: "Payments that survive retries",
    body: "Payment gateways retry. Handlers check what has already been settled before writing anything, so a duplicate callback never turns into a duplicate charge or a ghost order.",
    footer: "Idempotent Handlers // Safe Replays",
  },
];
