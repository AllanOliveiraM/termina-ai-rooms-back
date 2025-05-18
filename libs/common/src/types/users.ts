import { Dayjs } from 'dayjs'

export type UserChairPositions = number | 'random-standing'

export type User = {
  socketChannelId: string | null
  sessionId: string
  nickname: string
  chairPosition: UserChairPositions

  meta: {
    createdAt: Dayjs
    lastSeenAt: Dayjs
  }
}

export type CurrentUserInfo = {
  type: 'auditorium' | 'terminator' | 'terminated'
}
