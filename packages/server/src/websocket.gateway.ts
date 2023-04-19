import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { isValidObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { AccountsService } from './api/accounts/accounts.service';
import { Account } from './api/accounts/entities/accounts.entity';
import { CustomersService } from './api/customers/customers.service';
import { EventsService } from './api/events/events.service';

interface SocketData {
  account: Account;
  customerId: string;
}

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private accountsService: AccountsService,
    private customersService: CustomersService,
    private eventsService: EventsService
  ) {}

  public async handleConnection(socket: Socket) {
    try {
      const { apiKey, customerId } = socket.handshake.auth;

      const account = await this.accountsService.findOneByAPIKey(apiKey);

      if (!account) {
        socket.emit('error', 'Bad API key');
        socket.disconnect(true);
        return;
      }

      socket.data.account = account;

      let customer: {
        id?: string;
        isAnonymous?: boolean;
      };
      if (customerId && isValidObjectId(customerId)) {
        customer = await this.customersService.CustomerModel.findOne({
          _id: customerId,
          ownerId: account.id,
        }).exec();

        if (!customer) {
          socket.emit(
            'error',
            'Invalid customer id. Creating new anonymous customer...'
          );
          customer = await this.customersService.CustomerModel.create({
            isAnonymous: true,
            ownerId: account.id,
          });
        }
      } else {
        socket.emit(
          'log',
          'Customer id not found. Creating new anonymous customer...'
        );
        customer = await this.customersService.CustomerModel.create({
          isAnonymous: true,
          ownerId: account.id,
        });
      }

      socket.data.customerId = customer.id;
      socket.emit('customerId', customer.id);
      socket.emit('log', 'Connected');
    } catch (e) {
      socket.emit('error', e);
    }
  }

  @SubscribeMessage('ping')
  public async handlePing(@ConnectedSocket() socket: Socket) {
    socket.emit('log', 'pong');
  }

  @SubscribeMessage('identify')
  public async handleIdentify(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    {
      uniqueProperties,
      optionalProperties,
    }: {
      uniqueProperties: { [key: string]: unknown };
      optionalProperties?: { [key: string]: unknown };
    }
  ) {
    const {
      account: { id: ownerId },
      customerId,
    } = socket.data as SocketData;

    let customer = await this.customersService.CustomerModel.findOne({
      _id: customerId,
      ownerId,
    });

    if (!customer) {
      socket.emit(
        'error',
        'Invalid customer id. Creating new anonymous customer...'
      );
      customer = await this.customersService.CustomerModel.create({
        isAnonymous: true,
        ownerId,
      });

      socket.data.customerId = customer.id;
      socket.emit('customerId', customer.id);
    }

    if (!customer.isAnonymous) {
      socket.emit('error', 'Failed to identify: already identified');
      return;
    }

    const identifiedCustomer =
      await this.customersService.CustomerModel.findOne({
        ...uniqueProperties,
        ownerId,
      }).exec();

    if (identifiedCustomer) {
      const { id, _id, __v, ...customerData } = customer.toObject();

      await this.customersService.CustomerModel.findByIdAndUpdate(
        identifiedCustomer.id,
        {
          ...customerData,
          ...optionalProperties,
          ...uniqueProperties,
          ownerId,
          isAnonymous: false,
        }
      ).exec();

      await this.customersService.CustomerModel.findByIdAndRemove(
        customer.id
      ).exec();

      socket.data.customerId = identifiedCustomer.id;
      socket.emit('customerId', identifiedCustomer.id);
    } else {
      await this.customersService.CustomerModel.findByIdAndUpdate(customer.id, {
        ...optionalProperties,
        ...uniqueProperties,
        ownerId,
        isAnonymous: false,
      }).exec();
    }

    socket.emit('log', 'Identified');
  }

  @SubscribeMessage('fire')
  public async handleFire(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    event: { [key: string]: unknown }
  ) {
    const {
      account: { id: ownerId, apiKey },
      customerId,
    } = socket.data as SocketData;

    let customer = await this.customersService.CustomerModel.findOne({
      _id: customerId,
      ownerId,
    });

    if (!customer) {
      socket.emit(
        'error',
        'Invalid customer id. Creating new anonymous customer...'
      );
      customer = await this.customersService.CustomerModel.create({
        isAnonymous: true,
        ownerId,
      });

      socket.data.customerId = customer.id;
      socket.emit('customerId', customer.id);
    }

    const workflowTick = await this.eventsService.enginePayload(
      `Api-key ${apiKey}`,
      {
        correlationKey: '_id',
        correlationValue: customer.id,
        source: 'custom',
        event,
      }
    );

    socket.emit('log', 'Successful fire');
    socket.emit('workflowTick', workflowTick);
  }
}
