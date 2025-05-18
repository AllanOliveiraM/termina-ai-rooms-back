import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as jwt from 'jsonwebtoken'

import { AuthJwtTokenDto } from './dtos/auth.jwt.token.dto'

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  validateToken(token: string): AuthJwtTokenDto | null {
    try {
      return jwt.verify(token, this.configService.get('JWT_SECRET')) as AuthJwtTokenDto
    } catch (error) {
      return null
      // throw new UnauthorizedException(error?.message)
    }
  }
}
