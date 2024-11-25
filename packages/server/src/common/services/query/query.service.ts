import { Inject, Injectable } from '@nestjs/common';
import { BaseLaudspeakerService } from '@/common/services/base.laudspeaker.service';
import { Query, JSONConverter } from './';

@Injectable()
export class QueryService extends BaseLaudspeakerService {
  constructor() {
    super();
  }

  fromJSON(jsonQuery: Record<string, any>): Query {
    const converter = new JSONConverter(jsonQuery);

    const query = converter.toQuery();

    return query;
  }

}
