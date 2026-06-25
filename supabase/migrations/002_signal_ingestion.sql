alter table signals
  alter column published_at type timestamptz
  using nullif(published_at, '')::timestamptz;

create index if not exists signals_published_at_idx
  on signals (published_at desc);

create index if not exists signals_status_published_at_idx
  on signals (status, published_at desc);

create index if not exists signals_source_idx
  on signals (source);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'signals_status_check'
  ) then
    alter table signals
      add constraint signals_status_check
      check (status in ('verified', 'pending', 'rejected'));
  end if;
end
$$;

create or replace function ingest_signals(payload jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  run_id uuid;
  item jsonb;
  existing signals%rowtype;
  canonical_url_value text;
  fingerprint_value text;
  published_at_value timestamptz;
  inserted_count integer := 0;
  updated_count integer := 0;
  duplicated_count integer := 0;
  rejected_count integer := 0;
  pending_count integer := 0;
  changed boolean;
  result jsonb;
begin
  if jsonb_typeof(payload) <> 'array' then
    raise exception 'payload must be a JSON array';
  end if;

  insert into ingestion_runs (run_type, status, summary)
  values ('signals_json', 'running', jsonb_build_object('received', jsonb_array_length(payload)))
  returning id into run_id;

  for item in select value from jsonb_array_elements(payload)
  loop
    canonical_url_value := coalesce(item->>'canonical_url', item->>'url');
    fingerprint_value := coalesce(item->>'fingerprint', item->>'dedupe_key');

    if coalesce(item->>'title', '') = ''
      or coalesce(item->>'source', '') = ''
      or coalesce(canonical_url_value, '') = ''
      or coalesce(fingerprint_value, '') = ''
      or coalesce(item->>'evidence', '') = ''
      or coalesce(item->>'impact', '') = ''
      or coalesce(item->>'action', '') = ''
      or coalesce(item->>'status', '') not in ('verified', 'pending', 'rejected')
    then
      rejected_count := rejected_count + 1;
      continue;
    end if;

    begin
      published_at_value := nullif(item->>'published_at', '')::timestamptz;
    exception when others then
      rejected_count := rejected_count + 1;
      continue;
    end;

    select *
    into existing
    from signals
    where fingerprint = fingerprint_value
       or canonical_url = canonical_url_value
    order by (fingerprint = fingerprint_value) desc
    limit 1;

    if found then
      changed :=
        existing.title is distinct from item->>'title'
        or existing.canonical_url is distinct from canonical_url_value
        or existing.source is distinct from item->>'source'
        or existing.fingerprint is distinct from fingerprint_value
        or existing.evidence is distinct from item->>'evidence'
        or existing.impact is distinct from item->>'impact'
        or existing.action is distinct from item->>'action'
        or existing.status is distinct from item->>'status'
        or existing.published_at is distinct from published_at_value;

      if changed then
        update signals
        set title = item->>'title',
            canonical_url = canonical_url_value,
            source = item->>'source',
            fingerprint = fingerprint_value,
            evidence = item->>'evidence',
            impact = item->>'impact',
            action = item->>'action',
            status = item->>'status',
            published_at = published_at_value,
            updated_at = now()
        where id = existing.id;
        updated_count := updated_count + 1;
      else
        duplicated_count := duplicated_count + 1;
      end if;
    else
      begin
        insert into signals (
          title,
          canonical_url,
          source,
          fingerprint,
          evidence,
          impact,
          action,
          status,
          published_at
        )
        values (
          item->>'title',
          canonical_url_value,
          item->>'source',
          fingerprint_value,
          item->>'evidence',
          item->>'impact',
          item->>'action',
          item->>'status',
          published_at_value
        );
        inserted_count := inserted_count + 1;
      exception when unique_violation then
        duplicated_count := duplicated_count + 1;
      end;
    end if;

    if item->>'status' = 'pending' then
      pending_count := pending_count + 1;
    end if;
  end loop;

  result := jsonb_build_object(
    'run_id', run_id,
    'inserted', inserted_count,
    'updated', updated_count,
    'duplicated', duplicated_count,
    'rejected', rejected_count,
    'pending', pending_count
  );

  update ingestion_runs
  set status = 'completed',
      finished_at = now(),
      summary = result
  where id = run_id;

  return result;
end;
$$;

revoke all on function ingest_signals(jsonb) from public;
grant execute on function ingest_signals(jsonb) to service_role;
