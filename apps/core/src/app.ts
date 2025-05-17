import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'

import { CoreModule } from './core.module'

export async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CoreModule)

  app.enableShutdownHooks()

  await app.listen()
}
