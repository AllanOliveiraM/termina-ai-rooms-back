import { HttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { catchError, firstValueFrom } from 'rxjs'

import { StartTerminationDto } from './dtos/start.termination.dto'

@Injectable()
export class RegisterService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private getApiUrl(): string {
    return this.configService.get<string>('TERMINAI_SERVICE_URL')
  }

  async registerStartTermination(data: StartTerminationDto) {
    const apiUrl = this.getApiUrl()

    const registerObservable = this.httpService
      .post(`${apiUrl}/api/start-termination`, data)
      .pipe(
        catchError(error => {
          throw new HttpException(
            error.response?.data ?? 'Error starting termination',
            error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
          )
        })
      )
    const registerResponse = await firstValueFrom(registerObservable)

    return registerResponse.data
  }
}
