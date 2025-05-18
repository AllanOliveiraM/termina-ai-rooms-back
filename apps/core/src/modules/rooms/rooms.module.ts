import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { StoreModule } from '@app/common/store/store.module'

import { RoomsGateway } from './rooms.gateway'
import { RoomsService } from './rooms.service'

@Module({
  imports: [StoreModule, RoomsModule, HttpModule],
  controllers: [],
  providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
