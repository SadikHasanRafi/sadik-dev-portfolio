export type NavItem = { label: string; href: string };

export type IconName =
  | "server"
  | "database"
  | "card"
  | "chip"
  | "code"
  | "rocket"
  | "shield"
  | "award"
  | "layers"
  | "terminal"
  | "repeat"
  | "key"
  | "message"
  | "check"
  | "arrow-right"
  | "arrow-down"
  | "download"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "github"
  | "linkedin"
  | "whatsapp"
  | "x"
  | "facebook"
  | "instagram"
  | "youtube"
  | "globe"
  | "search"
  | "rss"
  | "copy"
  | "external"
  | "sun"
  | "moon"
  | "heart"
  | "star"
  | "users"
  | "briefcase"
  | "book"
  | "zap"
  | "target"
  | "smile"
  | "cart";

export type ImageAsset = { src: string; width: number; height: number; alt: string };
export type FileAsset = { src: string; name: string };

export type Stat = { icon: IconName; value: string; label: string; visible?: boolean };

export type SocialLink = { label: string; handle: string; href: string; icon: IconName; visible?: boolean };

export type ProjectCategory = string;

/**
 * Coded "screen" shown on project cards. `items` depends on `kind`:
 * terminal → [highlighted line], metrics → ["Label: Value", …],
 * pipeline → [step, …], bars → ["3", "5", …] (numbers).
 */
export type ProjectPreview = {
  kind: "terminal" | "metrics" | "pipeline" | "bars";
  header: string;
  status: string;
  items: string[];
  caption: string;
};

export type Project = {
  slug: string;
  name: string;
  /** Short tagline for cards, e.g. "Retail POS & Inventory" */
  category: string;
  categories: ProjectCategory[];
  eyebrow: [string, string];
  title: { lead: string; accent: string; tail?: string };
  summary: string;
  challenge: { label: string; body: string };
  highlights: string[];
  outcomes: { value: string; label: string; note: string }[];
  stack: string[];
  preview: ProjectPreview;
  /** Optional screenshot that replaces the coded preview */
  image?: ImageAsset | null;
  link?: { label: string; href: string };
  status: string;
  visible?: boolean;
};

export type Service = {
  slug: string;
  icon: IconName;
  short: string;
  shortBody: string;
  tag: string;
  meta: string;
  title: string;
  body: string;
  deliverables: string[];
  stack: string[];
  visible?: boolean;
};

export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  context: string;
  summary: string;
  points: string[];
  stack: string[];
  visible?: boolean;
};

/** Blog article body is a list of typed blocks so posts stay plain data. */
export type PostBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; file: string; lang: "ts" | "sql" | "bash"; code: string }
  | { type: "callout"; tone: "warning" | "note"; label: string; text: string }
  | { type: "steps"; caption: string; steps: { title: string; detail: string }[] };

export type PostSection = { id: string; kicker: string; title: string; blocks: PostBlock[] };

export type PostTopic = string;

export type Post = {
  slug: string;
  title: { lead: string; accent: string };
  excerpt: string;
  topic: PostTopic;
  topicLabel: string;
  date: string;
  readMinutes: number;
  tags: string[];
  /** Mini visual on the card */
  plate: { kind: "code" | "flow" | "terminal" | "compare"; label: string; lines: string[] };
  sections: PostSection[];
  takeaway: string;
  checklist: { title: string; detail: string }[];
  stack: string[];
  visible?: boolean;
};

export * from "./content";
