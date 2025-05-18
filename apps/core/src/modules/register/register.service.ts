import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ChatbotServerService } from '@app/common/modules/chatbot-server/chatbot-server.service'

import { StartTerminationDto } from './dtos/start.termination.dto'

@Injectable()
export class RegisterService {
  constructor(
    private readonly configService: ConfigService,
    private readonly chatbotServerService: ChatbotServerService
  ) {}

  async startTermination({
    startTerminationDto,
  }: {
    startTerminationDto: StartTerminationDto
  }) {
    try {
      await this.chatbotServerService.startTermination(startTerminationDto)
    } catch (err) {
      // ? Track custom errors in future

      throw err
    }
  }
}
