import { prisma } from "../../utils/prisma";
import { generateTokens, verifyRefreshToken } from "../../utils/jwt";

export default defineEventHandler(async (event) => {
  try {
    const { refreshToken } = await readBody(event);

    if (!refreshToken) {
      throw createError({
        statusCode: 400,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);

    // Generate new tokens
    const tokens = await generateTokens({
      userId: payload.userId,
      email: payload.email,
    });

    // Revoke old refresh token
    await prisma.refreshToken.updateMany({
      where: {
        token: refreshToken,
      },
      data: {
        revoked: true,
      },
    });

    return tokens;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || "Invalid refresh token",
    });
  }
});
