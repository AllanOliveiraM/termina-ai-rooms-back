import { Module } from '@nestjs/common'

import { RoomsStore } from './rooms.store'

@Module({
  controllers: [],
  providers: [RoomsStore],
  exports: [RoomsStore],
})
export class RoomsModule {}
