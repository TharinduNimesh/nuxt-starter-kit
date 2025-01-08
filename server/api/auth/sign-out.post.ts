import { revokeRefreshToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')
  
  if (refreshToken) {
    await revokeRefreshToken(refreshToken)
    deleteCookie(event, 'refresh_token')
  }
  
  return { message: 'Signed out successfully' }
})
