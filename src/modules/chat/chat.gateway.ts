import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entities/user.entity';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private connectedClients: UserSocket[] = [];
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}
  afterInit(server: any) {
    console.log(`After initialization ${server}`);
  }
  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Handle connection `);
    console.log(client.handshake.headers.token);

    const token = client.handshake.headers.token;
    const user: User | null = await this.authService.parseAccessToken(token);
    if (user === null) {
      console.log('Invalid user');
      client.disconnect(true);

      return;
    }
    console.log(`${user?.fullName} connected`);
    const userSocket: UserSocket = { userId: user.id, socket: client };
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
      console.log(userSocket.userId);
    }
    console.log('--------------------------------');
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log(`Received message ${payload}`);
    console.log(payload);
    // console.log(client);
    client.broadcast.emit('message', payload);
    return 'Hello world!';
  }
}

interface UserSocket {
  userId: number;
  socket: Socket;
}
