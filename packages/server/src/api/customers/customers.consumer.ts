import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EachMessagePayload } from 'kafkajs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { KafkaConsumerService } from '../kafka/consumer.service';
import { CustomersService } from './customers.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CustomersConsumerService implements OnApplicationBootstrap {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly consumerService: KafkaConsumerService,
    @InjectQueue('{customer_change}')
    private readonly customerChangeQueue: Queue
  ) {}

  log(message, method, session, user = 'ANONYMOUS') {
    this.logger.log(
      message,
      JSON.stringify({
        class: CustomersConsumerService.name,
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
        class: CustomersConsumerService.name,
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
        class: CustomersConsumerService.name,
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
        class: CustomersConsumerService.name,
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
        class: CustomersService.name,
        method: method,
        session: session,
        user: user,
      })
    );
  }

  private MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? 'nest'; // Confluent cluster API secret
  private MONGO_CUSTOMERS_TABLE_NAME = 'customers'; // no other way to configure since hardcoded, make sure it matches in CustomersService.constructor
  private MONGO_CHANGE_STREAM_CONSUMER_GROUP = 'laudspeaker-customers-change';

  async onApplicationBootstrap() {
    await this.consumerService.consume(
      { topics: [`${this.MONGO_DB_NAME}.${this.MONGO_CUSTOMERS_TABLE_NAME}`] },
      {
        groupId:
          process.env.NODE_ENV === 'development'
            ? 'development-group'
            : this.MONGO_CHANGE_STREAM_CONSUMER_GROUP,
      },
      {
        eachMessage: this.handleCustomerChangeStream(),
      }
    );
  }

  private handleCustomerChangeStream(this: CustomersConsumerService) {
    return async (changeMessage: EachMessagePayload) => {
      const session = randomUUID();
      try {
        // const threshold = process.env.CUSTOMER_CHANGE_QUEUE_THRESHOLD
        //   ? +process.env.CUSTOMER_CHANGE_QUEUE_THRESHOLD
        //   : 10; // Set the threshold for maximum waiting jobs

        // while (true) {
        //   const jobCounts = await this.customerChangeQueue.getJobCounts('wait');
        //   const waitingJobs = jobCounts.wait;

        //   if (waitingJobs < threshold) {
        //     break; // Exit the loop if the number of waiting jobs is below the threshold
        //   }

        //   this.warn(
        //     `Waiting for the queue to process. Current waiting jobs: ${waitingJobs}`,
        //     this.handleCustomerChangeStream.name,
        //     session
        //   );
        //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Sleep for 1 second before checking again
        // }
        await this.customerChangeQueue.add('change', {
          session,
          changeMessage,
        });
      } catch (err) {
        this.error(err, this.handleCustomerChangeStream.name, session);
      }
    };
  }
}


/*
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

const consumer = kafka.consumer({ groupId: 'my-group' });

let isPaused = false;

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });

      if (shouldPauseConsumption()) {
        await pauseConsumer(partition);
        console.log('Consumer paused');
      }

      if (shouldResumeConsumption() && isPaused) {
        await resumeConsumer(partition);
        console.log('Consumer resumed');
      }
    },
  });
};

const shouldPauseConsumption = () => {
  // Add your condition to pause consumption here
  // For example, based on some external signal or condition
  return true; // Change this condition according to your logic
};

const shouldResumeConsumption = () => {
  // Add your condition to resume consumption here
  // For example, based on some external signal or condition
  return false; // Change this condition according to your logic
};

const pauseConsumer = async (partition) => {
  if (!isPaused) {
    await consumer.pause([{ topic: 'my-topic', partitions: [partition] }]);
    isPaused = true;
  }
};

const resumeConsumer = async (partition) => {
  if (isPaused) {
    await consumer.resume([{ topic: 'my-topic', partitions: [partition] }]);
    isPaused = false;
  }
};

consumeMessages().catch(console.error);
*/
