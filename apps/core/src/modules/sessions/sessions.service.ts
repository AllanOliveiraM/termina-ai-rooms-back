import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Jwt from 'jsonwebtoken'

import { CreateSessionDto } from './dtos/create.session.dto'

@Injectable()
export class SessionsService {
  constructor(private readonly configService: ConfigService) {}
  async createSession(data: CreateSessionDto) {
    const token = Jwt.sign(data, this.configService.get('JWT_SECRET'))

    return { token }
  }
}
