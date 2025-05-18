import { Injectable } from '@nestjs/common'

import { Server } from 'socket.io'

import { StoreService } from '@app/common/modules/store/store.service'
import { _dayjs } from '@app/common/utils/datetime'

const userActiveTimeout_minutes = 10

@Injectable()
export class RoomsSyncService {
  constructor(private readonly storeService: StoreService) {}

  async syncRoom(terminationId: string, server: Server): Promise<void> {
    const room = this.storeService.getRoomById(terminationId)

    if (!room) {
      return
    }

    const now = _dayjs()

    const activeUsers = room.roomUsers.filter(
      user =>
        user.meta.lastSeenAt.isBefore(
          now.subtract(userActiveTimeout_minutes, 'minutes')
        ) && user.socketChannelId
    )

    for (const user of activeUsers) {
      server.to(user.socketChannelId).emit('sync', {
        room,
      })
    }
  }

  async syncForUser(
    terminationId: string,
    socketChannelId: string,
    server: Server
  ): Promise<void> {
    const room = this.storeService.getRoomById(terminationId)

    if (!room) {
      return
    }

    server.to(socketChannelId).emit('sync', {
      room,
    })
  }
}
