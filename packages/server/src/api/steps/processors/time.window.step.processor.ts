/* eslint-disable no-case-declarations */
import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  OnWorkerEvent,
} from '@nestjs/bullmq';
import { Job, MetricsTime, Queue } from 'bullmq';
import { StepType } from '../types/step.interface';
import { Step } from '../entities/step.entity';
import { Account } from '../../accounts/entities/accounts.entity';
import * as _ from 'lodash';
import * as Sentry from '@sentry/node';
import { JourneyLocationsService } from '../../journeys/journey-locations.service';
import { StepsService } from '../steps.service';
import { Journey } from '../../journeys/entities/journey.entity';
import { JourneyLocation } from '../../journeys/entities/journey-location.entity';
import { CacheService } from '../../../common/services/cache.service';
import { Temporal } from '@js-temporal/polyfill';
import { Processor } from '../../../common/services/queue/decorators/processor';
import { ProcessorBase } from '../../../common/services/queue/classes/processor-base';
import { QueueType } from '../../../common/services/queue/types/queue-type';
import { Producer } from '../../../common/services/queue/classes/producer';
import { Customer } from '../../customers/entities/customer.entity';

@Injectable()
@Processor('time.window.step')
export class TimeWindowStepProcessor extends ProcessorBase {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @Inject(JourneyLocationsService)
    private journeyLocationsService: JourneyLocationsService,
    @Inject(StepsService) private stepsService: StepsService,
    @Inject(CacheService) private cacheService: CacheService,
  ) {
    super();
  }

  log(message, method, session, user = 'ANONYMOUS') {
    this.logger.log(
      message,
      JSON.stringify({
        class: TimeWindowStepProcessor.name,
        method: method,
        session: session,
        user: user,
      })
    );
  }
  debug(message, method, session, user = 'ANONYMOUS') {
    this.logger.debug(
      message,
      JSON.stringify({
        class: TimeWindowStepProcessor.name,
        method: method,
        session: session,
        user: user,
      })
    );
  }
  warn(message, method, session, user = 'ANONYMOUS') {
    this.logger.warn(
      message,
      JSON.stringify({
        class: TimeWindowStepProcessor.name,
        method: method,
        session: session,
        user: user,
      })
    );
  }
  error(error, method, session, user = 'ANONYMOUS') {
    this.logger.error(
      error.message,
      error.stack,
      JSON.stringify({
        class: TimeWindowStepProcessor.name,
        method: method,
        session: session,
        cause: error.cause,
        name: error.name,
        user: user,
      })
    );
  }
  verbose(message, method, session, user = 'ANONYMOUS') {
    this.logger.verbose(
      message,
      JSON.stringify({
        class: TimeWindowStepProcessor.name,
        method: method,
        session: session,
        user: user,
      })
    );
  }

  async process(
    job: Job<
      {
        step: Step;
        owner: Account;
        journey: Journey;
        customer: Customer;
        location: JourneyLocation;
        session: string;
        event?: string;
        branch?: number;
        stepDepth: number;
      },
      any,
      string
    >
  ): Promise<any> {
    return Sentry.startSpan(
      { name: 'TimeWindowStepProcessor.process' },
      async () => {
        let nextJob, nextStep;
        let moveCustomer = false;

        // Case 1: Specific days of the week
        if (job.data.step.metadata.window.onDays) {
          const now = new Date();

          const startTime = new Date(now.getTime());
          startTime.setHours(
            job.data.step.metadata.window.fromTime.split(':')[0]
          );
          startTime.setMinutes(
            job.data.step.metadata.window.fromTime.split(':')[1]
          );

          const endTime = new Date(now.getTime());
          endTime.setHours(job.data.step.metadata.window.toTime.split(':')[0]);
          endTime.setMinutes(
            job.data.step.metadata.window.toTime.split(':')[1]
          );

          const day = now.getDay();

          if (
            startTime < now &&
            endTime > now &&
            job.data.step.metadata.window.onDays[day] === 1
          ) {
            moveCustomer = true;
          }
        }
        // Case2: Date and time of window
        else {
          if (
            new Date(
              Temporal.Instant.from(
                job.data.step.metadata.window.from
              ).epochMilliseconds
            ).getTime() < Date.now() &&
            Date.now() <
              new Date(
                Temporal.Instant.from(
                  job.data.step.metadata.window.to
                ).epochMilliseconds
              ).getTime()
          ) {
            moveCustomer = true;
          }
        }
        if (moveCustomer) {
          nextStep = await this.cacheService.getIgnoreError(
            Step,
            job.data.step.metadata.destination,
            async () => {
              return await this.stepsService.lazyFindByID(
                job.data.step.metadata.destination
              );
            }
          );

          if (nextStep) {
            const nextStepDepth: number =
              Producer.getNextStepDepthFromJob(job);

            if (
              nextStep.type !== StepType.TIME_DELAY &&
              nextStep.type !== StepType.TIME_WINDOW &&
              nextStep.type !== StepType.WAIT_UNTIL_BRANCH
            ) {
              nextJob = {
                owner: job.data.owner,
                journey: job.data.journey,
                step: nextStep,
                session: job.data.session,
                customer: job.data.customer,
                location: job.data.location,
                event: job.data.event,
                stepDepth: nextStepDepth,
              };
            } else {
              // Destination is time based,
              // customer has stopped moving so we can release lock
              await this.journeyLocationsService.unlock(
                job.data.location,
                nextStep
              );
            }
          } else {
            // Destination does not exist,
            // customer has stopped moving so we can release lock
            await this.journeyLocationsService.unlock(
              job.data.location,
              job.data.step
            );
          }
        } else {
          // Not yet time to move customer,
          // customer has stopped moving so we can release lock
          await this.journeyLocationsService.unlock(
            job.data.location,
            job.data.step
          );
        }
        if (nextStep && nextJob)
          await Producer.addByStepType(nextStep.type, nextJob);
      }
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error, prev?: string) {
    Sentry.withScope((scope) => {
      scope.setTag('job_id', job.id);
      scope.setTag('processor', TimeWindowStepProcessor.name);
      Sentry.captureException(error);
    });
  }
}
