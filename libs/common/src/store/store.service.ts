import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'

import { MemoryStore } from './memory.store'

export interface UserInterface {
  channelId: string
  sessionId: string
  nickname: string
  position: number
}
export interface RoomInterface {
  terminationId: string
  chosenMessage: string
  // TODO?: Ver as possíveis tipagens
  scenario: string
  // TODO?: Ver as possíveis tipagens
  soundtrack: string
  // TODO?: Ver as possíveis tipagens
  type: 'auditorium'
  users?: UserInterface[]
}

@Injectable()
export class StoreService extends MemoryStore<RoomInterface> {
  createRoom(room: RoomInterface): void {
    this.set(room.terminationId, room)
  }

  getRoomById(terminationId: string): RoomInterface | undefined {
    const room = this.get(terminationId)

    if (!room) {
      throw new NotFoundException({
        message: 'Room not found',
        statusCode: HttpStatus.NOT_FOUND,
      })
    }

    return room
  }
}
