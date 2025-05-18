import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as jwt from 'jsonwebtoken'

import { GlobalEnvVariables } from '@app/common/constants/environment'
import { AuthJwtTokenPayload } from '@app/common/types/auth'

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  validateAndParseToken({ token }: { token: string }): AuthJwtTokenPayload | null {
    try {
      const tokenPayload = jwt.verify(
        token,
        this.configService.getOrThrow(GlobalEnvVariables.JWT_SECRET)
      ) as AuthJwtTokenPayload

      return tokenPayload
    } catch (error) {
      // emoty
    }

    return null
  }
}
