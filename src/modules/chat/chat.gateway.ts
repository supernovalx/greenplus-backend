import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { validate, ValidationError } from 'class-validator';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { ClientMessageDto } from './dto/client-message.dto';
import { ServerMessageDto } from './dto/server-message.dto';
import { Message } from './entity/message.entity';
import { MessageRepository } from './message.repository';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private connectedClients: UserSocket[] = [];
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private userRepository: UserRepository,
    private messageRepository: MessageRepository,
  ) {}
  afterInit(server: any) {
    console.log(`After initialization ${server}`);
  }
  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Handle connection `);
    console.log(client.handshake.query['token']);

    const token = client.handshake.query['token'];
    if (token === undefined) {
      console.log('No auth token');
      client.disconnect(true);

      return;
    }
    const user: User | null = await this.authService.parseAccessToken(token);
    if (user === null) {
      console.log('Invalid user');
      client.disconnect(true);

      return;
    }
    console.log(`${user?.fullName} connected`);
    const userSocket: UserSocket = { user: user, socket: client };
    this.connectedClients.push(userSocket);

    this.printConnectedClient();
  }

  handleDisconnect(client: any) {
    console.log(`Handle disconnect `);

    this.connectedClients.splice(this.connectedClients.indexOf(client), 1);

    this.printConnectedClient();
  }

  printConnectedClient() {
    console.log('--------------------------------');
    console.log('Connected clients');
    for (const userSocket of this.connectedClients) {
      console.log(userSocket.user.fullName, userSocket.user.id);
    }
    console.log('--------------------------------');
  }

  @SubscribeMessage('client_message')
  async handleMessage(
    socket: Socket,
    payload: ClientMessageDto,
  ): Promise<string> {
    // Validate client message
    const validationResult: string | null = await this.validateClientMessage(
      payload,
    );
    if (validationResult) {
      return validationResult;
    }

    // Get sender user
    const sender: User | undefined = this.getUserFromSocket(socket);
    // Prevent send message to self
    if (sender === undefined || sender.id === payload.receiverId) {
      socket.disconnect();

      return '';
    }

    console.log(`Received message from ${sender}`);
    console.log(typeof payload);

    // Save message to database
    const receiver: User = await this.userRepository.findOneById(
      payload.receiverId,
    );
    const message: Message = await this.messageRepository.create({
      content: payload.message,
      receiverId: payload.receiverId,
      senderId: sender.id,
    });

    // Emit message to receiver
    for (const receiverClient of this.connectedClients) {
      if (receiverClient.user.id === payload.receiverId) {
        const serverMessageDto: ServerMessageDto = {
          id: message.id,
          createdAt: message.createAt,
          message: payload.message,
          senderId: sender.id,
          senderName: sender.fullName,
        };
        receiverClient.socket.emit('server_message', serverMessageDto);
      }
    }
    // const receiverSocket: Socket | undefined = this.getSocketFromUserId(
    //   payload.receiverId,
    // );
    // if (receiverSocket) {
    //   const serverMessageDto: ServerMessageDto = {
    //     id: message.id,
    //     createdAt: message.createAt,
    //     message: payload.message,
    //     senderId: senderId,
    //   };
    //   receiverSocket.emit('server_message', serverMessageDto);
    // } else {
    //   console.log('Cant fint receiver socket');
    // }

    return 'ok';
  }

  async validateClientMessage(
    payload: ClientMessageDto,
  ): Promise<string | null> {
    if (typeof payload !== 'object') {
      return 'must be valid JSON';
    }
    const clientMessageDto: ClientMessageDto = new ClientMessageDto();
    clientMessageDto.message = payload.message;
    clientMessageDto.receiverId = payload.receiverId;

    const validateErrors: ValidationError[] = await validate(clientMessageDto);
    if (validateErrors.length > 0) {
      return validateErrors.toString();
    }

    return null;
  }

  getUserFromSocket(client: Socket): User | undefined {
    return this.connectedClients.find(
      (userSocket) => userSocket.socket.id === client.id,
    )?.user;
  }

  // getSocketFromUserId(userId: number): Socket | undefined {
  //   console.log(`Find ${userId}`);
  //   return this.connectedClients.find(
  //     (userSocket) => userSocket.userId === userId,
  //   )?.socket;
  // }
}

interface UserSocket {
  user: User;
  socket: Socket;
}
