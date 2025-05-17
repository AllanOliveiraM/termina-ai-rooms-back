import { ConfigModule } from '@nestjs/config'

import * as joi from 'joi'

import { GlobalEnvVariables } from '@app/common/constants/environment'

export class EnvValidationManager {
  static forRoot() {
    return ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        [GlobalEnvVariables.PORT]: joi.number().required(),

        [GlobalEnvVariables.JWT_SECRET]: joi.string().required(),

        [GlobalEnvVariables.NODE_ENV]: joi.string().required(),
      }),

      envFilePath: './.env',
    })
  }
}
