-- ============================================================
-- VIZ ARENA — database schema
-- Separate project. Shares the unified `users` table with
-- InterviewHandbook and Code Battle. All other tables are new.
-- ============================================================

-- ------------------------------------------------------------------
-- viz_categories — category metadata for the dashboard
-- ------------------------------------------------------------------
create table if not exists public.viz_categories (
  id          text primary key,
  title       text not null,
  description text not null,
  icon        text not null,
  color       text not null,
  sort_order  int not null default 0
);

-- ------------------------------------------------------------------
-- viz_problems — one row per problem
-- ------------------------------------------------------------------
create table if not exists public.viz_problems (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  category_id text not null references public.viz_categories (id) on delete cascade,
  difficulty  text not null check (difficulty in ('easy','medium','hard')),
  description text not null,
  constraints text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists viz_problems_category_idx on public.viz_problems (category_id);

-- ------------------------------------------------------------------
-- viz_problem_versions — each solution source for a problem
-- ------------------------------------------------------------------
create table if not exists public.viz_problem_versions (
  id         uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.viz_problems (id) on delete cascade,
  version_id text not null,          -- e.g. 'brute', 'single'
  name       text not null,          -- e.g. 'Brute Force', 'Single Pass'
  source     text not null,
  sort_order int not null default 0,
  unique (problem_id, version_id)
);

create index if not exists viz_problem_versions_problem_idx
  on public.viz_problem_versions (problem_id);

-- ------------------------------------------------------------------
-- viz_user_progress — which problems a user has completed
-- ------------------------------------------------------------------
create table if not exists public.viz_user_progress (
  user_id     uuid not null references public.users (id) on delete cascade,
  problem_id  uuid not null references public.viz_problems (id) on delete cascade,
  completed   boolean not null default false,
  last_opened_at timestamptz,
  completed_at   timestamptz,
  primary key (user_id, problem_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (anon, matching the other apps' pattern)
-- ============================================================

alter table public.viz_categories         enable row level security;
alter table public.viz_problems           enable row level security;
alter table public.viz_problem_versions   enable row level security;
alter table public.viz_user_progress      enable row level security;

create policy "viz categories readable by all"
  on public.viz_categories for select to anon using (true);
create policy "viz problems readable by all"
  on public.viz_problems for select to anon using (true);
create policy "viz problem versions readable by all"
  on public.viz_problem_versions for select to anon using (true);

-- progress: readable by all, anyone may upsert (server-side via anon key).
create policy "viz progress readable by all"
  on public.viz_user_progress for select to anon using (true);
create policy "viz progress insertable by all"
  on public.viz_user_progress for insert to anon with check (true);
create policy "viz progress updatable by all"
  on public.viz_user_progress for update to anon using (true);

-- ============================================================
-- GOOGLE OAUTH — link Google identities to the shared users table.
-- Same migration as Interview Handbook / Code Battle.
-- ============================================================
alter table public.users add column if not exists google_id text unique;

-- ============================================================
-- AUTH PROVIDER — how the account signs in ('password' | 'google').
-- ============================================================
alter table public.users add column if not exists auth_provider text not null default 'password';
update public.users set auth_provider = 'google' where google_id is not null and auth_provider = 'password';

-- Google-created rows have no password until the user sets one.
alter table public.users alter column password_hash drop not null;
