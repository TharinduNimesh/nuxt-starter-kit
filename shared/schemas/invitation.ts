import { z } from 'zod'

export const inviteUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  role: z
    .enum(['USER', 'ADMIN'] as const, {
      required_error: 'Role is required',
      invalid_type_error: 'Invalid role selected'
    }),
  message: z
    .string()
    .max(500, 'Message cannot exceed 500 characters')
    .optional()
})

export type InviteUserSchema = z.infer<typeof inviteUserSchema>

export const acceptInvitationSchema = z.object({
  token: z
    .string()
    .min(1, 'Invitation token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
})

export type AcceptInvitationSchema = z.infer<typeof acceptInvitationSchema>
