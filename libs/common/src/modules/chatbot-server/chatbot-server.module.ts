import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { ChatbotServerService } from './chatbot-server.service'

@Module({
  imports: [HttpModule],
  providers: [ChatbotServerService],
  exports: [ChatbotServerService],
})
export class ChatbotServerModule {}
