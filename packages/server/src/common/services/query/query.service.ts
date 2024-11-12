import { Inject, Injectable } from '@nestjs/common';
import { BaseLaudspeakerService } from '@/common/services/base.laudspeaker.service';

@Injectable()
export class QueryService extends BaseLaudspeakerService {
  constructor() {
    super();
  }
}
