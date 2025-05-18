import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'

import { Socket, Server } from 'socket.io'

import { StoreService } from '@app/common/store/store.service'

import { AuthService } from '../auth/auth.service'
import { JoinEventDto } from './dtos/join.event.dto'
import { RoomsService } from './rooms.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server
  constructor(
    private readonly roomsService: RoomsService,
    private readonly storeService: StoreService,
    private readonly authService: AuthService
  ) {}
  async handleDisconnect(client: Socket): Promise<void> {
    const roomFromStore = this.storeService.getRoomByClientId(client.id)
    if (!roomFromStore) {
      client.emit('sync', { status: false, message: 'Room not found' })
      return
    }

    const disconnectedUser = roomFromStore.users?.find(user =>
      user.channelId.includes(client.id)
    )

    if (disconnectedUser) {
      if (disconnectedUser.channelId.length === 1) {
        this.storeService.removeUserFromRoom(
          roomFromStore.terminationId,
          disconnectedUser.sessionId
        )
      } else {
        this.storeService.removeClientIdFromUser(
          roomFromStore.terminationId,
          disconnectedUser.sessionId,
          client.id
        )
      }
    }

    await this.roomsService.syncRooms(roomFromStore.terminationId, this.server)
  }

  @SubscribeMessage('join')
  async handleEvent(client: Socket, message: JoinEventDto): Promise<void> {
    const decodedToken = this.authService.validateToken(message.token)
    if (!decodedToken) {
      client.emit('sync', { status: false, message: 'Invalid token' })
      return
    }

    const roomFromStore = this.storeService.getRoomById(decodedToken.terminationId)
    if (!roomFromStore) {
      client.emit('sync', { status: false, message: 'Room not found' })
      return
    }

    const userFromStore = this.storeService.getUserBySessionId(
      decodedToken.terminationId,
      decodedToken.sessionId
    )

    const userRoom = {
      channelId: [client.id],
      sessionId: decodedToken.sessionId,
      nickname: decodedToken.nickname,
      position: 0,
    }

    if (!userFromStore) {
      this.storeService.createUserInRoom(decodedToken.terminationId, userRoom)
    } else {
      this.storeService.updateUserInRoom(decodedToken.terminationId, {
        ...userRoom,
        channelId: [...userFromStore.channelId, client.id],
      })
    }

    await this.roomsService.syncRooms(decodedToken.terminationId, this.server)
  }
}
