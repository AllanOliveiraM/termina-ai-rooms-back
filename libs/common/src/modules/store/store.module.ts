import { Module } from '@nestjs/common'

import { StoreService } from './store.service'

@Module({
  imports: [],
  controllers: [],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
