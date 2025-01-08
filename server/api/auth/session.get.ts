import { verifyAccessToken, verifyRefreshToken, generateTokens } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    // Check for refresh token in cookies
    const refreshToken = getCookie(event, 'refresh_token')
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Verify refresh token
    const refreshPayload = await verifyRefreshToken(refreshToken)
    
    // Generate new tokens
    const tokens = await generateTokens({
      userId: refreshPayload.userId,
      email: refreshPayload.email,
      name: refreshPayload.name,
      role: refreshPayload.role
    })

    // Set new refresh token
    setCookie(event, 'refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return {
      user: {
        id: refreshPayload.userId,
        email: refreshPayload.email,
        name: refreshPayload.name,
        role: refreshPayload.role
      },
      accessToken: tokens.accessToken
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
})
