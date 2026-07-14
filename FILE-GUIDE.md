# CivicBench — Complete File Guide

This document explains every file and folder in your output directory, what it does, and whether you still need it.

---

## 📦 Deployment Zips (Ready-to-Use Builds)

These are pre-built, production-ready packages. You don't need to modify them — just upload.

### `civicbench-clean.zip` (32 KB) — ⭐ THE CURRENT ONE
**This is the zip you should be using.** It contains the clean, minimal source code for the entire frontend app. It was created after we stripped out all backend dependencies (tRPC, Drizzle, Hono, MySQL) that were causing build crashes.

**What's inside:** 28 source files — React 19 + Vite + Tailwind frontend with all pages (landing, login, register, dashboard, tasks, wallet, etc.), the API client that talks to your Worker, and the Pages Functions proxy.

**How to use:** Extract, upload all files to your GitHub repo root, add your logo to `public/logo.png`, and Cloudflare Pages will auto-build it.

---

### `civicbench-cloudflare-deploy.zip` (93 KB) — OLD, do not use
The very first Cloudflare deployment attempt. Contains a dark-themed build from the initial kimi.page site that was manually zipped for a drag-and-drop deploy to Cloudflare Pages.

**Contains:**
- `civicbench-deploy/index.html` — Dark-themed landing page HTML
- `civicbench-deploy/_redirects` — SPA routing rule (`/* → /index.html`)
- `civicbench-deploy/assets/index-B-4iE363.js` — Compiled JavaScript bundle
- `civicbench-deploy/assets/index-CA6zBjCv.css` — Compiled CSS bundle

**Why it exists:** Before we set up GitHub → Pages auto-deploy, we manually uploaded built files. This was the first dark-themed version.

**Status:** ⚠️ Outdated — replaced by the light theme and then by `civicbench-clean.zip`.

---

### `civicbench-light-theme.zip` (913 KB) — OLD, do not use
The light-themed rebuild of the landing page, packaged for manual Cloudflare Pages deployment. This was created after you sent the logo and requested a white/blue/green design instead of dark mode.

**Contains:**
- `index.html` — HTML entry point
- `assets/index-CLsh6Jsi.js` — Compiled JS (light theme)
- `assets/index-DNJUTFy4.css` — Compiled CSS (light theme)
- `logo.png` — Your CivicBench logo (821 KB, 1313×1198px)

**Why it exists:** First light-theme deployment, built from the `/app` directory.

**Status:** ⚠️ Outdated — this was the landing page only (no app pages). Replaced by `civicbench-frontend.zip`.

---

### `civicbench-frontend.zip` (926 KB) — OLD, do not use
The full app (landing + all app pages) built from the `/app` directory. This was the first build that included the full demo app with auth, tasks, dashboard, etc.

**Contains:**
- `index.html` — HTML entry point
- `assets/index-JJvbOzFj.js` — Compiled JS (all pages)
- `assets/index-DggxYPfo.css` — Compiled CSS
- `logo.png` — Your CivicBench logo

**Why it exists:** First full-stack frontend build after we added all the app pages (dashboard, tasks, login, register, wallet, etc.).

**Status:** ⚠️ Outdated — built from `/app` which had backend dependencies that caused build failures. Replaced by `civicbench-clean.zip`.

---

## 📄 Backend Files (Cloudflare Worker + Database)

### `civicbench-worker.js` (17 KB) — ⭐ LIVE ON CLOUDFLARE
The **entire backend API** as a single, dependency-free Cloudflare Worker file. This is what powers login, registration, tasks, submissions, reviews, and wallet.

**Deployed at:** `https://civicbench-api.akintomiwaposi.workers.dev`

**What it does:**
| Route | Method | What it does |
|-------|--------|-------------|
| `/api/register` | POST | Create new user account (PBKDF2 password hash) |
| `/api/login` | POST | Authenticate user, return JWT token |
| `/api/me` | GET | Get current user from JWT |
| `/api/tasks` | GET | List all tasks |
| `/api/tasks` | POST | Create a new task (sponsor only) |
| `/api/tasks/:id` | GET | Get single task details |
| `/api/tasks/:id/claim` | POST | Claim a task (citizen) |
| `/api/submissions` | GET | List submissions |
| `/api/submissions` | POST | Submit completed work |
| `/api/submissions/:id/grade` | POST | Grade/review a submission |
| `/api/wallet/balance` | GET | Get wallet balance |
| `/api/wallet/history` | GET | Get transaction history |
| `/api/wallet/pay/:id` | POST | Pay worker for approved submission |
| `/api/seed` | POST | Seed database with 6 demo users, 8 tasks |
| `/api/health` | GET | Health check |

**Technology:** Pure Cloudflare Workers runtime — zero npm dependencies. Uses Web Crypto API for PBKDF2 password hashing and HMAC-SHA256 JWT signing.

**Required bindings:**
- `DB` → D1 database (`civicbench-db`)
- `JWT_SECRET` → Environment variable (random string)

---

### `civicbench-d1-schema.sql` (1.8 KB) — ⭐ RUN ONCE
SQL schema for the Cloudflare D1 (SQLite) database. Creates all 4 tables the Worker needs.

**Tables created:**
| Table | Purpose |
|-------|---------|
| `users` | Accounts: id, email, password_hash, name, role (citizen/sponsor/partner/reviewer), wallet_balance |
| `tasks` | Civic tasks: id, title, description, type, budget, pay_amount, status, sponsor_id |
| `submissions` | Work submissions: id, task_id, citizen_id, text_content, file_urls, status, grade, reviewer_comment |
| `transactions` | Payment history: id, user_id, amount, type (credit/debit), description, task_id |

**How to use:** Paste into Cloudflare Dashboard → D1 → `civicbench-db` → Query tab → Run.

**Status:** ✅ Only needs to be run once (tables use `IF NOT EXISTS`).

---

## 📁 `civicbench-clean/` — ⭐ THE CURRENT SOURCE CODE
The clean, minimal project directory that was zipped into `civicbench-clean.zip`. This is the **only source code directory you need going forward**.

### Root Config Files

| File | Purpose |
|------|---------|
| `package.json` | 15 dependencies only (React, Vite, Tailwind, radix-ui, lucide). Build script: `vite build`. No backend deps. |
| `vite.config.ts` | Vite config — React plugin, `@/` path alias, outputs to `dist/` |
| `tsconfig.json` | TypeScript root config — references app and node configs |
| `tsconfig.app.json` | TS config for frontend code — loose strictness (no strict null checks, no unused warnings) to prevent build failures |
| `tsconfig.node.json` | TS config for `vite.config.ts` |
| `tailwind.config.js` | Tailwind CSS config with CivicBench brand colors (blue #0047AB, green #00843D, slate #1B2A4A) |
| `postcss.config.js` | PostCSS config — processes Tailwind + autoprefixer |
| `index.html` | HTML entry point — loads `src/main.tsx`, references `logo.png` |
| `.gitignore` | Ignores `node_modules`, `dist`, `.env`, logs |

### `src/` — React Source Code

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry point — renders `<App>` inside `<BrowserRouter>` |
| `src/App.tsx` | Route definitions — `/` (landing) + `/app/*` (all app pages) |
| `src/index.css` | Tailwind directives + CSS custom properties (light theme colors) |

### `src/lib/` — Utilities

| File | Purpose |
|------|---------|
| `src/lib/utils.ts` | The `cn()` helper — merges Tailwind classes. Used by all shadcn/ui components. |

### `src/providers/` — API Client

| File | Purpose |
|------|---------|
| `src/providers/api.ts` | HTTP client that talks to the Worker backend. All API calls (login, register, tasks, submissions, wallet). Automatically attaches JWT token from `localStorage`. |

### `src/hooks/` — React Hooks

| File | Purpose |
|------|---------|
| `src/hooks/useAuth.ts` | Authentication hook — checks JWT on mount, provides `user`, `isAuthenticated`, `logout`, and role checks (`isSponsor`, `isReviewer`). |

### `src/components/ui/` — UI Components (shadcn/ui subset)

| File | Purpose |
|------|---------|
| `src/components/ui/button.tsx` | Button with variants (default, outline, ghost, destructive, link) and sizes (sm, default, lg, icon) |
| `src/components/ui/input.tsx` | Text input with Tailwind styling |
| `src/components/ui/label.tsx` | Form label (Radix UI) |
| `src/components/ui/textarea.tsx` | Multi-line text input |
| `src/components/ui/separator.tsx` | Horizontal/vertical divider line |

### `src/pages/` — Page Components

| File | Route | Purpose |
|------|-------|---------|
| `src/pages/landing.tsx` | `/` | Public landing page — hero, how it works, features, roles, CTA, footer |
| `src/pages/app/AppLayout.tsx` | `/app/*` | Shared layout — sidebar nav, mobile menu, auth guard (redirects to login if not authenticated) |
| `src/pages/app/Login.tsx` | `/app/login` | Login form + demo account quick-fill buttons |
| `src/pages/app/Register.tsx` | `/app/register` | Registration form with role selection (citizen/sponsor/partner/reviewer) |
| `src/pages/app/Dashboard.tsx` | `/app` | Dashboard — stats cards (tasks, wallet, completed), recent tasks list, how-it-works banner |
| `src/pages/app/Tasks.tsx` | `/app/tasks` | Task browser — search, filter by category, task cards with status badges |
| `src/pages/app/TaskDetail.tsx` | `/app/tasks/:id` | Task detail — full description, claim button (citizens), submit form (claimed tasks), status banners |
| `src/pages/app/CreateTask.tsx` | `/app/tasks/create` | Create task form (sponsors) — title, description, category, location, reward, deadline |
| `src/pages/app/Submissions.tsx` | `/app/submissions` | Submissions list — pending/approved/rejected, review form for reviewers |
| `src/pages/app/Reviews.tsx` | `/app/reviews` | Reviewed submissions — approved/rejected with feedback (reviewer role only) |
| `src/pages/app/Wallet.tsx` | `/app/wallet` | Wallet — balance display, transaction history, "Seed Demo Funds" button |

### `functions/` — Cloudflare Pages Functions

| File | Purpose |
|------|---------|
| `functions/api/[[path]].ts` | **API proxy** — catches all `/api/*` requests on the Pages domain and forwards them to the Worker at `civicbench-api.akintomiwaposi.workers.dev`. This lets the frontend call `/api/login` on the same domain instead of a cross-origin request. |

---

## 📁 `app/` — OLD FULL-STACK PROJECT (do not use for deployment)
The original full-stack project created by the webapp-building + backend-building skills. This has **80+ dependencies** including tRPC, Drizzle ORM, Hono, MySQL — all of which caused the Cloudflare Pages build to crash.

### Config Files in `app/`

| File | Purpose | Status |
|------|---------|--------|
| `package.json` | 80+ dependencies (React, tRPC, Drizzle, Hono, MySQL, bcryptjs, jsonwebtoken, etc.) | ⚠️ Too heavy for Pages |
| `package-lock.json` | Lock file for exact dependency versions | ⚠️ Not needed |
| `vite.config.ts` | Vite config with Hono dev server plugin + `@contracts` + `@db` aliases | ⚠️ Has backend plugins |
| `tsconfig.json` | Root TS config — references app, node, and **server** configs | ⚠️ Has server config |
| `tsconfig.app.json` | TS config for frontend — strict mode enabled | ⚠️ Strict mode caused build errors |
| `tsconfig.node.json` | TS config for Vite config file | ℹ️ Same as clean version |
| `tsconfig.server.json` | TS config for backend code (`api/`, `contracts/`, `db/`) | ⚠️ Backend-only |
| `tailwind.config.js` | Tailwind config with CivicBench colors + shadcn theme | ℹ️ Same as clean version |
| `tailwind.config.js.bak` | Backup of original Tailwind config before customization | 🗑️ Backup, can delete |
| `postcss.config.js` | PostCSS with Tailwind + autoprefixer | ℹ️ Same as clean version |
| `components.json` | shadcn/ui component config (style, aliases, icon library) | ℹ️ Only needed if adding more shadcn components |
| `eslint.config.js` | ESLint config for code linting | ℹ️ Dev-only, not needed for deploy |
| `.prettierrc` | Prettier formatting rules | ℹ️ Dev-only |
| `.prettierignore` | Files to skip when formatting | ℹ️ Dev-only |
| `.dockerignore` | Files to exclude from Docker builds | 🗑️ Not needed |
| `.gitignore` | Git ignore rules | ℹ️ Same concept as clean version |
| `.env` | Environment variables (database URL, OAuth credentials) | 🔒 Private, do not commit |
| `.env.example` | Template showing required env vars | ℹ️ Reference only |
| `.backend-features.json` | Tracks which backend features are installed (db, auth) | 🗑️ Backend-only |
| `info.md` | Auto-generated setup info from webapp-building skill | ℹ️ Reference only |
| `README.md` | Project readme | ℹ️ Can reuse |
| `index.html` | HTML entry point | ℹ️ Same as clean version |

### Backend Directories in `app/`

| Directory | Purpose | Status |
|-----------|---------|--------|
| `api/` | Hono + tRPC server code (boot.ts, router, routers for auth/tasks/submissions/wallet) | ⚠️ Replaced by `civicbench-worker.js` |
| `contracts/` | Shared TypeScript types between frontend and tRPC backend | ⚠️ tRPC-only |
| `db/` | Drizzle ORM schema, migrations, seed script for MySQL | ⚠️ Replaced by D1 + `civicbench-d1-schema.sql` |
| `drizzle.config.ts` | Drizzle Kit config for MySQL migrations | ⚠️ MySQL-only |

### Frontend Directories in `app/`

| Directory | Purpose | Status |
|-----------|---------|--------|
| `src/` | React source code (pages, components, hooks, providers) | ℹ️ Pages were copied to `civicbench-clean/` |
| `src/sections/` | Template sections from webapp-building skill | 🗑️ Not used |
| `src/types/` | TypeScript type definitions | 🗑️ Not used |
| `src/App.css` | App-specific CSS | 🗑️ Minimal, not needed |
| `src/*.bak` | Backup files from theme switch | 🗑️ Can delete |
| `public/` | Static assets — contains `logo.png` | ⭐ Logo needed |
| `dist/` | Build output from `vite build` | 🗑️ Auto-generated |
| `node_modules/` | Installed npm packages | 🗑️ Auto-generated, never commit |
| `vitest.config.ts` | Vitest test runner config | ℹ️ Dev-only |

---

## 📁 `civicbench-deploy/` — OLD BUILD OUTPUT (do not use)
The compiled build output from the very first dark-themed deployment. This was uploaded manually to Cloudflare Pages before GitHub integration.

| File | Purpose |
|------|---------|
| `index.html` | Compiled HTML with script/link tags pointing to hashed assets |
| `_redirects` | Cloudflare Pages SPA routing rule: `/* → /index.html 200` — makes client-side routing work |
| `assets/` | Contains compiled `index-B-4iE363.js` and `index-CA6zBjCv.css` |

**Status:** ⚠️ Outdated — dark theme, old code.

---

## 📁 `civicbench-site/` — OLD KIMI.PAGE MIRROR (do not use)
A local mirror of the original site hosted at `42nsxu6kfmm6a.kimi.page` (the first version of the CivicBench site).

| File | Purpose |
|------|---------|
| `index.html` | Redirects to the `42nsxu6kfmm6a.kimi.page/` subdirectory |
| `42nsxu6kfmm6a.kimi.page/` | Contains the compiled assets from the original dark-themed build |
| `42nsxu6kfmm6a.kimi.page/index.html` | HTML with Kimi SDK script tag |
| `42nsxu6kfmm6a.kimi.page/assets/` | Compiled JS and CSS bundles |

**Status:** ⚠️ Historical reference only.

---

## 📋 Summary: What You Need vs What You Can Delete

### ⭐ KEEP — These are your current working files:
| File/Folder | Why |
|-------------|-----|
| `civicbench-clean/` | Source code for the current app |
| `civicbench-clean.zip` | The zip you uploaded to GitHub |
| `civicbench-worker.js` | Backend API (deployed on Cloudflare) |
| `civicbench-d1-schema.sql` | Database schema (run once on D1) |
| `app/public/logo.png` | Your CivicBench logo |

### 🗑️ CAN DELETE — Old or intermediate files:
| File/Folder | Why |
|-------------|-----|
| `civicbench-cloudflare-deploy.zip` | First dark-theme deploy, outdated |
| `civicbench-light-theme.zip` | Landing page only, outdated |
| `civicbench-frontend.zip` | Built from `/app` with backend deps, causes crashes |
| `civicbench-deploy/` | Old dark-theme build output |
| `civicbench-site/` | Old kimi.page mirror |
| `app/` (entire folder) | Full-stack project with 80+ deps — replaced by clean version |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  civicbench.org                      │
│                (Cloudflare Pages)                    │
│                                                      │
│   React App (from civicbench-clean/)                 │
│   ├── Landing page (/)                               │
│   ├── App dashboard (/app)                           │
│   ├── Login/Register (/app/login, /app/register)     │
│   ├── Tasks (/app/tasks)                             │
│   ├── Submissions (/app/submissions)                 │
│   ├── Reviews (/app/reviews)                         │
│   └── Wallet (/app/wallet)                           │
│                                                      │
│   functions/api/[[path]].ts  ←── Proxy              │
│   (forwards /api/* to Worker)                        │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│         civicbench-api.akintomiwaposi.workers.dev    │
│              (Cloudflare Worker)                     │
│                                                      │
│   civicbench-worker.js                               │
│   ├── Auth (register, login, JWT)                    │
│   ├── Tasks (CRUD, claim)                            │
│   ├── Submissions (submit, grade)                    │
│   ├── Wallet (balance, history, payments)            │
│   └── Seed (demo data)                               │
│                                                      │
│   Bindings:                                          │
│   ├── DB → civicbench-db (D1 SQLite)                │
│   └── JWT_SECRET → Environment variable              │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│              civicbench-db (Cloudflare D1)           │
│                                                      │
│   Tables: users, tasks, submissions, transactions    │
│   Schema: civicbench-d1-schema.sql                   │
└─────────────────────────────────────────────────────┘
```
