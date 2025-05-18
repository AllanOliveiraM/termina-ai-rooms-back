import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import is_number from 'is-number'
import Jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

import { ErrorCodes } from '@app/common/constants/error-codes'
import { ChatbotServerService } from '@app/common/modules/chatbot-server/chatbot-server.service'
import { StoreService } from '@app/common/modules/store/store.service'
import { AuthJwtTokenPayload } from '@app/common/types/auth'
import { UserChairPositions } from '@app/common/types/users'
import { _dayjs } from '@app/common/utils/datetime'

import { CreateSessionDto } from './dtos/create.session.dto'

const maxChairs = 15

@Injectable()
export class SessionsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly storeService: StoreService,
    private readonly chatbotServerService: ChatbotServerService
  ) {}

  private getRandomAvailableChair(excluded: number[]): UserChairPositions {
    const available = Array.from({ length: maxChairs }, (_, i) => i).filter(
      n => !excluded.includes(n)
    )

    if (available.length === 0) return 'random-standing' // no chairs available

    const index = Math.floor(Math.random() * available.length)

    return available[index]
  }

  async createSession(data: CreateSessionDto) {
    try {
      const roomFromChatbotServer = await this.chatbotServerService.findRoomByToken(
        data.token
      )

      let roomFromStore = this.storeService.getRoomById(
        roomFromChatbotServer.roomInfo.terminationId
      )

      const now = _dayjs()

      if (!roomFromStore) {
        roomFromStore = this.storeService.createRoom({
          ...roomFromChatbotServer,

          roomUsers: [],
          meta: {
            createdAt: now,
          },
        })
      }

      const sessionId = randomUUID()

      const jwtPayload: AuthJwtTokenPayload = {
        sessionId,
        terminationId: roomFromStore.roomInfo.terminationId,
      }

      const token = Jwt.sign(
        JSON.stringify(jwtPayload),
        this.configService.getOrThrow('JWT_SECRET')
      )

      const chairPosition = this.getRandomAvailableChair(
        roomFromStore.roomUsers
          .filter(position => is_number(position))
          .map(user => user.chairPosition as number)
      )

      this.storeService.setUserInRoom(roomFromStore.roomInfo.terminationId, {
        socketChannelId: null,
        sessionId,
        nickname: data.nickname,
        chairPosition,
        meta: {
          createdAt: now,
          lastSeenAt: now,
        },
        type: roomFromChatbotServer.currentUserInfo.type as any,
      })

      return { token }
    } catch (err) {
      console.log(err)
      throw new BadRequestException(ErrorCodes.ROOM_TOKEN_NOT_VALID)
    }
  }
}
