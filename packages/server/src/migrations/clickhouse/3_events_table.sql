CREATE TABLE IF NOT EXISTS events
(
  id                  UInt64          DEFAULT generateSnowflakeID(),
  uuid                UUID            DEFAULT generateUUIDv7(),
  created_at          Datetime64(6)   DEFAULT now64(),
  generated_at        Datetime64(6)   NOT NULL,
  correlation_key     String          NOT NULL,
  correlation_value   String          NOT NULL,
  event               String          NOT NULL,
  payload             String          NOT NULL,
  context             String          NOT NULL,
  source              String          NOT NULL,
  workspace_id        UUID            NOT NULL,         
)
ENGINE = MergeTree()
ORDER BY id;

