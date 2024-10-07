import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from '../templates/entities/template.entity';
import { Installation } from '../slack/entities/installation.entity';
import { State } from '../slack/entities/state.entity';
import { Account } from '../accounts/entities/accounts.entity';
import { CustomersModule } from '../customers/customers.module';
import { TemplatesModule } from '../templates/templates.module';
import { SlackModule } from '../slack/slack.module';
import { Filter } from '../filter/entities/filter.entity';
import { SegmentsModule } from '../segments/segments.module';
import { JourneysController } from './journeys.controller';
import { JourneysService } from './journeys.service';
import { Journey } from './entities/journey.entity';
import { StepsModule } from '../steps/steps.module';
import { JourneyLocation } from './entities/journey-location.entity';
import { JourneyLocationsService } from './journey-locations.service';
import { JourneyChange } from './entities/journey-change.entity';
import { CacheService } from '../../common/services/cache.service';
import { JourneyStatisticsService } from './journey-statistics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Event } from '../events/schemas/event.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Installation,
      Filter,
      State,
      Template,
      Journey,
      JourneyLocation,
      JourneyChange,
    ]),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
    ]),
    forwardRef(() => CustomersModule),
    forwardRef(() => StepsModule),
    forwardRef(() => SegmentsModule),
    forwardRef(() => TemplatesModule),
    SlackModule,
  ],
  controllers: [JourneysController],
  providers: [
    JourneysService,
    JourneyLocationsService,
    CacheService,
    JourneyStatisticsService
  ],
  exports: [JourneysService],
})
export class JourneysModule { }
