import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'

import { CreateSessionDto } from './dtos/create.session.dto'
import { SessionsService } from './sessions.service'

@Controller('sessions')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
    transform: true,
  })
)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('/create-session')
  async createSession(@Body() body: CreateSessionDto) {
    return this.sessionsService.createSession(body)
  }
}
