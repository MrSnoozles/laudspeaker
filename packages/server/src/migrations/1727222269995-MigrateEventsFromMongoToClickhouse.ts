import { MigrationInterface, QueryRunner } from "typeorm"
import { formatMongoConnectionString } from '@/app.module';
import {
  ClickHouseClient,
  ClickHouseTable,
  ClickHouseEvent,
} from '@/common/services/clickhouse';
// import { EventSchema } from '@/api/events/schemas/event.schema';

export class MigrateEventsFromMongoToClickhouse1727222269995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

      const lib = await import('mongoose');
      const mongoose = new lib.Mongoose();

      await this.migrateEvents(queryRunner, mongoose);

      throw "ERROR";
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      throw new Error("Irreversible migration");
    }

    private async migrateEvents(queryRunner: QueryRunner, mongoose): Promise<void> {
      const mg = await mongoose.connect(
        formatMongoConnectionString(process.env.MONGOOSE_URL)
      );

      debugger
      let clickHouseRecord: ClickHouseEvent;
      const clickhouseOptions: Record <string, any> = {
        url: process.env.CLICKHOUSE_HOST
          ? process.env.CLICKHOUSE_HOST.includes('http')
            ? process.env.CLICKHOUSE_HOST
            : `http://${process.env.CLICKHOUSE_HOST}`
          : 'http://localhost:8123',
        username: process.env.CLICKHOUSE_USER ?? 'default',
        password: process.env.CLICKHOUSE_PASSWORD ?? '',
        database: process.env.CLICKHOUSE_DB ?? 'default',
        max_open_connections: process.env.CLICKHOUSE_MAX_OPEN_CONNECTIONS ?? 10,
        keep_alive: { enabled: true }
      }
      const clickhouseClient = new ClickHouseClient(clickhouseOptions);
      const collection = mg.connection.db.collection('events');
      const mongoEvents = await collection.find().toArray();
      const eventsToInsert: ClickHouseEvent[] = [];

      for (let event of mongoEvents) {
        clickHouseRecord = {
          correlation_key: event.correlationKey,
          correlation_value: event.correlationValue,
          created_at: event.createdAt,
          event: event.event,
          payload: event.payload,
          source: event.source,
          timestamp: event.timestamp,
          uuid: event.uuid,
          workspace_id: event.workspaceId,
        };

        eventsToInsert.push(clickHouseRecord);
      }

      await clickhouseClient.insertAsync({
        table: ClickHouseTable.EVENTS,
        values: [clickHouseRecord],
        format: 'JSONEachRow',
      });

      try {
      } catch (error) {
        throw error;
      } finally {
        await mg.disconnect();
      }
    }
}
