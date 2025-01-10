
import type { H3Event } from 'h3'
import type { AuthContext } from '../types/auth'

export function getAuth(event: H3Event): AuthContext {
  const auth = event.context.auth
  if (!auth) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  return auth
}