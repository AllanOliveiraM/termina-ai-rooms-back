import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Request, Response, NextFunction } from 'express'

import { GlobalEnvVariables } from '@app/common/constants/environment'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request

    const userAgent = request.get('user-agent') || ''

    if (this.configService.get(GlobalEnvVariables.NODE_ENV) === 'development') {
      response.on('close', () => {
        const { statusCode } = response

        if (statusCode < 400) {
          this.logger.log(`${method} ${originalUrl} ${statusCode} - ${userAgent}`)
        } else {
          this.logger.error(`${method} ${originalUrl} ${statusCode} - ${userAgent}`)
        }
      })
    }

    next()
  }
}
