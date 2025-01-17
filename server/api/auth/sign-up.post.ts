import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";
import { generateTokens } from "../../utils/jwt";
import { validateBody } from "../../utils/validation";
import {
  signInSchema as signUpSchema,
  type SignInSchema,
} from "../../../shared/schemas/auth";
import { rateLimit } from '../../utils/rateLimit'

interface SignUpBody extends SignInSchema {
  invitationToken?: string;
}

export default defineEventHandler(async (event) => {
  // Rate limit: 3 attempts per hour
  await rateLimit({
    max: 3,
    window: 3600,
    message: 'Too many sign-up attempts. Please try again in an hour.'
  })(event)

  const config = useRuntimeConfig();
  
  try {
    // Validate and sanitize request body
    const data = await validateBody<SignUpBody>(event, signUpSchema);
    const email = data.email.toLowerCase();

    // Check if user exists (case-insensitive)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "User already exists",
      });
    }

    // Find active invitation if exists
    const invitation = await prisma.invitation.findFirst({
      where: {
        email,
        status: "ACCEPTED",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    // If sign up is disabled and no valid invitation, prevent sign up
    if (!config.public.isSignUpEnabled && !invitation) {
      throw createError({
        statusCode: 403,
        message: "Sign up is currently disabled",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user with role from invitation or default USER role
    const user = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: invitation?.role || 'USER'  // Use invitation role if available
        },
      });

      // If invitation exists, update its status
      if (invitation) {
        await prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED" },
        });
      }

      return newUser;
    });

    // Generate tokens with role
    const tokens = await generateTokens({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Set refresh token in HTTP-only cookie
    setCookie(event, 'refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken: tokens.accessToken // Only send access token to client
    };
  } catch (error: any) {
    // Add rate limit specific error handling
    if (error.statusCode === 429) {
      throw error
    }
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
      data: error.data, // Pass validation errors if any
    });
  }
});
