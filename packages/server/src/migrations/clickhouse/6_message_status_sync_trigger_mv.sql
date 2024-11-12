DROP TABLE IF EXISTS event_sync_trigger;
CREATE MATERIALIZED VIEW message_status_sync_trigger TO message_status_pg_sync
AS SELECT
    now64() as pg_sync_published_at,
    *
FROM message_status;
