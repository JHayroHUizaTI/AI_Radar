create extension if not exists pgcrypto;

create table if not exists sources_snapshot (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_url text not null,
  category text not null,
  subagent text not null,
  status text not null default 'active',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (source_url)
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  canonical_url text not null,
  source text not null,
  fingerprint text not null,
  evidence text not null,
  impact text not null,
  action text not null,
  status text not null default 'pending',
  published_at text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (canonical_url),
  unique (fingerprint)
);

create table if not exists ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  run_type text not null,
  status text not null default 'pending',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  summary jsonb not null default '{}'::jsonb,
  error text
);

alter table sources_snapshot enable row level security;
alter table signals enable row level security;
alter table ingestion_runs enable row level security;
