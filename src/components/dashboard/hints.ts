import type { SiteContent } from "@/types";

/**
 * Editor hints. The dashboard builds its forms from the shape of the content
 * itself; these hints only add friendlier labels, help text, input types and
 * templates for new items. Keys are path patterns ("work.projects[].name") or,
 * as a fallback, plain field names ("eyebrow").
 */

export type Option = { value: string; label: string };

export type Hint = {
  label?: string;
  help?: string;
  placeholder?: string;
  kind?:
    | "text"
    | "textarea"
    | "code"
    | "date"
    | "number"
    | "select"
    | "multiselect"
    | "icon"
    | "image"
    | "file"
    | "strings"
    | "hidden";
  options?: Option[] | ((content: SiteContent) => Option[]);
  /** Noun for list items, e.g. "project" → "Add project" */
  item?: string;
  /** New list item (defaults to an empty copy of the first default item) */
  template?: () => unknown;
  /** List items of different types, keyed by `key` (e.g. post blocks by "type") */
  union?: { key: string; templates: Record<string, () => unknown>; labels: Record<string, string> };
  /** Fixed set of items: can be reordered and hidden, not added or removed */
  fixed?: boolean;
  /** Item title for fixed lists keyed by id */
  titles?: Record<string, string>;
};

const today = () => new Date().toISOString().slice(0, 10);
const rid = () => Math.random().toString(36).slice(2, 7);

const banner: Record<string, Hint> = {
  visible: { label: "Show this banner" },
  eyebrow: { label: "Small label" },
  title: { label: "Headline" },
  accent: { label: "Highlighted words", help: "Shown in italic accent colour after the headline." },
  body: { label: "Supporting text", kind: "textarea" },
  button: { label: "Main button" },
  secondary: { label: "Secondary link" },
};

/** Hints by field name, used wherever no path-specific hint exists. */
export const keyHints: Record<string, Hint> = {
  eyebrow: { label: "Small label", help: "The uppercase label above a heading." },
  title: { label: "Title" },
  accent: { label: "Highlighted words", help: "Shown in italic accent colour." },
  lead: { label: "Intro paragraph", kind: "textarea" },
  lines: { label: "Headline lines", help: "Each line starts on a new row on larger screens.", item: "line" },
  aside: { label: "Side note", kind: "textarea" },
  body: { label: "Text", kind: "textarea" },
  description: { label: "Description", kind: "textarea" },
  summary: { label: "Summary", kind: "textarea" },
  shortBody: { label: "Short text", kind: "textarea" },
  excerpt: { label: "Excerpt", kind: "textarea" },
  a: { label: "Answer", kind: "textarea" },
  q: { label: "Question" },
  quote: { label: "Quote", kind: "textarea" },
  statement: { label: "Statement", kind: "textarea" },
  text: { label: "Text", kind: "textarea" },
  detail: { label: "Detail", kind: "textarea" },
  takeaway: { label: "Takeaway", kind: "textarea" },
  label: { label: "Label" },
  href: { label: "Link", placeholder: "/contact/ or https://…", help: "A page path like /work/ or a full URL." },
  visible: { label: "Show on site" },
  icon: { kind: "icon", label: "Icon" },
  seo: { label: "Search & link previews" },
  intro: { label: "Page header" },
  cta: { label: "Closing banner" },
  date: { kind: "date", label: "Date" },
  slug: { label: "URL slug" },
  items: { label: "Items", item: "item" },
  stack: { label: "Tech stack", item: "technology" },
  tags: { label: "Tags", item: "tag" },
  points: { label: "Bullet points", item: "point" },
  highlights: { label: "Highlights", item: "highlight" },
  deliverables: { label: "Deliverables", item: "deliverable" },
  tools: { label: "Tools", item: "tool" },
  courses: { label: "Courses", item: "course" },
  integrations: { label: "Integrations", item: "integration" },
  meta: { kind: "hidden" },
  tag: { kind: "hidden" },
  version: { kind: "hidden" },
  topicLabel: { kind: "hidden" },
};

/** Path-specific hints. */
export const pathHints: Record<string, Hint> = {
  // Profile
  "identity.name": { label: "Full name" },
  "identity.shortName": { label: "Short name", help: "Used for the signature and the hero badge." },
  "identity.initials": { label: "Monogram letters", help: "Shown in the square logo when no logo image is set." },
  "identity.role": { label: "Role / title" },
  "identity.description": { label: "Site description", kind: "textarea", help: "Used for search results and link previews." },
  "identity.logo": { kind: "image", label: "Logo image", help: "Optional. Replaces the monogram square in the header and footer. A transparent PNG works best." },
  "identity.favicon": { kind: "image", label: "Browser tab icon", help: "Optional. A square image, at least 180×180." },
  "contact.email": { label: "Email" },
  "contact.phone": { label: "Phone" },
  "contact.whatsapp": { label: "WhatsApp link", placeholder: "https://wa.me/8801…" },
  "contact.location": { label: "Full address / area" },
  "contact.city": { label: "City (shown on the site)" },
  "contact.timezone": { label: "Time zone", help: "IANA name like Asia/Dhaka — drives the live clock on the contact page." },
  "contact.utc": { label: "UTC offset label", placeholder: "UTC +6" },

  // Socials
  socials: {
    label: "Social links",
    item: "link",
    template: () => ({ label: "New link", handle: "", href: "https://", icon: "globe", visible: true }),
  },
  "socials[].handle": { label: "Display text", help: "Shown on the contact page, e.g. github.com/you." },

  // Media
  "media.portrait": { label: "Portrait", help: "Used in the home hero and on the About page." },
  "media.desk": { label: "Desk photo", help: "The framed photo in the home About section." },
  "media.ogImage": { label: "Link preview image", help: "Shown when the site is shared. 1200×630 is ideal." },
  "media.cv": { kind: "file", label: "CV / résumé (PDF)" },

  // Search & link previews (every page)
  "home.seo.title": { label: "Browser tab title", help: "Leave empty to use “Name — Role”." },
  "home.seo.description": { label: "Search description", kind: "textarea" },

  // Home
  "home.sections": {
    label: "Sections & order",
    help: "Drag to reorder the home page. Use the eye to hide a section.",
    fixed: true,
    titles: { hero: "Hero", services: "Services strip", projects: "Selected projects", about: "About & stats", faq: "FAQ", cta: "Closing banner" },
  },
  "home.hero": { label: "Hero" },
  "home.hero.greeting": { label: "Greeting" },
  "home.hero.description": { label: "Intro paragraph", kind: "textarea" },
  "home.hero.primary": { label: "Main button" },
  "home.hero.secondary": { label: "Second button" },
  "home.hero.scrollLabel": { label: "Scroll hint" },
  "home.hero.showBadge": { label: "Show rotating badge" },
  "home.hero.badge": { label: "Badge text", help: "Runs around the circle — end it with a separator like “ • ”." },
  "home.projects": { label: "Selected projects" },
  "home.projects.limit": { kind: "number", label: "How many projects", help: "Visible projects from Work, in their order." },
  "home.projects.viewAllLabel": { label: "“View all” link text" },
  "home.about": { label: "About & signature" },
  "home.about.signature": { label: "Handwritten signature" },
  "home.about.cvLabel": { label: "CV button text" },
  "home.about.more": { label: "Second button" },
  "home.stats": { label: "Stats", item: "stat", template: () => ({ icon: "star", value: "0", label: "New stat", visible: true }) },
  "home.faq": { label: "FAQ" },
  "home.faq.items": { label: "Questions", item: "question", template: () => ({ q: "New question?", a: "", visible: true }) },
  "home.cta": { label: "Closing banner" },

  // About
  "about.intro": { label: "Page header" },
  "about.portraitAlt": { label: "Portrait description", help: "Read aloud by screen readers." },
  "about.availability": { label: "Availability line" },
  "about.background": { label: "Background" },
  "about.thesis": { label: "How I work" },
  "about.buttons": { label: "Buttons" },
  "about.buttons.cv": { label: "CV button text" },
  "about.buttons.work": { label: "Second button" },
  "about.tools": { label: "Tools & skills" },
  "about.tools.groups": { label: "Skill groups", item: "group" },
  "about.tools.groups[].index": { label: "Small label" },
  "about.tools.groups[].accent": { label: "Highlighted tool", help: "Type one tool name from the list to highlight it." },
  "about.tools.integrationsLabel": { label: "Integrations label" },
  "about.experience": { label: "Experience" },
  "about.experience.items": {
    label: "Jobs",
    item: "job",
    template: () => ({ period: "", role: "New role", org: "", context: "", summary: "", points: [], stack: [], visible: true }),
  },
  "about.experience.stackLabel": { label: "Stack label" },
  "about.experience.items[].context": { label: "Industry / context" },
  "about.experience.items[].org": { label: "Company" },
  "about.principles": { label: "Principles" },
  "about.principles.items": { label: "Principles", item: "principle" },
  "about.principles.items[].rule": { label: "Number / label" },
  "about.achievements": { label: "Achievements" },
  "about.achievements.items": { label: "Achievements", item: "achievement" },
  "about.education": { label: "Education" },
  "about.cta": { label: "Closing banner" },

  // Work
  "work.intro": { label: "Page header" },
  "work.allLabel": { label: "“All” filter label" },
  "work.filters": {
    label: "Filters",
    item: "filter",
    help: "Projects pick their filters under “Categories”. Filters with no projects are hidden.",
    template: () => ({ id: `filter-${rid()}`, label: "New filter" }),
  },
  "work.filters[].id": { label: "Code", help: "Short, no spaces. Projects refer to this." },
  "work.projects": {
    label: "Projects",
    item: "project",
    help: "Drag to reorder. The first ones also appear on the home page.",
    template: () => ({
      slug: `project-${rid()}`,
      name: "New project",
      category: "",
      categories: [],
      eyebrow: ["", ""],
      title: { lead: "New project", accent: "", tail: "" },
      summary: "",
      challenge: { label: "The challenge", body: "" },
      highlights: [],
      outcomes: [],
      stack: [],
      preview: { kind: "terminal", header: "Preview", status: "live", items: [""], caption: "" },
      image: null,
      link: { label: "", href: "" },
      status: "",
      visible: true,
    }),
  },
  "work.projects[].slug": { label: "URL anchor", help: "Used in links like /work/#this-name." },
  "work.projects[].category": { label: "Card subtitle", help: "Short line under the name on project cards." },
  "work.projects[].categories": { kind: "multiselect", label: "Categories", options: (c) => c.work.filters.map((f) => ({ value: f.id, label: f.label })) },
  "work.projects[].eyebrow": { label: "Labels", help: "Two short labels: the first is hidden, the second appears above the title." },
  "work.projects[].title": { label: "Long title" },
  "work.projects[].title.lead": { label: "Start" },
  "work.projects[].title.accent": { label: "Middle" },
  "work.projects[].title.tail": { label: "End" },
  "work.projects[].challenge": { label: "Challenge box" },
  "work.projects[].outcomes": { label: "Outcomes", item: "outcome", template: () => ({ value: "", label: "", note: "" }) },
  "work.projects[].image": { kind: "image", label: "Screenshot", help: "Optional. Replaces the coded preview with your own image." },
  "work.projects[].preview": { label: "Coded preview", help: "Used when there's no screenshot." },
  "work.projects[].preview.kind": {
    kind: "select",
    label: "Style",
    options: [
      { value: "terminal", label: "Terminal line" },
      { value: "metrics", label: "Two metric tiles" },
      { value: "pipeline", label: "Pipeline steps" },
      { value: "bars", label: "Bar chart" },
    ],
  },
  "work.projects[].preview.items": {
    label: "Preview content",
    item: "entry",
    help: "Terminal: the highlighted line · Metrics: “Label: Value” · Pipeline: one step each · Bars: numbers.",
  },
  "work.projects[].preview.caption": { label: "Caption (bar chart)" },
  "work.projects[].link": { label: "Live link" },
  "work.projects[].status": { label: "Status", placeholder: "Live, In progress…" },
  "work.values": { label: "“How I build” cards" },
  "work.values.items": { label: "Cards", item: "card" },
  "work.cta": { label: "Closing banner" },

  // Services
  "services.intro": { label: "Page header" },
  "services.list": { label: "Section header" },
  "services.list.deliverablesLabel": { label: "Deliverables label" },
  "services.list.stackLabel": { label: "Stack label" },
  "services.items": {
    label: "Services",
    item: "service",
    help: "Also used for the services strip on the home page.",
    template: () => ({
      slug: `service-${rid()}`,
      icon: "server",
      short: "New service",
      shortBody: "",
      tag: "",
      meta: "",
      title: "New service",
      body: "",
      deliverables: [],
      stack: [],
      visible: true,
    }),
  },
  "services.items[].slug": { label: "Anchor", help: "Used in links like /services/#this-name." },
  "services.items[].short": { label: "Short name (home strip)" },
  "services.items[].shortBody": { label: "Short text (home strip)", kind: "textarea" },
  "services.philosophy": { label: "Dark “how I think” panel" },
  "services.process": { label: "Process" },
  "services.process.steps": { label: "Steps", item: "step" },
  "services.process.steps[].phase": { label: "Step label" },
  "services.process.steps[].deliverable": { label: "Deliverable line" },
  "services.engagements": { label: "Ways to work together" },
  "services.engagements.items": { label: "Options", item: "option" },
  "services.cta": { label: "Closing banner" },

  // Blog
  "blog.intro": { label: "Page header" },
  "blog.index": { label: "“All posts” header" },
  "blog.topics": { label: "Topics", item: "topic", template: () => ({ id: `topic-${rid()}`, label: "New topic" }) },
  "blog.topics[].id": { label: "Code", help: "Short, no spaces. Posts refer to this." },
  "blog.follow": { label: "Follow / RSS box" },
  "blog.article": { label: "Article page labels" },
  "blog.posts": {
    label: "Posts",
    item: "post",
    help: "The first visible post is featured at the top of the blog.",
    template: () => ({
      slug: `post-${rid()}`,
      title: { lead: "New post", accent: "" },
      excerpt: "",
      topic: "",
      topicLabel: "",
      date: today(),
      readMinutes: 5,
      tags: [],
      plate: { kind: "terminal", label: "Notes", lines: ["", "", ""] },
      sections: [{ id: `part-${rid()}`, kicker: "Part 1", title: "", blocks: [{ type: "p", text: "" }] }],
      takeaway: "",
      checklist: [],
      stack: [],
      visible: true,
    }),
  },
  "blog.posts[].slug": { label: "URL slug", help: "The post lives at /blog/<slug>/." },
  "blog.posts[].title.lead": { label: "Title start" },
  "blog.posts[].title.accent": { label: "Title end (italic)" },
  "blog.posts[].topic": { kind: "select", label: "Topic", options: (c) => c.blog.topics.map((t) => ({ value: t.id, label: t.label })) },
  "blog.posts[].readMinutes": { kind: "number", label: "Minutes to read" },
  "blog.posts[].plate": { label: "Card visual" },
  "blog.posts[].plate.kind": {
    kind: "select",
    label: "Style",
    options: [
      { value: "code", label: "Code snippet" },
      { value: "flow", label: "Flow (3 steps)" },
      { value: "terminal", label: "Terminal (3 lines)" },
      { value: "compare", label: "Comparison (2 lines)" },
    ],
  },
  "blog.posts[].plate.lines": { label: "Lines", item: "line" },
  "blog.posts[].sections": {
    label: "Sections",
    item: "section",
    template: () => ({ id: `part-${rid()}`, kicker: "", title: "New section", blocks: [{ type: "p", text: "" }] }),
  },
  "blog.posts[].sections[].id": { label: "Anchor", help: "Used for the table of contents links." },
  "blog.posts[].sections[].blocks": {
    label: "Content blocks",
    item: "block",
    union: {
      key: "type",
      labels: { p: "Paragraph", list: "Bullet list", code: "Code", callout: "Callout", steps: "Steps diagram" },
      templates: {
        p: () => ({ type: "p", text: "" }),
        list: () => ({ type: "list", items: [""] }),
        code: () => ({ type: "code", file: "example.ts", lang: "ts", code: "" }),
        callout: () => ({ type: "callout", tone: "note", label: "Note", text: "" }),
        steps: () => ({ type: "steps", caption: "", steps: [{ title: "", detail: "" }] }),
      },
    },
  },
  "blog.posts[].sections[].blocks[].type": { kind: "hidden" },
  "blog.posts[].sections[].blocks[].text": { kind: "textarea", label: "Text", help: "Use **bold**, *italic* and `code`." },
  "blog.posts[].sections[].blocks[].code": { kind: "code", label: "Code" },
  "blog.posts[].sections[].blocks[].file": { label: "File name" },
  "blog.posts[].sections[].blocks[].lang": {
    kind: "select",
    label: "Language",
    options: [
      { value: "ts", label: "TypeScript" },
      { value: "sql", label: "SQL" },
      { value: "bash", label: "Shell" },
    ],
  },
  "blog.posts[].sections[].blocks[].tone": {
    kind: "select",
    label: "Tone",
    options: [
      { value: "note", label: "Note (accent)" },
      { value: "warning", label: "Warning (red)" },
    ],
  },
  "blog.posts[].sections[].blocks[].steps": { label: "Steps", item: "step", template: () => ({ title: "", detail: "" }) },
  "blog.posts[].checklist": { label: "Checklist", item: "item", template: () => ({ title: "", detail: "" }) },
  "blog.cta": { label: "Closing banner" },

  // Contact
  "contactPage.intro": { label: "Page header" },
  "contactPage.labels": { label: "Contact card labels" },
  "contactPage.labels.replyText": { label: "Reply time text" },
  "contactPage.cv": { label: "CV download card" },
  "contactPage.form": { label: "Project form" },
  "contactPage.form.areas": { label: "“What do you need?” options", item: "option" },
  "contactPage.form.timelines": { label: "Timeline options", item: "option" },
  "contactPage.form.note": { label: "Note under the button" },
  "contactPage.form.successText": { label: "After sending", kind: "textarea" },
  "contactPage.faq": { label: "FAQ" },
  "contactPage.faq.items": { label: "Questions", item: "question", template: () => ({ q: "New question?", a: "", visible: true }) },
  "contactPage.fastTrack": { label: "Quick chat band" },

  // Popup
  "talk.title": { label: "Headline" },
  "talk.accent": { label: "Highlighted word" },
  "talk.successBody": { label: "After sending", kind: "textarea" },

  // Footer
  "footer.statement": { label: "Short statement", kind: "textarea" },
  "footer.services": { label: "Services list", item: "service" },
  "footer.copyright": { label: "Copyright line", help: "{year} and {name} are filled in automatically." },
  "footer.tagline": { label: "Right-hand note" },
};

/** Hints applied to every page's closing banner and search settings. */
for (const page of ["home", "about", "work", "services", "blog"]) {
  for (const [key, hint] of Object.entries(banner)) pathHints[`${page}.cta.${key}`] ??= hint;
}
for (const page of ["about", "work", "services", "blog", "contactPage"]) {
  pathHints[`${page}.seo.title`] ??= { label: "Browser tab title" };
  pathHints[`${page}.seo.description`] ??= { label: "Search description", kind: "textarea" };
}

export function hintFor(pattern: string, key: string): Hint {
  return pathHints[pattern] ?? keyHints[key] ?? {};
}

export const humanize = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

export function labelFor(pattern: string, key: string) {
  return hintFor(pattern, key).label ?? humanize(key);
}
