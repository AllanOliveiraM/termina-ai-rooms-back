import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

import { StoreService } from '@app/common/store/store.service'

import { RoomsService } from '../rooms/rooms.service'
import { CreateSessionDto } from './dtos/create.session.dto'

@Injectable()
export class SessionsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly roomsService: RoomsService,
    private readonly storeService: StoreService
  ) {}

  async createSession(data: CreateSessionDto) {
    const sessionId = randomUUID()

    const roomFromGateway = await this.roomsService.findRoomByToken(data.token)
    const roomFromStore = this.storeService.getRoomById(roomFromGateway.terminationId)

    if (!roomFromStore) {
      const room = {
        terminationId: roomFromGateway.terminationId,
        chosenMessage: roomFromGateway.chosenMessage,
        scenario: roomFromGateway.scenario,
        soundtrack: roomFromGateway.soundtrack,
        type: roomFromGateway.type,
        users: [],
      }

      this.storeService.createRoom(room)
    }

    const jwtData = {
      sessionId,
      token: data.token,
      nickname: data.nickname,
      terminationId: roomFromGateway.terminationId,
    }

    const token = Jwt.sign(JSON.stringify(jwtData), this.configService.get('JWT_SECRET'))

    return { token }
  }
}
