-- ============================================================
-- English for Work — Database Schema
-- Apply this to Supabase using the MCP apply_migration tool
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  access_type text not null default 'none' check (access_type in ('none', 'beta', 'paid', 'unlimited')),
  is_admin boolean not null default false,
  hotmart_transaction_id text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- ============================================================
-- ROUTES
-- ============================================================
create table public.routes (
  id text primary key,
  title text not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- MODULES
-- ============================================================
create table public.modules (
  id text primary key,
  route_id text not null references public.routes(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- LESSONS
-- ============================================================
create table public.lessons (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  objective text,
  sort_order integer not null default 0,
  content jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- SIMULATIONS
-- ============================================================
create table public.simulations (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  content jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- USER PROGRESS
-- ============================================================
create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text references public.lessons(id) on delete cascade,
  simulation_id text references public.simulations(id) on delete cascade,
  completed boolean not null default false,
  score integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  
  -- Ensure either lesson_id or simulation_id is set, not both
  constraint progress_type_check check (
    (lesson_id is not null and simulation_id is null) or
    (lesson_id is null and simulation_id is not null)
  ),
  -- Prevent duplicate progress entries
  constraint unique_lesson_progress unique (user_id, lesson_id),
  constraint unique_simulation_progress unique (user_id, simulation_id)
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text not null,
  city text,
  display_name text,
  trigger_type text not null check (trigger_type in ('module_complete', 'route_complete')),
  trigger_reference_id text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  show_on_landing boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- BETA INVITES
-- ============================================================
create table public.beta_invites (
  id uuid default uuid_generate_v4() primary key,
  token text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  used_by uuid references public.profiles(id),
  used_at timestamptz
);

-- ============================================================
-- EMAIL LOG
-- ============================================================
create table public.email_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  email_type text not null,
  sent_at timestamptz not null default now(),
  status text not null default 'sent' check (status in ('sent', 'failed', 'bounced')),
  
  -- Prevent sending same email type twice to same user
  constraint unique_email_per_user unique (user_id, email_type)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_modules_route on public.modules(route_id);
create index idx_lessons_module on public.lessons(module_id);
create index idx_simulations_module on public.simulations(module_id);
create index idx_progress_user on public.user_progress(user_id);
create index idx_progress_lesson on public.user_progress(lesson_id);
create index idx_progress_simulation on public.user_progress(simulation_id);
create index idx_testimonials_status on public.testimonials(status);
create index idx_testimonials_landing on public.testimonials(show_on_landing) where show_on_landing = true;
create index idx_beta_invites_token on public.beta_invites(token);
create index idx_email_log_user on public.email_log(user_id);
