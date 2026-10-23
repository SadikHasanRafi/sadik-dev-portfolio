import type { Post, PostTopic } from "@/types";

/**
 * Blog posts. Each post is plain data rendered by app/blog/[slug]/page.tsx.
 * The first post is featured on the blog index.
 */
export const posts: Post[] = [
  {
    slug: "idempotent-payment-webhooks",
    title: {
      lead: "Designing Idempotent Payment Callbacks That Never Double-Charge Under",
      accent: "Retries",
    },
    excerpt:
      "How I made bKash subscription billing safe to replay: claiming a payment row atomically, executing once, and asking the gateway, not guessing, when a request times out.",
    topic: "payments",
    topicLabel: "Payments & Billing",
    date: "2026-09-28",
    readMinutes: 9,
    tags: ["bKash", "Drizzle", "MySQL"],
    plate: { kind: "code", label: "payment.callback.ts", lines: [] },
    stack: ["Node.js", "TypeScript", "Express", "Drizzle ORM", "MySQL", "bKash Tokenized"],
    sections: [
      {
        id: "the-problem",
        kicker: "Part 1",
        title: "Why a Payment Callback Runs More Than Once",
        blocks: [
          {
            type: "p",
            text: "On the Village Agro Farm ERP, subscriptions are paid through **bKash Tokenized Checkout**. After the customer approves a payment, bKash sends them back to our callback URL with a `paymentID` and a `status`. Our server then calls **Execute Payment** to actually capture the money and extend the subscription.",
          },
          {
            type: "p",
            text: "That callback is not guaranteed to arrive once. Users refresh the success page, mobile browsers retry on flaky networks, and our own Execute call can time out *after* bKash has already captured the payment. Every one of those paths hits the same handler.",
          },
          {
            type: "callout",
            tone: "warning",
            label: "What goes wrong",
            text: "If two requests read the payment as unpaid at the same moment, both call Execute, both extend the subscription and both write a ledger entry. The farm gets double-billed and the books stop balancing.",
          },
        ],
      },
      {
        id: "claim-the-row",
        kicker: "Part 2",
        title: "Claim the Payment Row Before Touching the Gateway",
        blocks: [
          {
            type: "p",
            text: "The fix is to make one request the *owner* of a payment before any side effect happens. Each payment is stored when it is created, keyed by bKash's `paymentID` with a unique index. A callback can only proceed if it moves that row from `PENDING` to `EXECUTING`, a single conditional `UPDATE` that the database applies atomically.",
          },
          {
            type: "steps",
            caption: "How a callback is handled",
            steps: [
              { title: "Callback", detail: "paymentID + status" },
              { title: "Atomic Claim", detail: "PENDING → EXECUTING" },
              { title: "Execute Once", detail: "bKash Execute API" },
              { title: "Settle", detail: "Ledger + subscription in one transaction" },
            ],
          },
          {
            type: "code",
            file: "src/billing/bkash-callback.ts",
            lang: "ts",
            code: `export async function handleBkashCallback(paymentID: string, status: string) {
  if (status !== "success") return markPayment(paymentID, "FAILED");

  // 1. Only one request can move the row out of PENDING
  const [claim] = await db
    .update(payments)
    .set({ state: "EXECUTING" })
    .where(and(eq(payments.paymentId, paymentID), eq(payments.state, "PENDING")));

  if (claim.affectedRows === 0) {
    // Already executing or settled elsewhere: never call Execute twice
    return getPaymentResult(paymentID);
  }

  try {
    const result = await bkash.executePayment(paymentID);
    return settle(paymentID, result);
  } catch (err) {
    // 2. A timeout does not mean failure: ask bKash what really happened
    const truth = await bkash.queryPayment(paymentID);
    if (truth.transactionStatus === "Completed") return settle(paymentID, truth);
    await markPayment(paymentID, "PENDING"); // safe to retry later
    throw err;
  }
}`,
          },
        ],
      },
      {
        id: "settle-atomically",
        kicker: "Part 3",
        title: "Settle the Ledger and Subscription Together",
        blocks: [
          {
            type: "p",
            text: "Settling writes three things: the payment becomes `COMPLETED` with bKash's `trxID`, a journal entry is posted, and the subscription period is extended. They go into **one database transaction**, so the system can never end up with money recorded but no subscription, or a subscription with no money behind it.",
          },
          {
            type: "code",
            file: "src/billing/settle.ts",
            lang: "ts",
            code: `async function settle(paymentID: string, result: BkashPayment) {
  return db.transaction(async (tx) => {
    await tx
      .update(payments)
      .set({ state: "COMPLETED", trxId: result.trxID })
      .where(eq(payments.paymentId, paymentID));

    await postJournal(tx, {
      debit: "bkash_clearing",
      credit: "subscription_revenue",
      amount: result.amount,
      ref: result.trxID,
    });

    await extendSubscription(tx, paymentID);
    return { status: "SETTLED" as const };
  });
}`,
          },
          {
            type: "p",
            text: "Because `trxID` also has a unique index on the journal table, even a bug that slipped past the claim step could not post the same bKash transaction twice. The database is the last line of defence, not the application.",
          },
        ],
      },
      {
        id: "recovery",
        kicker: "Part 4",
        title: "Recovering Payments Stuck in EXECUTING",
        blocks: [
          {
            type: "p",
            text: "If the server crashes between claiming and settling, a payment can be left in `EXECUTING`. A small scheduled job picks up rows that have been stuck for more than a few minutes and resolves them with **Query Payment**, completing them if bKash says the money was captured, or releasing them back to `PENDING` if it wasn't.",
          },
          {
            type: "list",
            items: [
              "**Unique keys first:** `paymentID` on payments and `trxID` on journal entries.",
              "**Claim, then act:** a conditional UPDATE decides who executes; everyone else just reads the result.",
              "**Ask, don't guess:** after a timeout, the gateway's Query API is the source of truth.",
            ],
          },
        ],
      },
    ],
    takeaway: "A payment endpoint that isn't safe to call twice is a production incident waiting for a slow network.",
    checklist: [
      { title: "Store the payment before redirecting", detail: "Create the row with a unique paymentID while it's still PENDING." },
      { title: "Claim with a conditional UPDATE", detail: "Only the request that changes PENDING → EXECUTING may call the gateway." },
      { title: "Settle in one transaction", detail: "Payment status, journal entry and subscription change commit together." },
      { title: "Reconcile stuck rows", detail: "Resolve old EXECUTING payments with the gateway's Query API on a schedule." },
    ],
  },
  {
    slug: "prisma-to-drizzle-migration",
    title: { lead: "Migrating a Live ERP from Prisma to Drizzle", accent: "Module by Module" },
    excerpt:
      "What it took to move an accounting system to Drizzle ORM without a big-bang rewrite: introspecting the schema, running both ORMs side by side, and deleting Prisma last.",
    topic: "databases",
    topicLabel: "Databases & ORM",
    date: "2026-08-14",
    readMinutes: 7,
    tags: ["Drizzle", "Prisma", "MySQL"],
    plate: { kind: "compare", label: "ORM Migration", lines: ["prisma.invoice.findMany()", "db.select().from(invoices)"] },
    stack: ["TypeScript", "Express", "Prisma", "Drizzle ORM", "drizzle-kit", "MySQL"],
    sections: [
      {
        id: "why-move",
        kicker: "Part 1",
        title: "Why Leave a Working ORM?",
        blocks: [
          {
            type: "p",
            text: "Prisma got the Village Agro Farm ERP off the ground quickly. But accounting is query-heavy: trial balances, ledger aggregates and reconciliation reports all wanted precise SQL with joins and grouping. We kept dropping down to raw queries and losing type safety exactly where it mattered most.",
          },
          {
            type: "p",
            text: "Drizzle keeps the schema in plain TypeScript and its query builder maps almost one-to-one to SQL, so complex reports stay typed. It also has no separate query engine to ship, which kept deployments simpler.",
          },
        ],
      },
      {
        id: "introspect",
        kicker: "Part 2",
        title: "Start From the Database, Not From Memory",
        blocks: [
          {
            type: "p",
            text: "Before migrating I normalised the schema and wrote proper seed data. Then, instead of hand-translating `schema.prisma`, I generated the Drizzle schema from the live database so both ORMs described exactly the same tables.",
          },
          {
            type: "code",
            file: "terminal",
            lang: "bash",
            code: `# Generate a Drizzle schema from the existing MySQL database
npx drizzle-kit pull

# Review the generated tables, then commit them as the new source of truth
git add src/db/schema.ts`,
          },
        ],
      },
      {
        id: "side-by-side",
        kicker: "Part 3",
        title: "Run Both ORMs Side by Side",
        blocks: [
          {
            type: "p",
            text: "The migration went module by module, invoices, then bills, then the general ledger, with both clients connected to the same database. Each module's queries were rewritten, tested against the seed data, and shipped before moving on.",
          },
          {
            type: "code",
            file: "src/invoices/repository.ts",
            lang: "ts",
            code: `// Before: Prisma
const unpaid = await prisma.invoice.findMany({
  where: { farmId, status: "UNPAID" },
  include: { customer: true },
});

// After: Drizzle, same result, closer to the SQL
const unpaid = await db
  .select()
  .from(invoices)
  .innerJoin(customers, eq(customers.id, invoices.customerId))
  .where(and(eq(invoices.farmId, farmId), eq(invoices.status, "UNPAID")));`,
          },
          {
            type: "callout",
            tone: "note",
            label: "One rule",
            text: "No module was half-migrated. A module was either fully on Prisma or fully on Drizzle, which kept transactions from ever spanning two ORMs.",
          },
        ],
      },
      {
        id: "cleanup",
        kicker: "Part 4",
        title: "Delete Prisma Last",
        blocks: [
          {
            type: "p",
            text: "Once every module was on Drizzle, Prisma's client, schema file and generate step were removed in one final change. By then it was a deletion, not a rewrite, the risky work had already been done in small, tested pieces.",
          },
        ],
      },
    ],
    takeaway: "The safest migration is a boring one: same database, small steps, and the old tool removed only when nothing uses it.",
    checklist: [
      { title: "Normalise and seed first", detail: "Fix the schema before you change how you talk to it." },
      { title: "Introspect, don't retype", detail: "Generate the new schema from the live database." },
      { title: "Migrate whole modules", detail: "Never let one transaction span two ORMs." },
      { title: "Remove the old ORM last", detail: "Make the final step a deletion." },
    ],
  },
  {
    slug: "database-driven-rbac",
    title: { lead: "Role-Based Access Control That Changes", accent: "Without a Redeploy" },
    excerpt:
      "Storing permissions per admin role in MongoDB and resolving them per route at runtime, the access model behind the Pink Life Line admin panel.",
    topic: "architecture",
    topicLabel: "System Architecture",
    date: "2026-07-02",
    readMinutes: 6,
    tags: ["Express", "MongoDB", "RBAC"],
    plate: { kind: "terminal", label: "RBAC Resolver", lines: ["GET /admin/doctors", "role=moderator", "doctors:read ✓"] },
    stack: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT"],
    sections: [
      {
        id: "hardcoded-roles",
        kicker: "Part 1",
        title: "Hard-Coded Roles Don't Survive Real Teams",
        blocks: [
          {
            type: "p",
            text: "The first version of most admin panels checks roles in code: `if (user.role === 'admin')`. It works until the client asks for a moderator who can manage forum posts but not doctors, or a support role that can view bookings but not cancel them. Every new rule becomes a code change and a deploy.",
          },
        ],
      },
      {
        id: "permissions-as-data",
        kicker: "Part 2",
        title: "Roles Hold Permissions; Routes Ask for Them",
        blocks: [
          {
            type: "p",
            text: "On Pink Life Line, each admin role is a document with a list of permission strings like `doctors:read` or `posts:moderate`. Routes declare the permission they need, and a middleware resolves the caller's role from the database to decide.",
          },
          {
            type: "code",
            file: "src/middleware/authorize.ts",
            lang: "ts",
            code: `export const authorize = (permission: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const role = await roleCache.get(req.user.roleId, () =>
      Role.findById(req.user.roleId).lean()
    );

    if (!role?.permissions.includes(permission)) {
      return res.status(403).json({ error: "FORBIDDEN", permission });
    }
    next();
  };

// Routes describe what they need, not who may call them
router.get("/doctors", authenticate, authorize("doctors:read"), listDoctors);
router.patch("/posts/:id", authenticate, authorize("posts:moderate"), moderatePost);`,
          },
          {
            type: "p",
            text: "A super-admin edits a role's permissions from the panel, the cache entry for that role is cleared, and the next request uses the new rules. No deploy, no restart.",
          },
        ],
      },
      {
        id: "guardrails",
        kicker: "Part 3",
        title: "Keep Dynamic Access Safe",
        blocks: [
          {
            type: "list",
            items: [
              "**Deny by default:** a route without an explicit permission is unreachable.",
              "**Short cache lifetimes:** role lookups are cached briefly and invalidated on every edit.",
              "**Protect the protector:** only one permission can edit roles, and it can't be removed from the last super-admin.",
            ],
          },
        ],
      },
    ],
    takeaway: "Access rules are business decisions. Store them where the business can change them, in the database.",
    checklist: [
      { title: "Name permissions by resource:action", detail: "doctors:read, posts:moderate, bookings:cancel." },
      { title: "Declare permissions on routes", detail: "Routes ask for capabilities, never for role names." },
      { title: "Cache and invalidate", detail: "Fast lookups, instant updates when a role changes." },
      { title: "Deny by default", detail: "Missing permission means no access." },
    ],
  },
  {
    slug: "maker-checker-approval-workflow",
    title: { lead: "Building a Maker-Checker Approval Flow for", accent: "Merchant Operations" },
    excerpt:
      "The four-eyes principle as a small state machine: create, submit, approve, with the rule that the person who makes a change can never be the one who approves it.",
    topic: "architecture",
    topicLabel: "System Architecture",
    date: "2026-05-19",
    readMinutes: 6,
    tags: ["Workflow", "PostgreSQL", "Audit"],
    plate: { kind: "flow", label: "Approval State Machine", lines: ["DRAFT", "SUBMITTED", "APPROVED"] },
    stack: ["TypeScript", "PostgreSQL", "REST APIs", "Audit Trail"],
    sections: [
      {
        id: "four-eyes",
        kicker: "Part 1",
        title: "Two People, One Change",
        blocks: [
          {
            type: "p",
            text: "In financial portals, changes to merchant accounts can move real money. At Celloscope I built a Maker-Checker workflow for merchant account operations: one user *makes* a change, a different user *checks* and approves it, and nothing goes live until both have acted.",
          },
          {
            type: "steps",
            caption: "The approval lifecycle",
            steps: [
              { title: "Create", detail: "Maker drafts the change" },
              { title: "Submit", detail: "Locked for review" },
              { title: "Approve / Reject", detail: "Checker decides" },
              { title: "Apply", detail: "Change goes live + audited" },
            ],
          },
        ],
      },
      {
        id: "state-machine",
        kicker: "Part 2",
        title: "Model It as a State Machine",
        blocks: [
          {
            type: "p",
            text: "Each request has a status and only a handful of legal transitions. Encoding them in one place means the API, the UI and the audit trail all agree on what is allowed.",
          },
          {
            type: "code",
            file: "src/approvals/transition.ts",
            lang: "ts",
            code: `const transitions = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["APPROVED", "REJECTED"],
  REJECTED: ["DRAFT"],
  APPROVED: [],
} as const;

export function assertTransition(req: ChangeRequest, next: Status, actor: User) {
  if (!transitions[req.status].includes(next)) {
    throw new HttpError(409, \`Cannot move \${req.status} → \${next}\`);
  }
  // The four-eyes rule: makers never approve their own changes
  if (next === "APPROVED" && actor.id === req.makerId) {
    throw new HttpError(403, "Maker cannot approve their own request");
  }
}`,
          },
        ],
      },
      {
        id: "audit",
        kicker: "Part 3",
        title: "Every Transition Leaves a Trail",
        blocks: [
          {
            type: "p",
            text: "Each transition is written to an append-only audit table in the same transaction as the status change: who acted, when, the before and after values, and an optional comment. When someone asks why an account changed, the answer is a query, not an investigation.",
          },
          {
            type: "code",
            file: "migrations/audit_log.sql",
            lang: "sql",
            code: `CREATE TABLE change_request_audit (
  id           BIGSERIAL PRIMARY KEY,
  request_id   BIGINT NOT NULL REFERENCES change_requests(id),
  actor_id     BIGINT NOT NULL,
  from_status  TEXT   NOT NULL,
  to_status    TEXT   NOT NULL,
  snapshot     JSONB  NOT NULL,
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
          },
        ],
      },
    ],
    takeaway: "Approval rules belong in one state machine, not scattered across buttons and controllers.",
    checklist: [
      { title: "Define legal transitions once", detail: "API, UI and audit trail all read the same map." },
      { title: "Enforce maker ≠ checker on the server", detail: "Never trust the UI to hide the approve button." },
      { title: "Lock on submit", detail: "A submitted request can't be edited until it's rejected." },
      { title: "Audit in the same transaction", detail: "Status change and audit row commit together." },
    ],
  },
  {
    slug: "booking-slots-without-overbooking",
    title: { lead: "Doctor Booking Slots Without", accent: "Overbooking" },
    excerpt:
      "Recurring weekly availability, holiday overrides and slot-capacity limits, and the single atomic MongoDB update that stops two patients taking the last seat.",
    topic: "node",
    topicLabel: "Node.js & MongoDB",
    date: "2026-04-06",
    readMinutes: 5,
    tags: ["Node.js", "MongoDB", "Concurrency"],
    plate: { kind: "compare", label: "Slot Capacity", lines: ["Thu 18:30", "3 / 4 booked"] },
    stack: ["Node.js", "Express", "MongoDB", "Mongoose", "FCM"],
    sections: [
      {
        id: "availability",
        kicker: "Part 1",
        title: "Availability Is a Rule, Slots Are Data",
        blocks: [
          {
            type: "p",
            text: "Doctors on Pink Life Line set recurring weekly availability, say, Thursdays 18:00–21:00 in 30-minute slots of four patients each. Holidays override that rule for specific dates. Concrete slot documents are generated from the rule, which gives each slot its own `capacity` and `booked` count.",
          },
        ],
      },
      {
        id: "the-race",
        kicker: "Part 2",
        title: "Read-Then-Write Loses the Last Seat Twice",
        blocks: [
          {
            type: "callout",
            tone: "warning",
            label: "The bug",
            text: "If the API reads a slot, sees 3 of 4 booked, and then increments, two patients clicking at the same moment both see 3, and the slot ends up with 5 bookings.",
          },
          {
            type: "p",
            text: "The check and the increment have to be one operation. MongoDB can do that in a single `findOneAndUpdate` whose filter only matches while there is still room.",
          },
          {
            type: "code",
            file: "src/bookings/reserve.ts",
            lang: "ts",
            code: `export async function reserveSlot(slotId: string, patientId: string) {
  const slot = await Slot.findOneAndUpdate(
    {
      _id: slotId,
      status: "OPEN",
      $expr: { $lt: ["$booked", "$capacity"] }, // only matches if a seat is free
    },
    { $inc: { booked: 1 } },
    { new: true }
  );

  if (!slot) throw new HttpError(409, "This slot was just filled");

  return Booking.create({ slotId, patientId, status: "CONFIRMED" });
}`,
          },
        ],
      },
      {
        id: "after-booking",
        kicker: "Part 3",
        title: "Cancellations and Reminders",
        blocks: [
          {
            type: "list",
            items: [
              "**Cancellation** decrements `booked` with the same atomic pattern, so freed seats appear instantly.",
              "**Holiday overrides** close affected slots and notify booked patients.",
              "**Reminders** go out through Firebase Cloud Messaging from a cron-based scheduler.",
            ],
          },
        ],
      },
    ],
    takeaway: "If two users can click at the same time, the database, not the API, has to decide who wins.",
    checklist: [
      { title: "Generate slots from rules", detail: "Weekly availability creates concrete slot documents." },
      { title: "Check and increment atomically", detail: "Put the capacity condition in the update filter." },
      { title: "Return a clear conflict", detail: "409 with a friendly message when the slot fills." },
      { title: "Reverse with the same pattern", detail: "Cancellations decrement atomically too." },
    ],
  },
];

export const postTopics: { id: "all" | PostTopic; label: string }[] = [
  { id: "all", label: "All Articles" },
  { id: "payments", label: "Payments & Billing" },
  { id: "databases", label: "Databases & ORM" },
  { id: "architecture", label: "System Architecture" },
  { id: "node", label: "Node.js & TypeScript" },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
