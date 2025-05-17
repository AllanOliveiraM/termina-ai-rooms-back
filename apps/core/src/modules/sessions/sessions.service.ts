import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Jwt from 'jsonwebtoken'

import { StoreService } from '@app/common/store/store.service'

import { CreateSessionDto } from './dtos/create.session.dto'

@Injectable()
export class SessionsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly storeService: StoreService
  ) {}

  async createSession(data: CreateSessionDto) {
    const token = Jwt.sign(JSON.stringify(data), this.configService.get('JWT_SECRET'))

    return { token }
  }
}
