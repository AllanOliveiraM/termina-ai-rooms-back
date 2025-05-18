import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { ChatbotServerModule } from '@app/common/modules/chatbot-server/chatbot-server.module'
import { StoreModule } from '@app/common/modules/store/store.module'

import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

@Module({
  imports: [StoreModule, HttpModule, ChatbotServerModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionModule {}
