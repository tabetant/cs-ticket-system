# CS Ticket System

> Internal support ticketing for property management. Tenants submit a request, support staff drag it across an Open / In Progress / Resolved / Closed board, and Resend mails the tenant on every status change.

*Built as the capstone of my software engineering internship at [Aspire Software](https://www.aspiresoftware.com/).*

[![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Resend](https://img.shields.io/badge/Resend-emails-000000?style=flat-square&logo=resend&logoColor=white)](https://resend.com)
![Last commit](https://img.shields.io/github/last-commit/tabetant/cs-ticket-system?style=flat-square)

## ✨ Features
- **Tenant submission flow.** Public form at `/` with title, description, contact info, and optional image attachments. Validated client-side with React Hook Form + Zod, mobile-first.
- **Support dashboard with drag-and-drop.** Login-only `/support` page. Staff drag tickets across Open / In Progress / Resolved / Closed columns to update status.
- **Audit trail per ticket.** Every status change is captured (who, when, from, to) and surfaced as a Popover history on the ticket card.
- **Resend email notifications.** Tenants get a styled React Email when their ticket changes status. Templates live next to the routes that fire them.
- **Auth-gated API.** Every mutation runs through Supabase SSR auth. Staff are whitelisted at the database layer, not just the UI.

## 🏗 Architecture

```mermaid
flowchart LR
    TENANT[Tenant browser] --> NEXT[Next.js App Router]
    STAFF[Staff browser] --> NEXT
    NEXT -->|"@supabase/ssr"| AUTH[Supabase Auth]
    NEXT -->|Drizzle ORM| DB[(Postgres on Supabase)]
    NEXT -->|status change| RESEND[Resend]
    RESEND --> INBOX[Tenant inbox]
    DB --> LOGS[Status history table]
```

The status history table is append-only. Every drag-and-drop update writes a new row before the ticket's `status` column flips, so the Popover history never loses prior states.

## 🛠 Stack
- Next.js 15 (App Router, Turbopack), React 19, TypeScript strict
- Supabase Auth via `@supabase/ssr`, Supabase Postgres as the database
- Drizzle ORM (`drizzle.config.ts`) + `postgres` driver
- Tailwind v4, Radix primitives (Dropdown, Popover, Select, Navigation), Remix Icons
- React Hook Form + Zod for validation
- React Draggable for the kanban board
- Resend + React Email for tenant notifications

## 🚀 Getting started

```bash
git clone https://github.com/tabetant/cs-ticket-system.git
cd cs-ticket-system
npm install

# Set up environment variables
cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=postgres://...
RESEND_API_KEY=...
EOF

# Push the Drizzle schema to your Supabase Postgres
npx drizzle-kit push

npm run dev
```

Then open `http://localhost:3000` for the tenant view, or `/support` to log into the staff dashboard.

## 📁 Key files

```
src/app/             # App Router routes (tenant form, support dashboard, API)
src/db/              # Drizzle schema, query helpers
drizzle/             # Generated migrations
drizzle.config.ts    # Drizzle Kit config
```

## 📸 Demo

Live deployment: TBD. Screenshots: TBD.

## 👤 Author

**Antoine Tabet**, UofT Computer Engineering
[LinkedIn](https://linkedin.com/in/antoinetabetuoft) · [antoine.tabet@mail.utoronto.ca](mailto:antoine.tabet@mail.utoronto.ca) · [GitHub](https://github.com/tabetant)
