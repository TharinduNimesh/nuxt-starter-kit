import { H3Event } from 'h3'

interface RateLimitConfig {
  max: number        // maximum number of requests
  window: number     // time window in seconds
  message: string    // error message
}

const store = new Map<string, { count: number; reset: number }>()

export function rateLimit(config: RateLimitConfig) {
  return async (event: H3Event) => {
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    const key = `${ip}-${event.path}`
    const now = Date.now()

    const record = store.get(key) || { count: 0, reset: now + (config.window * 1000) }

    // Reset counter if window has expired
    if (now > record.reset) {
      record.count = 0
      record.reset = now + (config.window * 1000)
    }

    // Increment counter
    record.count++
    store.set(key, record)

    // Set rate limit headers
    setHeaders(event, {
      'X-RateLimit-Limit': config.max.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.max - record.count).toString(),
      'X-RateLimit-Reset': Math.ceil(record.reset / 1000).toString()
    })

    // Check if rate limit exceeded
    if (record.count > config.max) {
      throw createError({
        statusCode: 429,
        message: config.message
      })
    }
  }
}
