import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { StoreModule } from '@app/common/store/store.module'

import { RoomsModule } from '../rooms/rooms.module'
import { RoomsService } from '../rooms/rooms.service'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

@Module({
  imports: [StoreModule, RoomsModule, HttpModule],
  controllers: [SessionsController],
  providers: [SessionsService, RoomsService],
})
export class SessionModule {}
