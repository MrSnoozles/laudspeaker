import { getQueueToken, NO_QUEUE_FOUND } from '@nestjs/bull-shared';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  createContextId,
  DiscoveryService,
  ModuleRef,
  Reflector,
} from '@nestjs/core';
import { Injector } from '@nestjs/core/injector/injector';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { PROCESSOR_METADATA } from './queue.constants';
import { RMQConnection } from './classes/rmq-connection';
import { RMQChannel } from './classes/rmq-channel';
import { RMQConnectionManager } from './classes/rmq-connection-manager';
import { WorkOrchestrator } from './classes/work-orchestrator';
import { Producer } from './classes/producer';
import { QueueManager } from './classes/queue-manager';

@Injectable()
export class QueueExplorer implements OnModuleInit {
  private readonly injector = new Injector();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private reflector: Reflector
  ) {}

  async onModuleInit(): Promise<void> {
    // create all queues
    await QueueManager.init();

    await this.initProducer();

    if (process.env.LAUDSPEAKER_PROCESS_TYPE == 'QUEUE') {
      await this.initWorkers();
    }
  }

  private async initWorkers() {
    const connection = await this.createConnection("consumer");

    const providers: InstanceWrapper[] = this.discoveryService
      .getProviders()
      .filter((wrapper: InstanceWrapper) => {
        const target = !wrapper.metatype || wrapper.inject
            ? wrapper.instance?.constructor
            : wrapper.metatype;

        if (!target)
          return false;

        const value = this.reflector.get(PROCESSOR_METADATA, target);

        return !!value;
      });

      for(const wrapper of providers) {
        const { name: queueName } = this.reflector.get(PROCESSOR_METADATA, wrapper.instance.constructor);
        const channel = await this.createChannel(connection);

        const connectionMgr = new RMQConnectionManager(connection, channel);

        const worker = new WorkOrchestrator(queueName, wrapper.instance, connectionMgr);

        await worker.setupListeners();
      }
  }

  private async initProducer() {
    const connection = await this.createConnection("producer");
    const channel = await this.createChannel(connection);
    const connectionMgr = new RMQConnectionManager(connection, channel);

    Producer.init(connectionMgr);
  }

  private async createConnection(connectionTag: string) {
    const connection = new RMQConnection(connectionTag);
    await connection.init();

    return connection;
  }

  private async createChannel(connection: RMQConnection) {
    const channel = new RMQChannel(connection);
    await channel.init();

    return channel;
  }
}