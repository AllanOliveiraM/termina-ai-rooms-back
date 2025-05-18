import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'

import { StartTerminationDto } from './dtos/start.termination.dto'
import { RegisterService } from './register.service'

@Controller('register')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
    transform: true,
  })
)
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('/start-termination')
  async startTermination(@Body() startTerminationDto: StartTerminationDto) {
    return this.registerService.startTermination({
      startTerminationDto,
    })
  }
}
