create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select cron.schedule(
  'resuma-daily-data-retention',
  '17 3 * * *',
  $retention$
    delete from public.analytics_events
    where created_at < now() - interval '90 days';

    delete from public.pilot_applications
    where status in ('new', 'reviewing', 'declined')
      and coalesce(last_contact_at, created_at) < now() - interval '180 days';

    delete from public.privacy_requests
    where created_at < now() - interval '24 months';

    delete from cron.job_run_details
    where end_time < now() - interval '30 days';
  $retention$
);
