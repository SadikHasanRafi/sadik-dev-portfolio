export const contactPage = {
  areas: ["API Architecture", "ERP / POS Systems", "Payment Integration", "AI / LLM Automation", "Database Optimization"],
  timelines: [
    { id: "short", title: "< 1 Month", body: "Fixes, audits, a single integration" },
    { id: "quarter", title: "1–3 Months", body: "New systems & re-architecting" },
    { id: "retainer", title: "Ongoing", body: "Monthly support & features" },
  ],
  faq: [
    {
      kicker: "How we work",
      q: "What is your typical engagement structure?",
      a: "It depends on where the project is. New systems usually run as milestone-based projects; a single module like billing or auth can be a fixed deliverable; and live systems that need ongoing care work best on a monthly support retainer.",
    },
    {
      kicker: "Scope",
      q: "Do you handle frontend or purely backend?",
      a: "My focus is the backend, APIs, databases, auth and integrations, but I'm comfortable building the React, Next.js or Angular screens that go with it, so smaller projects can be handled end to end.",
    },
    {
      kicker: "Existing code",
      q: "Can you work with an existing codebase?",
      a: "Yes. I've normalised messy schemas, migrated a live ERP from Prisma to Drizzle, and added payments, notifications and access control to systems that were already running.",
    },
    {
      kicker: "Ownership",
      q: "Who owns the code and data?",
      a: "You do. All source code, documentation and data belong to you, and I'm happy to sign an NDA before looking at private repositories or business information.",
    },
  ],
};
