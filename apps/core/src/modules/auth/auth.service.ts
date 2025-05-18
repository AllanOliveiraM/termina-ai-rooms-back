import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  validateToken(token: string): any {
    try {
      const decoded = jwt.verify(token, this.configService.get('JWT_SECRET'))
      return decoded
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
