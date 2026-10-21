import type { PageKey } from "@/types";

export type SectionDef = {
  id: string;
  group: "Site" | "Pages" | "Data";
  title: string;
  description: string;
  /** Top-level content keys edited by the generic form */
  roots?: string[];
  custom?: "theme" | "nav" | "backup";
  /** Panel opened by default (path like "work.projects"); otherwise the first one */
  open?: string;
  /** Public page to open from the toolbar */
  href?: string;
  page?: PageKey;
};

export const sections: SectionDef[] = [
  { id: "profile", group: "Site", title: "Profile & contact", description: "Your name, role, logo and how people reach you.", roots: ["identity", "contact"], href: "/" },
  { id: "appearance", group: "Site", title: "Theme & colours", description: "Light and dark palettes, accent presets and the theme switch.", custom: "theme", href: "/" },
  { id: "navigation", group: "Site", title: "Menu & pages", description: "Menu order, which pages are live, and the header button.", custom: "nav", href: "/" },
  { id: "media", group: "Site", title: "Images & files", description: "Portrait, desk photo, link preview image and your CV.", roots: ["media"], href: "/" },
  { id: "socials", group: "Site", title: "Social links", description: "Shown in the footer and on the contact page.", roots: ["socials"], href: "/contact/" },
  { id: "popup", group: "Site", title: "“Let’s Talk” popup", description: "The short form that opens from the header button.", roots: ["talk"], href: "/" },
  { id: "footer", group: "Site", title: "Footer", description: "Statement, services list, labels and the copyright line.", roots: ["footer"], href: "/" },
  { id: "home", open: "home.sections", group: "Pages", title: "Home", description: "Section order, hero, projects, stats, FAQ and the closing banner.", roots: ["home"], href: "/" },
  { id: "about", open: "about.intro", group: "Pages", title: "About", description: "Story, skills, experience, principles and education.", roots: ["about"], href: "/about/", page: "about" },
  { id: "work", open: "work.projects", group: "Pages", title: "Work & projects", description: "Projects, their previews, filters and the page text.", roots: ["work"], href: "/work/", page: "work" },
  { id: "services", open: "services.items", group: "Pages", title: "Services", description: "What you offer, your process and ways to work together.", roots: ["services"], href: "/services/", page: "services" },
  { id: "blog", open: "blog.posts", group: "Pages", title: "Blog", description: "Posts, topics and the labels around them.", roots: ["blog"], href: "/blog/", page: "blog" },
  { id: "contact", open: "contactPage.intro", group: "Pages", title: "Contact page", description: "Contact card, project form, FAQ and the quick-chat band.", roots: ["contactPage"], href: "/contact/", page: "contact" },
  { id: "backup", group: "Data", title: "Backup & reset", description: "Download or load a backup, or go back to the original content.", custom: "backup" },
];

/** Titles for the first "general" panel of each root. */
export const rootTitles: Record<string, string> = {
  identity: "Profile",
  contact: "Contact details",
  media: "Images & files",
  socials: "Social links",
  talk: "Popup text",
  footer: "Footer text",
  home: "General",
  about: "General",
  work: "General",
  services: "General",
  blog: "General",
  contactPage: "General",
};
