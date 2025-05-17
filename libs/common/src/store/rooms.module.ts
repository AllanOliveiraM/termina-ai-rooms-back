import { Module } from '@nestjs/common'

import { StoreService } from './rooms.store'

@Module({
  controllers: [],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
