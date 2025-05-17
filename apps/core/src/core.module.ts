import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'

import { LoggerMiddleware } from '@app/common/middlewares/logger.middleware'

import { EnvValidationManager } from './modules/env-manager/env-manager.module'

@Module({
  imports: [EnvValidationManager.forRoot()],
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
