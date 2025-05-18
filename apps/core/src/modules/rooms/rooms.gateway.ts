import { Logger } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

import { Socket, Server } from 'socket.io'

import { StoreService } from '@app/common/store/store.service'

import { AuthService } from '../auth/auth.service'
import { RoomsService } from './rooms.service'

// const ErrorEnum = {
//   INVALID_TOKEN: 'INVALID_TOKEN',
// }

// interface MessageResponseInterface {
//   status: boolean
//   message: object
// }

// interface FindRoomMessageReceiveInterface {
//   token: string
//   sessionId: string
//   sessionName: string
// }

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  @WebSocketServer() server: Server
  constructor(
    private readonly roomsService: RoomsService,
    private readonly storeService: StoreService,
    private readonly authService: AuthService
  ) {}

  private readonly logger = new Logger('rooms.gateway')

  @SubscribeMessage('join')
  async handleEvent(client: Socket): Promise<void> {
    console.log('Rooms in memory (gateway)', this.storeService.getAll())

    const authHeader = client.handshake.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // TODO: Criar tratativa para o erro
      // client.emit('findRoomResponse', {
      //   status: false,
      //   message: { error: 'Authorization header is missing or malformatted.' },
      // });
      // return;
    }

    const token = authHeader.split(' ')[1] // extrai o token removendo o "Bearer"
    const decodedToken = this.authService.validateToken(token)

    const roomFromStore = this.storeService.getRoomById(decodedToken.terminationId)
    if (!roomFromStore) {
      client.emit('sync', { status: false, message: 'Room not found' })
      return
    }

    const userFromStore = this.storeService.getUserById(
      decodedToken.terminationId,
      decodedToken.sessionId
    )

    const userRoom = {
      channelId: client.id,
      sessionId: decodedToken.sessionId,
      nickname: decodedToken.nickname,
      position: 0,
    }

    if (!userFromStore) {
      this.storeService.createUserInRoom(decodedToken.terminationId, userRoom)
    } else {
      this.storeService.updateUserInRoom(decodedToken.terminationId, userRoom)
    }

    // const room = this.storeService.getRoomById(decodedToken.terminationId)

    console.log('room', roomFromStore)

    // for (const user of room.users) {
    //   this.server.to(user.channelId).emit('sync', room)
    // }

    await this.roomsService.syncRooms(decodedToken.terminationId, this.server)

    // console.log('Decoded token:', decodedToken)
    /*
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

    const roomFromStore = this.storeService.get(roomFromGateway.terminationId)

    if (!roomFromStore) {
      this.logger.log('Creating new room', roomFromGateway)
      const room = {
        terminationId: roomFromGateway.terminationId,
        chosenMessage: roomFromGateway.chosenMessage,
        scenario: roomFromGateway.scenario,
        soundtrack: roomFromGateway.soundtrack,
        type: 'auditorium' as const,
      }

      roomFromStore = this.storeService.set(room.terminationId, room)
      this.logger.log('New room created', roomFromGateway)
    }

    let sessionFromStore = this.sessionStore.get(message.sessionId)

    if (!sessionFromStore) {
      const user = {
        sessionId: message.sessionId,
        sessionName: message.sessionName,
      }
      this.logger.log('Creating new user session', user)

      sessionFromStore = this.sessionStore.set(user.sessionId, user)
      this.logger.log('New room created', roomFromGateway)
    }
    */

    // client.

    // session

    // Salvar na store

    // recebe json do backend e enviar para a store (em memoria);

    // rooms (store)

    // toda vez que entra um novo usuário, salvamos ele na store;

    // this.server.to(client.id).emit('sync', decodedToken)

    // client.emit('sync', { event: 'sync' })
  }
}
