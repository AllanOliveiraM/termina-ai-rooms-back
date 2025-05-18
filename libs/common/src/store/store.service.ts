import { Injectable } from '@nestjs/common'

import { MemoryStore } from './memory.store'

export interface UserInterface {
  channelId: string[]
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
  }

  getRoomByClientId(clientId: string): RoomInterface | undefined {
    const rooms = this.getAll()
    const room = Object.values(rooms).find(r =>
      r.users?.some(user => user.channelId.includes(clientId))
    )

    return room
  }

  createUserInRoom(terminationId: string, user: UserInterface): void {
    const room = this.get(terminationId)

    if (!room.users) {
      room.users = []
    }

    const userExists = this.getUserBySessionId(terminationId, user.sessionId)

    if (!userExists) {
      room.users.push(user)

      this.set(terminationId, room)
    }
  }

  removeUserFromRoom(terminationId: string, sessionId: string): void {
    const room = this.get(terminationId)

    if (!room.users) {
      return
    }

    const userExists = this.getUserBySessionId(terminationId, sessionId)

    if (userExists) {
      room.users = room.users.filter(user => user.sessionId !== sessionId)

      this.set(terminationId, room)
    }
  }

  removeClientIdFromUser(
    terminationId: string,
    sessionId: string,
    clientId: string
  ): void {
    const room = this.get(terminationId)

    if (!room.users) {
      return
    }

    const userExists = this.getUserBySessionId(terminationId, sessionId)

    if (userExists) {
      userExists.channelId = userExists.channelId.filter(id => id !== clientId)
      this.updateUserInRoom(terminationId, userExists)
    }
  }

  updateUserInRoom(terminationId: string, user: UserInterface): void {
    const room = this.get(terminationId)

    if (!room.users) {
      room.users = []
    }

    const userExists = this.getUserBySessionId(terminationId, user.sessionId)

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

  getUserBySessionId(
    terminationId: string,
    sessionId: string
  ): UserInterface | undefined {
    const room = this.getRoomById(terminationId)
    return room.users?.find(user => user.sessionId === sessionId)
  }
}
