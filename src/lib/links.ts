import type { NavId, SiteContent } from "@/types";

export const pageHref: Record<NavId, string> = {
  home: "/",
  about: "/about/",
  work: "/work/",
  services: "/services/",
  blog: "/blog/",
  contact: "/contact/",
};

/** Only allow link schemes that are safe to put in an href. */
export function safeHref(href: string | undefined, fallback = "/") {
  const value = (href ?? "").trim();
  if (/^(https?:|mailto:|tel:)/i.test(value) || value.startsWith("/") || value.startsWith("#")) return value;
  return fallback;
}

/** Visible navigation, in the order set in the dashboard. */
export function navItems(content: SiteContent) {
  return content.navigation.items
    .filter((item) => item.id === "home" || content.navigation.pages[item.id])
    .map((item) => ({ id: item.id, label: item.label, href: pageHref[item.id] }));
}

export const isOn = (item: { visible?: boolean }) => item.visible !== false;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
