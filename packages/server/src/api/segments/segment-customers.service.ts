import { Logger, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { Account } from '../accounts/entities/accounts.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Readable } from 'node:stream';
import * as copyFrom from 'pg-copy-streams';
import { SegmentCustomers } from './entities/segment-customers.entity';
import { Segment } from './entities/segment.entity';
import { Customer } from '../customers/entities/customer.entity';

const LOCATION_LOCK_TIMEOUT_MS = +process.env.LOCATION_LOCK_TIMEOUT_MS;

@Injectable()
export class SegmentCustomersService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectRepository(SegmentCustomers)
    public segmentCustomersRepository: Repository<SegmentCustomers>,
    @InjectRepository(Account)
    public accountRepository: Repository<Account>
  ) { }

  log(message, method, session, user = 'ANONYMOUS') {
    this.logger.log(
      message,
      JSON.stringify({
        class: SegmentCustomersService.name,
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
        class: SegmentCustomersService.name,
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
        class: SegmentCustomersService.name,
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
        class: SegmentCustomersService.name,
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
        class: SegmentCustomersService.name,
        method: method,
        session: session,
        user: user,
      })
    );
  }

  /**
   * Add a customer to a segment.
   *
   * @param {Account} account Associated Account
   * @param {Segment} journey Associated Journey
   * @param {CustomerDocument} customer Associated Customer
   * @param {string} session HTTP session token
   * @param {QueryRunner} [queryRunner]  Postgres Transaction
   * @returns
   */
  async create(
    segment: Segment,
    customer: Customer,
    session: string,
    account: Account,
    queryRunner?: QueryRunner
  ) {
    this.log(
      JSON.stringify({
        info: `Adding customer ${customer.id} to segment ${segment.id}`,
      }),
      this.create.name,
      session,
      account.email
    );

    const workspace = account?.teams?.[0]?.organization?.workspaces?.[0];

    if (queryRunner) {
      // Step 1: Check if customer is already enrolled in Journey; if so, throw error
      const location = await queryRunner.manager.findOne(SegmentCustomers, {
        where: {
          segment: { id: segment.id },
          workspace: { id: workspace.id },
          customer: { id: customer.id },
        },
      });

      if (location)
        throw new Error(
          `Customer ${customer.id} already a part of segment ${segment.id}`
        );

      // Step 2: Create new journey Location row, add time that user entered the journey
      await queryRunner.manager.save(SegmentCustomers, {
        segment: { id: segment.id },
        workspace,
        customer: { id: customer.id },
        segmentEntry: Date.now(),
      });
    } else {
      const location = await this.segmentCustomersRepository.findOne({
        where: {
          segment: { id: segment.id },
          workspace: { id: workspace.id },
          customer: { id: customer.id },
        },
      });
      if (location)
        throw new Error(
          `Customer ${customer.id} already a part of segment ${segment.id}`
        );
      await this.segmentCustomersRepository.save({
        segment: { id: segment.id },
        workspace,
        customer: { id: customer.id },
        segmentEntry: Date.now(),
      });
    }
  }

  async deleteFromSingleSegment(
    segment: Segment,
    customer: Customer,
    session: string,
    account: Account,
    queryRunner?: QueryRunner
  ) {
    this.log(
      JSON.stringify({
        info: `Removing customer ${customer.id} from segment ${segment.id}`,
      }),
      this.deleteFromSingleSegment.name,
      session,
      account.email
    );

    const workspace = account?.teams?.[0]?.organization?.workspaces?.[0];

    if (queryRunner) {
      // Step 1: Check if customer is already enrolled in Journey; if so, throw error
      const location = await queryRunner.manager.findOne(SegmentCustomers, {
        where: {
          segment: { id: segment.id },
          workspace: { id: workspace.id },
          customer: { id: customer.id },
        },
      });

      if (location)
        throw new Error(
          `Customer ${customer.id} already a part of segment ${segment.id}`
        );

      // Step 2: Create new journey Location row, add time that user entered the journey
      await queryRunner.manager.save(SegmentCustomers, {
        segment: { id: segment.id },
        workspace,
        customer: { id: customer.id },
        segmentEntry: Date.now(),
      });
    } else {
      const location = await this.segmentCustomersRepository.findOne({
        where: {
          segment: { id: segment.id },
          workspace: { id: workspace.id },
          customer: { id: customer.id },
        },
      });
      if (location)
        throw new Error(
          `Customer ${customer.id} already a part of segment ${segment.id}`
        );
      await this.segmentCustomersRepository.save({
        segment: { id: segment.id },
        workspace,
        customer: { id: customer.id },
        segmentEntry: Date.now(),
      });
    }
  }

  async deleteFromAllSegments(
    segment: Segment,
    customer: Customer,
    session: string,
    account: Account,
    queryRunner?: QueryRunner
  ) {
    this.log(
      JSON.stringify({
        info: `Removing customer ${customer.id} from segment ${segment.id}`,
      }),
      this.deleteFromAllSegments.name,
      session,
      account.email
    );

    const workspace = account?.teams?.[0]?.organization?.workspaces?.[0];

    if (queryRunner) {
      // Step 1: Check if customer is already enrolled in Journey; if so, throw error
      const location = await queryRunner.manager.findOne(SegmentCustomers, {
        where: {
          segment: { id: segment.id },
          workspace: { id: workspace.id },
          customer: { id: customer.id },
        },
      });

      if (location)
        throw new Error(
          `Customer ${customer.id} already a part of segment ${segment.id}`
        );

      // Step 2: Create new journey Location row, add time that user entered the journey
      await queryRunner.manager.save(SegmentCustomers, {
        segment: { id: segment.id },
        workspace,
        customer: { id: customer.id },
        segmentEntry: Date.now(),
      });
    } else {
      const location = await this.segmentCustomersRepository.findOne({
        where: {
          segment: { id: segment.id },
          workspace: { id: workspace.id },
          customer: { id: customer.id },
        },
      });
      if (location)
        throw new Error(
          `Customer ${customer.id} already a part of segment ${segment.id}`
        );
      await this.segmentCustomersRepository.save({
        segment: { id: segment.id },
        workspace,
        customer: { id: customer.id },
        segmentEntry: Date.now(),
      });
    }
  }

  async addBulk(
    segmentID: string,
    customers: string[],
    session: string,
    account: Account,
    client: any
  ): Promise<void> {
    if (!customers.length) return;
    const workspace = account?.teams?.[0]?.organization?.workspaces?.[0];
    const segmentEntry = Date.now();

    // Create a readable stream from the array od customer IDs
    const readableStream = new Readable({
      read() {
        customers.forEach((customerId) => {
          this.push(
            `${segmentID}\t${customerId}\t${workspace.id}\t${segmentEntry}\n`
          );
        });
        this.push(null);
      },
    });

    const stream = client.query(
      copyFrom.from(
        `COPY segment_customers ("segmentId", "customerId", "workspaceId", "segmentEntry") FROM STDIN WITH (FORMAT text)`
      )
    );

    // Error handling
    stream.on('error', (error) => {
      this.error(error, this.addBulk.name, session, account.email);
      throw error;
    });
    stream.on('finish', () => {
      this.debug(
        `Finished creating segment rows for ${segmentID}`,
        this.addBulk.name,
        session,
        account.email
      );
    });

    // Pipe the readable stream to the COPY command
    readableStream.pipe(stream);
  }

  async removeBulk(
    segmentID: string,
    customers: string[],
    session: string,
    account: Account,
    client: any
  ): Promise<void> {
    if (!customers.length) return;
    const workspace = account?.teams?.[0]?.organization?.workspaces?.[0];
    const segmentEntry = Date.now();

    // Create a readable stream from your customers array
    const readableStream = new Readable({
      read() {
        customers.forEach((customerId) => {
          this.push(
            `${segmentID}\t${customerId}\t${workspace.id}\t${segmentEntry}\n`
          );
        });
        this.push(null); // No more data
      },
    });

    const stream = client.query(
      copyFrom.from(
        `COPY segment_customer ("segmentId", "customerId", "workspace", "segmentEntry") FROM STDIN WITH (FORMAT text)`
      )
    );

    // Error handling
    stream.on('error', (error) => {
      this.error(error, this.addBulk.name, session, account.email);
      throw error;
    });
    stream.on('finish', () => {
      this.debug(
        `Finished creating journey location rows for ${segmentID}`,
        this.addBulk.name,
        session,
        account.email
      );
    });

    // Pipe the readable stream to the COPY command
    readableStream.pipe(stream);
  }

  /**
   * Returns a number indicating the number of customers enrolled in a segment
   * 
   * @param {Account} account Account associated with this customer/segment pair
   * @param {string | Segment} segment Either the segment UUID or Segment object
   * @param {string }session HTTP session identifier
   * @param {QueryRunner} [queryRunner] Optional query runner for transactions
   * @returns {Promise<number>} A promise resolving to a number, indicating the
   * number of customers enrolled in a segment.
   */
  async getSegmentSize(
    account: Account,
    segment: string | Segment,
    session: string,
    queryRunner?: QueryRunner
  ): Promise<number> {

    let repository: Repository<SegmentCustomers>;
    if (queryRunner) repository = queryRunner.manager.getRepository(SegmentCustomers);
    else repository = this.segmentCustomersRepository;

    const query: FindManyOptions<SegmentCustomers> = {
      where: {
        workspace: { id: account.teams?.[0]?.organization?.workspaces?.[0].id },
        segment: typeof segment === 'string' ? { id: segment } : { id: segment.id },
      },
    };
    let count: number = await repository.count(query);
    return count;
  }


  async getSegmentsForCustomer(
    account: Account,
    customer: string | Customer,
    take = 100,
    skip = 0,
    search = '',
    session: string,
    queryRunner?: QueryRunner
  ) {
    const workspace = account?.teams?.[0]?.organization?.workspaces?.[0];

    const totalPages = Math.ceil(
      (await this.segmentCustomersRepository
        .createQueryBuilder('segmentCustomers')
        .innerJoinAndSelect('segmentCustomers.customer', 'customer')
        .where('segmentCustomers.workspace_id = :workspaceId', { workspaceId: workspace.id })
        .andWhere('customer.uuid = :uuid', typeof customer === 'string' ? { uuid: customer } : { uuid: customer.uuid })
        .getCount()) / take || 1
    );

    const records = await this.segmentCustomersRepository
    .createQueryBuilder('segmentCustomers')
    .innerJoinAndSelect('segmentCustomers.customer', 'customer')
    .innerJoinAndSelect('segmentCustomers.segment', 'segment')
    .where('segmentCustomers.workspace_id = :workspaceId', { workspaceId: workspace.id })
    .andWhere('customer.uuid = :uuid', typeof customer === 'string' ? { uuid: customer } : { uuid: customer.uuid })
    .take(take < 100 ? take : 100)
    .skip(skip)
    .getMany();  

    const segments = records.map((record) => record.segment);
    return { data: segments, totalPages };
  }

  /**
   * 
   * 
   * @param {Account} account Account associated with this customer/segment pair
   * @param {string | Segment} segment Either the segment UUID or Segment object
   * @param {string }session HTTP session identifier
   * @param {QueryRunner} [queryRunner] Optional query runner for transactions
   * @returns 
   */
  async getCustomersInSegment(
    account: Account,
    segment: string | Segment,
    session: string,
    queryRunner?: QueryRunner
  ) {

  }

  /**
   * Returns a boolean value indicating whether or not the specified customer is
   * in the specified segment.
   * 
   * @param {Account} account Account associated with this customer/segment pair
   * @param {string | Segment} segment Either the segment UUID or Segment object
   * @param {string | Customer} customer Either the customer UUID or Customer object
   * @param {string }session HTTP session identifier
   * @param {QueryRunner} [queryRunner] Optional query runner for transactions
   * @returns {Promise<boolean>} A promise resolving to a boolean, indicating whether or not
   * the specified customer was found in the specified segment. Uses a findOne query under
   * the hood.
   */
  async isCustomerInSegment(
    account: Account,
    segment: string | Segment,
    customer: string | Customer,
    session: string,
    queryRunner?: QueryRunner
  ): Promise<boolean> {

    let repository: Repository<SegmentCustomers>;
    if (queryRunner) repository = queryRunner.manager.getRepository(SegmentCustomers);
    else repository = this.segmentCustomersRepository;

    const query: FindManyOptions<SegmentCustomers> = {
      where: {
        workspace: { id: account.teams?.[0]?.organization?.workspaces?.[0].id },
        segment: typeof segment === 'string' ? { id: segment } : { id: segment.id },
        customer: typeof customer === 'string' ? { id: parseInt(customer) } : { id: customer.id },
      },
    };
    const found: SegmentCustomers = await repository.findOne(query);

    return found ? true : false;
  }
}
