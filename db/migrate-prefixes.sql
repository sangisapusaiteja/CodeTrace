-- ============================================================
-- TABLE PREFIX MIGRATION — shared Supabase DB
-- Run this ONCE in the Supabase SQL editor.
--
-- Renames tables so each project's tables carry a distinct prefix:
--   CodeTrace         -> ct_*
--   InterviewHandbook -> ih_*
--   CodeBattle        -> cb_*
-- The shared `users` table stays unprefixed.
--
-- NOTE: RLS policies and triggers are NOT renamed by ALTER TABLE,
-- but they keep working because they follow the table object.
-- The `user_progress_dashboard` VIEW and the realtime publication
-- reference table names by string, so they are recreated below.
-- ============================================================

-- ------------------------------------------------------------------
-- 1) CODETRACE  (ct_*)
-- ------------------------------------------------------------------
alter table public.viz_categories        rename to ct_categories;
alter table public.viz_problems          rename to ct_problems;
alter table public.viz_problem_versions  rename to ct_problem_versions;
alter table public.viz_user_progress     rename to ct_user_progress;

-- ------------------------------------------------------------------
-- 2) INTERVIEW HANDBOOK  (ih_*)
-- ------------------------------------------------------------------
alter table public.categories            rename to ih_categories;
alter table public.modules               rename to ih_modules;
alter table public.topics                rename to ih_topics;
alter table public.interview_questions   rename to ih_interview_questions;
alter table public.user_topic_progress   rename to ih_user_topic_progress;
alter table public.user_preferences      rename to ih_user_preferences;

-- Recreate the dashboard view (it referenced the old table name).
drop view if exists public.user_progress_dashboard;
create or replace view public.user_progress_dashboard as
select
  user_id,
  count(*) filter (where completed) as completed_topics,
  max(last_opened_at) as last_opened_at,
  max(completed_at) as last_completed_at,
  max(updated_at) as last_activity_at
from public.ih_user_topic_progress
group by user_id;

-- ------------------------------------------------------------------
-- 3) CODE BATTLE  (cb_*)
-- ------------------------------------------------------------------
alter table public.problems             rename to cb_problems;
alter table public.problem_test_cases   rename to cb_problem_test_cases;
alter table public.matches              rename to cb_matches;
alter table public.match_problems       rename to cb_match_problems;
alter table public.match_players        rename to cb_match_players;
alter table public.submissions          rename to cb_submissions;
alter table public.ratings              rename to cb_ratings;

-- Re-add the renamed tables to the realtime publication.
-- (The old names are no longer members; adding the new names is safe.)
do $$
begin
  alter publication supabase_realtime add table public.cb_matches;
  alter publication supabase_realtime add table public.cb_match_players;
  alter publication supabase_realtime add table public.cb_submissions;
exception
  when duplicate_object then null; -- already a member
end
$$;

-- ============================================================
-- VERIFY — should list the new prefixed names.
-- ============================================================
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'ct_categories','ct_problems','ct_problem_versions','ct_user_progress',
    'ih_categories','ih_modules','ih_topics','ih_interview_questions',
    'ih_user_topic_progress','ih_user_preferences','ih_user_progress_dashboard',
    'cb_problems','cb_problem_test_cases','cb_matches','cb_match_problems',
    'cb_match_players','cb_submissions','cb_ratings'
  )
order by table_name;
