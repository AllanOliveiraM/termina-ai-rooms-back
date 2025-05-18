import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { RoomsSyncModule } from '@app/common/modules/rooms-sync/rooms-sync.module'
import { StoreModule } from '@app/common/modules/store/store.module'

import { AuthModule } from '../../../../../libs/common/src/modules/auth/auth.module'
import { RoomsGateway } from './rooms.gateway'

@Module({
  imports: [StoreModule, AuthModule, HttpModule, RoomsSyncModule],
  controllers: [],
  providers: [RoomsGateway],
})
export class RoomsModule {}
