import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { StoreModule } from '@app/common/modules/store/store.module'

import { RoomsSyncService } from './rooms-sync.service'

@Module({
  imports: [StoreModule],
  providers: [RoomsSyncService],
  exports: [RoomsSyncService],
})
export class RoomsSyncModule {}
