create extension if not exists pgcrypto;

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('battle','person','chronology','un','memorial')),
  difficulty text not null default 'normal' check (difficulty = 'normal'),
  question text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  correct_answer_index integer not null check (correct_answer_index between 0 and 3),
  explanation text not null,
  source_title text,
  source_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  client_run_id text not null,
  category text not null check (category in ('mixed','battle','person','chronology','un','memorial')),
  difficulty text not null default 'normal' check (difficulty = 'normal'),
  total_questions integer not null check (total_questions between 1 and 20),
  score integer not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'array'),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (session_id, client_run_id),
  check (score >= 0 and score <= total_questions)
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  quiz_attempt_id uuid references public.quiz_attempts(id) on delete set null,
  session_id text not null,
  nickname text not null default '익명' check (char_length(nickname) <= 12),
  content text not null check (char_length(content) >= 50),
  ai_draft_used boolean not null default false,
  related_category text check (related_category in ('mixed','battle','person','chronology','un','memorial')),
  moderation_status text not null default 'approved' check (moderation_status in ('approved','pending','hidden','rejected')),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.letters drop constraint if exists letters_content_check;
alter table public.letters drop constraint if exists letters_content_min_length_check;
alter table public.letters
  add constraint letters_content_min_length_check check (char_length(content) >= 50);

alter table public.quiz_attempts drop constraint if exists quiz_attempts_category_check;
alter table public.quiz_attempts
  add constraint quiz_attempts_category_check check (category in ('mixed','battle','person','chronology','un','memorial'));

alter table public.letters drop constraint if exists letters_related_category_check;
alter table public.letters
  add constraint letters_related_category_check check (related_category in ('mixed','battle','person','chronology','un','memorial'));

create index if not exists quiz_questions_lookup_idx on public.quiz_questions(category, difficulty, is_active);
create index if not exists quiz_attempts_completed_idx on public.quiz_attempts(completed_at desc);
create index if not exists letters_public_idx on public.letters(moderation_status, is_public, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists letters_set_updated_at on public.letters;
create trigger letters_set_updated_at before update on public.letters
for each row execute function public.set_updated_at();

alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.letters enable row level security;

revoke all on public.quiz_questions from anon, authenticated;
revoke all on public.quiz_attempts from anon, authenticated;
revoke all on public.letters from anon, authenticated;
