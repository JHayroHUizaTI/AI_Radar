grant usage on schema public to service_role;

grant select, insert, update on table public.signals to service_role;
grant select, insert, update on table public.ingestion_runs to service_role;

grant execute on function public.ingest_signals(jsonb) to service_role;
