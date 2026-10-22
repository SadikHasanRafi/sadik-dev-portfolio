# Personal Portfolio + Portfolio Dashboard

```
personal_portfolio/
├── personal-portfolio/        Next.js 16 (frontend + API routes) → http://localhost:3000
└── portfolio-dashboard/
    ├── client/                React + Vite CMS UI                → http://localhost:5173
    └── server/                Express + JWT auth API             → http://localhost:5000
```

## Run

```bash
# 1. Portfolio site
cd personal-portfolio && npm install && npm run dev

# 2. Dashboard API
cd portfolio-dashboard/server && npm install && npm run dev

# 3. Dashboard UI
cd portfolio-dashboard/client && npm install && npm run dev
```

Dashboard login (dev): `admin@example.com` / `admin12345`.
Set your own in `portfolio-dashboard/server/.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`)
**before the first start** — the admin is created once, when `server/data/users.json` doesn't exist yet.

## Where to change things

### personal-portfolio
| I want to…                             | Edit                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| Change any text, links, stats          | `src/content/site.ts`                                            |
| Add / edit projects                    | `src/content/projects.ts` + `public/images/projects/`            |
| Change colours & fonts                 | `src/app/globals.css` (`@theme`), `src/app/layout.tsx` (fonts)   |
| Reorder home page sections             | `src/app/page.tsx`                                               |
| Edit a section's layout                | `src/components/sections/*`                                      |
| Header / footer                        | `src/components/layout/*`                                        |
| Backend endpoints                      | `src/app/api/*/route.ts`                                         |
| Feed content from the dashboard later  | `src/lib/content.ts` (the only file that reads content)          |
| Replace placeholder artwork            | `public/images/` (hero-portrait, about-frame, projects/*)        |

### portfolio-dashboard/server
`routes/` (URL → controller) → `controllers/` (HTTP + validation) → `services/` (logic) → `repositories/` (storage).
Storage is JSON files in `data/` for now; replace `repositories/*.repo.ts` to move to MongoDB/Postgres.
To add a feature: repository → controller → route file → register it in `routes/index.ts`.

### portfolio-dashboard/client
`pages/` screens · `components/{ui,layout,auth}` · `context/` auth + current site · `lib/` API calls ·
`config/navigation.ts` sidebar · `routes.tsx` all routes · `styles.css` design tokens.
