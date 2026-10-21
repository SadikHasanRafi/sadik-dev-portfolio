import type {
  ExperienceItem,
  FileAsset,
  IconName,
  ImageAsset,
  Post,
  Project,
  Service,
  SocialLink,
  Stat,
} from "./index";

/**
 * The whole editable site in one document. The dashboard edits this object;
 * every public page renders from it. Defaults live in src/content/defaults.ts.
 */

export const themeTokens = [
  "bg",
  "strip",
  "paper",
  "ink",
  "onInk",
  "muted",
  "line",
  "violet",
  "violetInk",
  "lavender",
  "lavender2",
  "lavenderDeep",
  "night",
  "night2",
  "night3",
  "nightMuted",
  "nightLine",
  "alert",
  "ok",
] as const;
export type ThemeToken = (typeof themeTokens)[number];
export type ThemePalette = Record<ThemeToken, string>;

export type PageKey = "about" | "work" | "services" | "blog" | "contact";
export type NavId = "home" | PageKey;
export type HomeSectionId = "hero" | "services" | "projects" | "about" | "faq" | "cta";

export type LinkCta = { label: string; href: string };
export type Seo = { title: string; description: string };
export type Intro = { eyebrow: string; lines: string[]; accent: string; lead: string };
export type SectionHead = { eyebrow: string; title: string; aside: string };

export type Banner = {
  visible: boolean;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  button: LinkCta;
  secondary: LinkCta & { visible: boolean };
};

export type FaqItem = { q: string; a: string; visible: boolean };
export type Faq = SectionHead & { items: FaqItem[] };

export type ToolGroup = { index: string; icon: IconName; title: string; body: string; tools: string[]; accent: string };
export type Principle = { rule: string; icon: IconName; title: string; body: string };
export type CoreValue = { icon: IconName; kicker: string; title: string; body: string };
export type ProcessStep = { phase: string; title: string; body: string; deliverable: string };
export type Engagement = { kicker: string; title: string; body: string; points: string[]; commitment: string; visible: boolean };

export type SiteContent = {
  version: number;
  identity: {
    name: string;
    shortName: string;
    initials: string;
    role: string;
    description: string;
    /** Replaces the monogram square in the header and footer */
    logo: ImageAsset | null;
    favicon: ImageAsset | null;
  };
  theme: {
    defaultMode: "system" | "light" | "dark";
    allowToggle: boolean;
    light: ThemePalette;
    dark: ThemePalette;
  };
  navigation: {
    items: { id: NavId; label: string }[];
    pages: Record<PageKey, boolean>;
    cta: { label: string; visible: boolean };
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    city: string;
    timezone: string;
    utc: string;
  };
  socials: SocialLink[];
  media: { portrait: ImageAsset; desk: ImageAsset; ogImage: ImageAsset; cv: FileAsset };
  home: {
    seo: Seo;
    sections: { id: HomeSectionId; visible: boolean }[];
    hero: {
      greeting: string;
      lines: string[];
      accent: string;
      description: string;
      primary: LinkCta;
      secondary: LinkCta;
      scrollLabel: string;
      showBadge: boolean;
      badge: string;
    };
    projects: SectionHead & { viewAllLabel: string; limit: number };
    about: {
      eyebrow: string;
      title: string;
      accent: string;
      body: string;
      signature: string;
      cvLabel: string;
      more: LinkCta;
    };
    stats: Stat[];
    faq: Faq;
    cta: Banner;
  };
  about: {
    seo: Seo;
    intro: { eyebrow: string; lines: string[]; accent: string };
    portraitAlt: string;
    availability: { visible: boolean; label: string; value: string };
    background: { label: string; lead: string; body: string };
    thesis: { label: string; quote: string; body: string };
    buttons: { cv: string; work: LinkCta };
    tools: SectionHead & { groups: ToolGroup[]; integrationsLabel: string; integrations: string[] };
    experience: SectionHead & { stackLabel: string; items: ExperienceItem[] };
    principles: SectionHead & { items: Principle[] };
    achievements: { visible: boolean; eyebrow: string; title: string; items: string[] };
    education: {
      visible: boolean;
      eyebrow: string;
      title: string;
      degree: string;
      school: string;
      detail: string;
      coursesLabel: string;
      courses: string[];
    };
    cta: Banner;
  };
  work: {
    seo: Seo;
    intro: Intro;
    allLabel: string;
    filters: { id: string; label: string }[];
    projects: Project[];
    values: SectionHead & { visible: boolean; items: CoreValue[] };
    cta: Banner;
  };
  services: {
    seo: Seo;
    intro: Intro;
    list: SectionHead & { deliverablesLabel: string; stackLabel: string };
    items: Service[];
    philosophy: { visible: boolean; title: string; body: string };
    process: SectionHead & { visible: boolean; steps: ProcessStep[] };
    engagements: SectionHead & { visible: boolean; items: Engagement[] };
    cta: Banner;
  };
  blog: {
    seo: Seo;
    intro: Intro;
    latestLabel: string;
    readLabel: string;
    index: SectionHead;
    allLabel: string;
    searchPlaceholder: string;
    emptyText: string;
    topics: { id: string; label: string }[];
    follow: { visible: boolean; eyebrow: string; title: string; body: string; rssLabel: string; linkedinLabel: string };
    posts: Post[];
    article: {
      backLabel: string;
      tocLabel: string;
      stackLabel: string;
      takeawayLabel: string;
      checklistLabel: string;
      citationLabel: string;
      asideTitle: string;
      asideBody: string;
      asideButton: LinkCta;
      relatedTitle: string;
      relatedLink: string;
    };
    cta: Banner;
  };
  contactPage: {
    seo: Seo;
    intro: Intro;
    labels: {
      email: string;
      phone: string;
      whatsapp: string;
      based: string;
      localTime: string;
      reply: string;
      replyText: string;
      elsewhere: string;
    };
    cv: { visible: boolean; label: string; title: string };
    form: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      companyLabel: string;
      companyPlaceholder: string;
      areasLabel: string;
      areas: string[];
      timelineLabel: string;
      timelines: { title: string; body: string }[];
      briefLabel: string;
      briefPlaceholder: string;
      submitLabel: string;
      note: string;
      successText: string;
    };
    faq: Faq & { visible: boolean };
    fastTrack: { visible: boolean; title: string; body: string; whatsappLabel: string; callLabel: string };
  };
  talk: {
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    queryLabel: string;
    queryPlaceholder: string;
    submitLabel: string;
    successTitle: string;
    successBody: string;
  };
  footer: {
    statement: string;
    cvLabel: string;
    quickLinksLabel: string;
    servicesLabel: string;
    services: string[];
    contactLabel: string;
    followLabel: string;
    /** {year} and {name} are filled in automatically */
    copyright: string;
    tagline: string;
  };
};
