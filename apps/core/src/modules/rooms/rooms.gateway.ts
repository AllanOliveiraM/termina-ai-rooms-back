import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

import { Socket } from 'socket.io'

import { RoomsService } from './rooms.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  constructor(private readonly roomsService: RoomsService) {
    console.log('entrou')
  }

  @SubscribeMessage('teste')
  handleEvent(client: Socket, data: string): string {
    console.log('oi', data)
    client.emit('teste2', 'oi')
    return 'oi'
  }
}
