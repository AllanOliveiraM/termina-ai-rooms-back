import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { StoreModule } from '@app/common/store/store.module'
import { StoreService } from '@app/common/store/store.service'

import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { RoomsGateway } from './rooms.gateway'
import { RoomsService } from './rooms.service'

@Module({
  imports: [StoreModule, RoomsModule, AuthModule, HttpModule],
  controllers: [],
  providers: [RoomsService, AuthService, RoomsGateway, StoreService],
})
export class RoomsModule {}
