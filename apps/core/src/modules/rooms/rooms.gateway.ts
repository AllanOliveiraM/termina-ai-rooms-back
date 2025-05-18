import { UsePipes, ValidationPipe } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

import ms from 'ms'
import { Socket, Server } from 'socket.io'

import { ErrorCodes } from '@app/common/constants/error-codes'
import { RoomsSyncService } from '@app/common/modules/rooms-sync/rooms-sync.service'
import { StoreService } from '@app/common/modules/store/store.service'
import { _dayjs } from '@app/common/utils/datetime'

import { AuthService } from '../../../../../libs/common/src/modules/auth/auth.service'
import { WithAuthEventDto } from './dtos/with-auth-event.dto'

const roomLifetime_days = 5

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
    transform: true,
  })
)
export class RoomsGateway {
  @WebSocketServer() server: Server

  constructor(
    private readonly storeService: StoreService,
    private readonly authService: AuthService,
    private readonly roomsSyncService: RoomsSyncService
  ) {}

  private kickUser(socketChannelId: string) {
    this.server.to(socketChannelId).emit('kicked')
  }

  @SubscribeMessage('join')
  async join(client: Socket, message: WithAuthEventDto): Promise<void> {
    const tokenPayload = this.authService.validateAndParseToken({
      token: message.token,
    })

    if (!tokenPayload) {
      client.emit('known-error', ErrorCodes.AUTH_TOKEN_NOT_VALID)

      return
    }

    const room = this.storeService.getRoomById(tokenPayload.terminationId)

    if (!room) {
      client.emit('known-error', ErrorCodes.ROOM_NOT_FOUND)

      return
    }

    const userFromStore = this.storeService.getUserFromRoomBySessionId(
      room.roomInfo.terminationId,
      tokenPayload.sessionId
    )

    if (!userFromStore) {
      client.emit('known-error', ErrorCodes.USER_NOT_FOUND)

      return
    }

    const now = _dayjs()

    const socketChannelId = client.id

    if (socketChannelId !== userFromStore.socketChannelId) {
      this.kickUser(userFromStore.socketChannelId)
    }

    this.storeService.setUserInRoom(room.roomInfo.terminationId, {
      ...userFromStore,

      socketChannelId,

      meta: {
        ...userFromStore.meta,

        lastSeenAt: now,
      },
    })

    await this.roomsSyncService.syncRoom(room.roomInfo.terminationId, this.server)
  }

  @SubscribeMessage('iamhere')
  async handleEvent(client: Socket, message: WithAuthEventDto): Promise<void> {
    const tokenPayload = this.authService.validateAndParseToken({
      token: message.token,
    })

    if (!tokenPayload) {
      client.emit('known-error', ErrorCodes.AUTH_TOKEN_NOT_VALID)

      return
    }

    const room = this.storeService.getRoomById(tokenPayload.terminationId)

    if (!room) {
      client.emit('known-error', ErrorCodes.ROOM_NOT_FOUND)

      return
    }

    const userFromStore = this.storeService.getUserFromRoomBySessionId(
      room.roomInfo.terminationId,
      tokenPayload.sessionId
    )

    if (!userFromStore) {
      client.emit('known-error', ErrorCodes.USER_NOT_FOUND)

      return
    }

    const now = _dayjs()

    const socketChannelId = client.id

    if (socketChannelId !== userFromStore.socketChannelId) {
      this.kickUser(userFromStore.socketChannelId)
    }

    this.storeService.setUserInRoom(room.roomInfo.terminationId, {
      ...userFromStore,

      socketChannelId,

      meta: {
        ...userFromStore.meta,

        lastSeenAt: now,
      },
    })

    await this.roomsSyncService.syncForUser(
      room.roomInfo.terminationId,
      socketChannelId,
      this.server
    )
  }

  @Interval(ms('7s'))
  async baseSync() {
    const currentStoreRoomTerminationIds = this.storeService.getAllKeys()

    for (const terminationId of currentStoreRoomTerminationIds) {
      await this.roomsSyncService.syncRoom(terminationId, this.server)
    }
  }

  @Interval(ms('1h'))
  async recycleRooms() {
    const now = _dayjs()

    const currentStore = this.storeService.getAll()

    for (const room of currentStore) {
      if (room.meta.createdAt.isBefore(now.subtract(roomLifetime_days, 'days'))) {
        room.roomUsers.forEach(user => {
          if (user.socketChannelId) {
            this.kickUser(user.socketChannelId)
          }
        })

        this.storeService.delete(room.roomInfo.terminationId)

        continue
      }
    }
  }
}
