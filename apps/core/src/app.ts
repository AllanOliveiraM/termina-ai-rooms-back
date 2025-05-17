import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { GlobalEnvVariables } from '@app/common/constants/environment'

import { CoreModule } from './core.module'

export async function bootstrap() {
  const app = await NestFactory.create(CoreModule)

  app.enableShutdownHooks()

  const contig = app.get(ConfigService)

  await app.listen(contig.getOrThrow(GlobalEnvVariables.PORT))
}
