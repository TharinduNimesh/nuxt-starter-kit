import type { User } from '@prisma/client'
import type { Resource, Operation } from '../utils/permissions'

export interface AuthContext {
  user: User
  can: (resource: Resource, operation: Operation, data?: any) => boolean
  getConditions: (resource: Resource) => Record<string, any> | undefined
}

// Augment H3 event context
declare module 'h3' {
  interface H3EventContext {
    auth: AuthContext
  }
}
