import { Dayjs } from 'dayjs'

import { Scenarios } from './scenarios'
import { Soundtracks } from './soundtracks'
import { CurrentUserInfo, User } from './users'

export type Room = {
  roomInfo: {
    terminationId: string
    chosenMessage: string
    scenario: Scenarios
    soundtrack: Soundtracks
  }
  currentUserInfo: CurrentUserInfo

  roomUsers: User[]

  meta: {
    createdAt: Dayjs
  }
}
