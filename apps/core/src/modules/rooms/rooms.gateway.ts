import { Logger } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

import { Socket } from 'socket.io'

import { RoomsStore } from '@app/common/store/rooms.store'

import { RoomsService } from './rooms.service'

const ErrorEnum = {
  INVALID_TOKEN: 'INVALID_TOKEN',
}

interface MessageResponseInterface {
  status: boolean
  message: object
}

interface FindRoomMessageReceiveInterface {
  token: string
  sessionId: string
  sessionName: string
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly roomsStore: RoomsStore
  ) {}

  private readonly logger = new Logger('rooms.gateway')

  @SubscribeMessage('findRoom')
  async handleEvent(
    client: Socket,
    message: FindRoomMessageReceiveInterface
  ): Promise<void> {
    this.logger.log('Starting to find room', message)
    if (!message?.token) {
      this.logger.log('Invalid token', message)

      client.emit('findRoomResponse', {
        status: false,
        message: {
          error: ErrorEnum.INVALID_TOKEN,
        },
      })
      return
    }

    this.logger.log('Token is valid', message)

    const roomFromGateway = await this.roomsService.findRoomByToken(message.token)

    let roomFromStore = this.roomsStore.get(roomFromGateway.terminationId)

    if (!roomFromStore) {
      this.logger.log('Creating new room', roomFromGateway)
      const room = {
        terminationId: roomFromGateway.terminationId,
        chosenMessage: roomFromGateway.chosenMessage,
        scenario: roomFromGateway.scenario,
        soundtrack: roomFromGateway.soundtrack,
      }

      roomFromStore = this.roomsStore.set(room.terminationId, room)
      this.logger.log('New room created', roomFromGateway)
    }

    // let sessionFromStore = this.sessionStore.get(message.sessionId)

    // if (!sessionFromStore) {
    //   const user = {
    //     sessionId: message.sessionId,
    //     sessionName: message.sessionName,
    //   }
    //   this.logger.log('Creating new user session', user)

    //   sessionFromStore = this.sessionStore.set(user.sessionId, user)
    //   this.logger.log('New room created', roomFromGateway)
    // }

    // session

    // Salvar na store

    // recebe json do backend e enviar para a store (em memoria);

    // rooms (store)

    // toda vez que entra um novo usuário, salvamos ele na store;

    client.emit('teste2', 'oi')
  }
}
