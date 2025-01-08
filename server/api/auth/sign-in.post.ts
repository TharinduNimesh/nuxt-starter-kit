import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";
import { generateTokens } from "../../utils/jwt";
import { validateBody } from "../../utils/validation";
import { signInSchema, type SignInSchema } from "../../../shared/schemas/auth";
import { rateLimit } from '../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Rate limit: 5 attempts per minute
  await rateLimit({
    max: 5,
    window: 60,
    message: 'Too many sign-in attempts. Please try again in a minute.'
  })(event)

  try {
    // Validate and sanitize request body
    const data = await validateBody<SignInSchema>(event, signInSchema);
    
    // Find user with lowercase email
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

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
    });

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
      data: error.data // Pass validation errors if any
    });
  }
});
