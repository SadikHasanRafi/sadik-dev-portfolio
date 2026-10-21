# Sadik Hasan Rafi — Portfolio

Next.js 16 (App Router) + Tailwind CSS v4, following the "Architectural Editorial"
design in `design/`. Every public page is statically generated; a private dashboard
edits all of the content, theme, images and pages.

## Commands

```bash
pnpm dev       # http://localhost:3000
pnpm build     # pre-renders every public page
pnpm start     # serves the build (needs a Node server — see Deploying)
pnpm lint
pnpm images    # rebuild the default images in public/images from design/
```

Copy `.env.example` to `.env.local` and fill it in:

| Variable | What it does |
| --- | --- |
| `DASHBOARD_PASSCODE` | The dashboard login code (see below). Use something long in production. |
| `SESSION_SECRET` | Signs the login cookie. 32+ random characters; changing it logs you out. |
| `NEXT_PUBLIC_SITE_URL` | Your public URL, used in SEO tags, the sitemap and RSS. |
| `MONGODB_URI` | MongoDB connection string (Atlas or self-hosted). All content and uploads live here. |
| `MONGODB_DB` | Database name (default `portfolio`). |

## The dashboard

1. Click **Let's Talk** in the header.
2. Type the passcode in **both** the name and email fields and press **Send message**.
3. You land on `/dashboard` (a signed, HttpOnly cookie keeps you logged in for 7 days).

The passcode is checked on the server, so it never appears in the site's JavaScript.
Logins are rate-limited per IP, and `/dashboard` plus its APIs reject requests without a
valid session.

In the dashboard you can change every text on the site, reorder lists by dragging
(mouse, touch or keyboard), hide or show items and whole sections, switch pages on/off,
upload images and the CV, edit light and dark theme colours, and back up or reset
everything. Press **Save** (or ⌘/Ctrl+S) to publish — the affected static pages are
regenerated on their next visit.

## How content is stored (MongoDB)

| Collection | Holds |
| --- | --- |
| `site_content` | One document, `{ _id: "site" }`, with everything the dashboard edits (merged over the defaults in `src/content/defaults.ts`). |
| `content_history` | A snapshot on every save; the newest 30 are kept, so a bad edit can be recovered. |
| `uploads.files` / `uploads.chunks` | GridFS: uploaded images (re-encoded to WebP) and PDFs, served from `/media/…`. |

Without `MONGODB_URI` the site renders the default content and the dashboard shows a
"No database connected" notice with saving disabled. If MongoDB is briefly unreachable,
pages keep rendering the last content the server saw; only saving and new uploads wait.

Use **Backup & reset → Download backup** in the dashboard for an extra JSON copy.

## Deploying

Everything lives in MongoDB, so any Node.js host works — Vercel, Railway, Render, a VPS
or Docker. Set the environment variables above, then `pnpm build && pnpm start` (or let
the platform build). For MongoDB Atlas, allow your host's IPs under *Network Access*.
The build reads content from the database when it can, and falls back to the defaults
if it can't; either way, the first save from the dashboard refreshes every page.

## Where things live

| What | Where |
| --- | --- |
| Public pages | `src/app/(site)/` |
| Dashboard | `src/app/dashboard/`, `src/components/dashboard/` |
| Content model (types) | `src/types/content.ts` |
| Defaults | `src/content/defaults.ts` |
| MongoDB connection & storage | `src/lib/mongo.ts`, `src/lib/store.ts` |
| Auth, theme CSS | `src/lib/auth.ts`, `src/lib/theme.ts` |
| Dashboard field labels & help | `src/components/dashboard/hints.ts` |
| Design tokens & animations | `src/app/globals.css` |

## Notes

- Forms (popup and contact page) open the visitor's email app with a pre-filled
  message; nothing is sent to or stored on the server.
- Motion uses only `transform`/`opacity` and respects `prefers-reduced-motion`.
- The cursor ring follows the mouse (the normal cursor stays visible) and appears
  under the finger on touch screens.
