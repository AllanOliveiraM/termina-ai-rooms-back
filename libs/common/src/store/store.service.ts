import { Injectable } from '@nestjs/common'

import { MemoryStore } from './memory.store'

export interface UserInterface {
  channelId: string
  sessionId: string
  nickname: string
  position?: number
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
    return this.get(terminationId)

    // if (!room) {
    //   throw new NotFoundException({
    //     message: 'Room not found',
    //     statusCode: HttpStatus.NOT_FOUND,
    //   })
    // }

    // return room
  }

  createUserInRoom(terminationId: string, user: UserInterface): void {
    const room = this.get(terminationId)

    if (!room.users) {
      room.users = []
    }

    const userExists = this.getUserById(terminationId, user.sessionId)

    if (!userExists) {
      room.users.push(user)

      this.set(terminationId, room)
    }
  }

  updateUserInRoom(terminationId: string, user: UserInterface): void {
    const room = this.get(terminationId)

    if (!room.users) {
      room.users = []
    }

    const userExists = this.getUserById(terminationId, user.sessionId)

    if (userExists) {
      room.users = room.users.map(existingUser => {
        if (existingUser.sessionId === user.sessionId) {
          return { ...existingUser, ...user }
        }
        return existingUser
      })

      this.set(terminationId, room)
    }
  }

  getUserById(terminationId: string, sessionId: string): UserInterface | undefined {
    const room = this.getRoomById(terminationId)
    return room.users?.find(user => user.sessionId === sessionId)
  }
}
