import { Injectable } from '@nestjs/common'

import { MemoryStore } from './memory.store'

export interface RoomsInterface {
  terminationId: string
  chosenMessage: string
  scenario: string
  soundtrack: string
}

@Injectable()
export class StoreService extends MemoryStore<RoomsInterface> {}
