import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const accessSecret = process.env.JWT_ACCESS_SECRET!
const refreshSecret = process.env.JWT_REFRESH_SECRET!

export interface TokenPayload {
	userId: string
	email: string
	name?: string | null
	role: string
}

export const generateTokens = async (payload: TokenPayload) => {
	const accessToken = jwt.sign(payload, accessSecret, {
		expiresIn: process.env.JWT_ACCESS_EXPIRATION
	})

	const refreshToken = jwt.sign(payload, refreshSecret, {
		expiresIn: process.env.JWT_REFRESH_EXPIRATION
	})

	// Store refresh token in database
	await prisma.refreshToken.create({
		data: {
			token: refreshToken,
			userId: payload.userId,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
		}
	})

	return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string): TokenPayload => {
	return jwt.verify(token, accessSecret) as TokenPayload
}

export const verifyRefreshToken = async (token: string) => {
	try {
		const payload = jwt.verify(token, refreshSecret) as TokenPayload
		
		// Check if token exists and is not revoked
		const storedToken = await prisma.refreshToken.findFirst({
			where: {
				token,
				userId: payload.userId,
				revoked: false,
				expiresAt: {
					gt: new Date()
				}
			}
		})

		if (!storedToken) {
			throw new Error('Invalid refresh token')
		}

		return payload
	} catch (error) {
		throw new Error('Invalid refresh token')
	}
}

export const revokeRefreshToken = async (token: string) => {
	await prisma.refreshToken.updateMany({
		where: {
			token
		},
		data: {
			revoked: true
		}
	})
}