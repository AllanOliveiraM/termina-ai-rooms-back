export const ErrorCodes = {
  ROOM_TOKEN_NOT_VALID: {
    errorCode: 'ROOM_TOKEN_NOT_VALID',
    message: 'Room token invalid or not found.',
  },
  AUTH_TOKEN_NOT_VALID: {
    errorCode: 'AUTH_TOKEN_NOT_VALID',
    message: 'Auth token invalid.',
  },
  ROOM_NOT_FOUND: {
    errorCode: 'ROOM_NOT_FOUND',
    message: 'The requested room does not exist.',
  },
  USER_NOT_FOUND: {
    errorCode: 'USER_NOT_FOUND',
    message: 'The related user does not exist.',
  },
} as const
