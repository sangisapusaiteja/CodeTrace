# CodeTrace

Watch algorithms run line by line. CodeTrace is an interactive DSA visualizer that steps through common LeetCode-style problems with animated traces, per-approach code highlighting, and live array/hash-map/string visualizations.

## Features

- **Line-by-line tracing** — each algorithm is broken into granular steps with the active source line highlighted.
- **Per-approach visualizers** — every problem ships two distinct approaches, each with its own animation style (pointers, bars, hash maps, sets, grids).
- **Categorized problem library** — Arrays, Strings, Bit Manipulation, Hash Table, and Two Pointers.
- **Google OAuth + email/password auth** — shared `users` table across sibling apps.
- **Supabase-backed** — problems, approach source code, and categories are seeded into Supabase and served via REST.

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` from `.env.example` and fill in your Supabase and Google OAuth credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SESSION_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Apply the schema in `db/schema.sql` to your Supabase project, then seed categories and problems.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # run ESLint
```

## Tech Stack

- **Next.js** (App Router, client components for the visualizer)
- **React 19**
- **Tailwind CSS v4**
- **Supabase** (auth + REST data)
