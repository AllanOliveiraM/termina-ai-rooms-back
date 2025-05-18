import { Module } from '@nestjs/common'

import { ChatbotServerModule } from '@app/common/modules/chatbot-server/chatbot-server.module'

import { RegisterController } from './register.controller'
import { RegisterService } from './register.service'

@Module({
  imports: [ChatbotServerModule],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
