import { Module } from '@nestjs/common'

import { RoomsGateway } from './rooms.gateway'
import { RoomsService } from './rooms.service'

@Module({
  imports: [RoomsModule],
  controllers: [],
  providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
