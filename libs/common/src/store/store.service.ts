import { Injectable } from '@nestjs/common'

import { MemoryStore } from './memory.store'

export interface RoomsInterface {
  terminationId: string
  chosenMessage: string
  // TODO?: Ver as possíveis tipagens
  scenario: string
  // TODO?: Ver as possíveis tipagens
  soundtrack: string
  // TODO?: Ver as possíveis tipagens
  type: 'auditorium'
}

@Injectable()
export class StoreService extends MemoryStore<RoomsInterface> {}
