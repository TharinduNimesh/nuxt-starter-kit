import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
	try {
		// Test the connection by counting users
		const userCount = await prisma.user.count()
		return {
			status: 'success',
			message: 'Successfully connected to MongoDB',
			userCount
		}
	} catch (error) {
		console.error('Database connection error:', error)
		return {
			status: 'error',
			message: 'Failed to connect to MongoDB',
			error: error instanceof Error ? error.message : 'Unknown error'
		}
	}
})