import { Injectable } from '@nestjs/common'

import { Room } from '@app/common/types/rooms'
import { User } from '@app/common/types/users'
import { _dayjs } from '@app/common/utils/datetime'

import { MemoryStore } from './memory.store'

@Injectable()
export class StoreService extends MemoryStore<Room> {
  createRoom(room: Room) {
    this.set(room.roomInfo.terminationId, room)

    return room
  }

  getRoomById(terminationId: string): Room | null {
    return this.get(terminationId) || null
  }

  getUserFromRoomBySessionId(terminationId: string, sessionId: string): User | undefined {
    const room = this.getRoomById(terminationId)

    return room.roomUsers?.find(user => user.sessionId === sessionId)
  }

  setUserInRoom(
    terminationId: string,
    user: User
  ): {
    upserted: boolean
  } {
    const room = this.get(terminationId)

    if (!room) {
      return {
        upserted: false,
      }
    }

    const userExists = this.getUserFromRoomBySessionId(terminationId, user.sessionId)

    if (userExists) {
      room.roomUsers = [
        ...room.roomUsers.filter(user => user.sessionId !== user.sessionId),

        user,
      ]

      return {
        upserted: true,
      }
    }

    room.roomUsers.push(user)

    return {
      upserted: true,
    }
  }

  removeUserFromRoom(
    terminationId: string,
    sessionId: string
  ): {
    removed: boolean
  } {
    const room = this.get(terminationId)

    if (!room) {
      return {
        removed: false,
      }
    }

    const userExists = this.getUserFromRoomBySessionId(terminationId, sessionId)

    if (!userExists) {
      return {
        removed: false,
      }
    }

    room.roomUsers = room.roomUsers.filter(user => user.sessionId !== sessionId)

    return {
      removed: true,
    }
  }
}
