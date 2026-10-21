import type { NavItem, SocialLink, Stat } from "@/types";

/**
 * ALL SITE-WIDE TEXT LIVES HERE.
 * Edit this file to change copy, links, stats and contact info.
 */
export const site = {
  name: "Sadik Hasan Rafi",
  shortName: "Rafi",
  initials: "SR",
  role: "Backend Developer",
  /** Set NEXT_PUBLIC_SITE_URL at build time to your real domain (used for SEO tags). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Sadik Hasan Rafi is a Node.js & TypeScript backend developer from Dhaka building secure APIs, payment flows, ERP and POS systems for real businesses.",
  cv: "/Sadik-Hasan-Rafi-Resume.pdf",

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
    { label: "Work", href: "/work/" },
    { label: "Services", href: "/services/" },
    { label: "Blog", href: "/blog/" },
    { label: "Contact", href: "/contact/" },
  ] satisfies NavItem[],

  contact: {
    email: "sadikk.hasan@gmail.com",
    phone: "+880 1533 632470",
    phoneHref: "tel:+8801533632470",
    whatsapp: "https://wa.me/8801533632470",
    location: "Mohammadpur, Dhaka, Bangladesh",
    city: "Dhaka, Bangladesh",
    timezone: "Asia/Dhaka",
    utc: "UTC +6",
  },

  socials: [
    { label: "GitHub", handle: "github.com/SadikHasanRafi", href: "https://github.com/SadikHasanRafi", icon: "github" },
    { label: "LinkedIn", handle: "linkedin.com/in/sadikhasanrafi", href: "https://www.linkedin.com/in/sadikhasanrafi/", icon: "linkedin" },
    { label: "WhatsApp", handle: "+880 1533 632470", href: "https://wa.me/8801533632470", icon: "whatsapp" },
  ] satisfies SocialLink[],

  hero: {
    greeting: "Hi, I'm Rafi",
    lines: ["Building Backends", "That Quietly Power"],
    accent: "Real Businesses.",
    description:
      "I'm a Node.js & TypeScript backend developer from Dhaka. I build secure, scalable APIs, payment flows and business systems that actually run in the real world.",
    badge: "BACKEND DEVELOPER • NODE.JS • TYPESCRIPT • ",
  },

  homeAbout: {
    title: "Good backend work is invisible",
    accent: "until it breaks.",
    body: "I learn how a client's business actually runs, turn it into working software and explain it in plain language. Clean schemas, strict access rules and payment flows that survive retries are the real foundation of a good product.",
  },

  stats: [
    { icon: "code", value: "2.5+", label: "Years of Experience" },
    { icon: "rocket", value: "7", label: "Production Systems" },
    { icon: "shield", value: "5", label: "Payment Methods Shipped" },
    { icon: "award", value: "25+", label: "Core Technologies" },
  ] satisfies Stat[],

  banner: {
    eyebrow: "Have a project in mind?",
    title: "Let's Build Something",
    accent: "Reliable Together.",
  },

  footer: {
    statement:
      "Engineering robust APIs, payment flows and business systems for shops, farms and growing teams — with precision.",
    services: ["API Architecture", "ERP / POS Solutions", "Payment Integration", "LLM Integrations"],
  },
};
