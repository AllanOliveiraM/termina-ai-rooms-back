import { Module } from '@nestjs/common'

import { StoreModule } from '@app/common/store/rooms.module'

import { RoomsGateway } from './rooms.gateway'
import { RoomsService } from './rooms.service'

@Module({
  imports: [StoreModule],
  controllers: [],
  providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
