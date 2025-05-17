import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

import { Socket } from 'socket.io'

import { RoomsService } from './rooms.service'

@WebSocketGateway()
export class RoomsGateway {
  constructor(private readonly roomsService: RoomsService) {}

  @SubscribeMessage('teste')
  handleEvent(client: Socket, data: string): string {
    return 'oi'
  }
}
