import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { catchError, firstValueFrom } from 'rxjs'

import { Room } from '@app/common/types/rooms'
import { Scenarios } from '@app/common/types/scenarios'
import { Soundtracks } from '@app/common/types/soundtracks'
import { CurrentUserInfo } from '@app/common/types/users'

@Injectable()
export class ChatbotServerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.chatbotApiUrl = this.configService.getOrThrow<string>('TERMINAI_SERVICE_URL')
  }

  private readonly chatbotApiUrl: string

  async findRoomByToken(token: string): Promise<Omit<Room, 'roomUsers' | 'meta'>> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<{
          terminationId: number
          chosenMessage: string
          scenario: Scenarios
          soundtrack: Soundtracks
          type: CurrentUserInfo['type']
        }>(`${this.chatbotApiUrl}/api/token/${token}`)
        .pipe(
          catchError(error => {
            throw new HttpException(
              error.response?.data ?? 'Error fetching room',
              error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            )
          })
        )
    )

    return {
      roomInfo: {
        terminationId: String(data.terminationId),
        chosenMessage: data.chosenMessage,
        scenario: data.scenario,
        soundtrack: data.soundtrack,
      },
      currentUserInfo: {
        type: data.type,
      },
    }
  }

  async startTermination({
    nameTerminator,
    phoneTerminator,
    nameTerminated,
    phoneTerminated,
  }: {
    nameTerminator: string
    phoneTerminator: string
    nameTerminated: string
    phoneTerminated: string
  }) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<{
          success: boolean
          data: {
            termination_id: number
            status: string
          }
        }>(`${this.chatbotApiUrl}/api/start-termination`, {
          nameTerminator,
          phoneTerminator,
          nameTerminated,
          phoneTerminated,
        })
        .pipe(
          catchError(error => {
            throw new HttpException(
              error.response?.data ?? 'Error starting termination',
              error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            )
          })
        )
    )

    return {
      terminationId: data.data.termination_id,
    }
  }
}
