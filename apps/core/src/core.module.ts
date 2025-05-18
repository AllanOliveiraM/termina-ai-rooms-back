import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { LoggerMiddleware } from '@app/common/middlewares/logger.middleware'

import { EnvValidationManager } from './modules/env-manager/env-manager.module'
import { RegisterModule } from './modules/register/register.module'
import { RoomsModule } from './modules/rooms/rooms.module'
import { SessionModule } from './modules/sessions/sessions.module'

@Module({
  imports: [
    EnvValidationManager.forRoot(),
    ScheduleModule.forRoot(),

    RoomsModule,
    SessionModule,
    RegisterModule,
  ],
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
