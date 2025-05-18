import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { catchError, firstValueFrom } from 'rxjs'
import { Server } from 'socket.io'

import { RoomInterface, StoreService } from '@app/common/store/store.service'

@Injectable()
export class RoomsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly storeService: StoreService
  ) {}
  getApiUrl(): string {
    return this.configService.get<string>('TERMINAI_SERVICE_URL')
  }

  async findRoomByToken(token: string): Promise<RoomInterface> {
    const apiUrl = this.getApiUrl()

    const roomObservable = this.httpService.get(`${apiUrl}/api/token/${token}`).pipe(
      catchError(error => {
        throw new HttpException(
          error.response?.data ?? 'Error fetching room',
          error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        )
      })
    )
    const roomResponse = await firstValueFrom(roomObservable)

    return roomResponse.data
  }

  async syncRooms(terminationId: string, server: Server): Promise<void> {
    const room = this.storeService.getRoomById(terminationId)

    for (const user of room.users) {
      server.to(user.channelId).emit('sync', { status: true, data: { room } })
    }
  }
}
