CREATE TABLE events_pg_sync (
    created_at  Datetime64(6)   DEFAULT now64(),
    event       String          NOT NULL,
) ENGINE = RabbitMQ SETTINGS
rabbitmq_host_port = 'rabbitmq:5672',
rabbitmq_exchange_name = '',
rabbitmq_exchange_type = 'direct',
rabbitmq_format = 'JSONEachRow',
rabbitmq_persistent = 1,
rabbitmq_queue_consume  = 1,
rabbitmq_max_rows_per_message = 100,
rabbitmq_routing_key_list = 'events_pg_sync.pending', 
rabbitmq_queue_base = 'events_pg_sync.pending';