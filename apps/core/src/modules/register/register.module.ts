import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { RegisterController } from './register.controller'
import { RegisterService } from './register.service'

@Module({
  imports: [HttpModule],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
