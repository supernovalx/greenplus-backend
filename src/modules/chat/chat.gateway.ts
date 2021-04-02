import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}
  afterInit(server: any) {
    console.log(`After initialization ${server}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Handle connection ${client}`);
    console.log(client.handshake.auth.token);
  }
  handleDisconnect(client: any) {
    console.log(`Handle disconnect ${client}`);
  }
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log(`Received message ${payload}`);
    console.log(payload);
    console.log(client);
    client.broadcast.emit('message', payload);
    return 'Hello world!';
  }
}
