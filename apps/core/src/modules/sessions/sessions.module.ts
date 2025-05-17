import { Module } from '@nestjs/common'

import { MemoryStore } from '@app/common/store/memory.store'

import { RoomsModule } from '../rooms/rooms.module'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

@Module({
  imports: [RoomsModule],
  controllers: [SessionsController],
  providers: [SessionsService, MemoryStore],
})
export class SessionModule {}
