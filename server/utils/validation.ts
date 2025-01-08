import { ZodSchema } from 'zod'
import { H3Event } from 'h3'

export async function validateBody<T>(event: H3Event, schema: ZodSchema) {
  const body = await readBody(event)
  
  try {
    // Zod will automatically remove fields that aren't in the schema
    const data = schema.parse(body)
    
    // For email fields, ensure they are lowercase
    if (typeof data === 'object' && data !== null && 'email' in data) {
      data.email = data.email.toLowerCase()
    }
    
    return data as T
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: 'Validation failed',
      data: error.errors
    })
  }
}
