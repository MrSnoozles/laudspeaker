import {
  OnModuleDestroy,
  Injectable,
  Logger
} from '@nestjs/common';
import {
  createClient,
  QueryParams,
  QueryResult,
  InsertParams,
  InsertResult,
  ClickHouseSettings,
  ResultSet,
  type DataFormat
} from '@clickhouse/client';

import {
  QueryParamsWithFormat
} from '@clickhouse/client-common'

@Injectable()
export class ClickHouseClient implements OnModuleDestroy {
  private client;

  private readonly insertAsyncSettings: ClickHouseSettings = {
    date_time_input_format: 'best_effort',
    async_insert: 1,
    wait_for_async_insert: 1,
    async_insert_max_data_size:
      process.env.CLICKHOUSE_MESSAGE_STATUS_ASYNC_MAX_SIZE
      ?? '1000000',
    async_insert_busy_timeout_ms: 
      process.env.CLICKHOUSE_MESSAGE_STATUS_ASYNC_TIMEOUT_MS ?
      +process.env.CLICKHOUSE_MESSAGE_STATUS_ASYNC_TIMEOUT_MS :
      1000,
  };

  constructor(options: any) {
    this.client = createClient(options);
  }

  query<Format extends DataFormat = 'JSON'>(
    params: QueryParamsWithFormat<Format>,
  ): Promise<QueryResult<Format>> {
    return this.client.query(params) as Promise<ResultSet<Format>>
  }

  async insert(params: InsertParams): Promise<InsertResult> {
    return this.client.insert(params);
  }

  async insertAsync(params: InsertParams): Promise<InsertResult> {
    const insertOptions: InsertParams = {
      ...params,
      clickhouse_settings: {
        ...this.insertAsyncSettings
      },
    };

    return this.insert(insertOptions);
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
