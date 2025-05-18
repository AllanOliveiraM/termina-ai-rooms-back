import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'

import { LoggerMiddleware } from '@app/common/middlewares/logger.middleware'

import { AuthModule } from './modules/auth/auth.module'
import { EnvValidationManager } from './modules/env-manager/env-manager.module'
import { RoomsModule } from './modules/rooms/rooms.module'
import { SessionModule } from './modules/sessions/sessions.module'

@Module({
  imports: [EnvValidationManager.forRoot(), RoomsModule, SessionModule, AuthModule],
  controllers: [],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: `*`,
      version: '1',
      method: RequestMethod.ALL,
    })
  }
}
