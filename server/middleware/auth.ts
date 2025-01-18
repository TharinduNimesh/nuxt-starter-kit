import { H3Event } from "h3";
import { verifyAccessToken } from "../utils/jwt";
import { can, getConditions } from "../utils/permissions";
import type { User } from "@prisma/client";

export default defineEventHandler(async (event: H3Event) => {
  const publicRoutes = [
    "/api/auth/",
    "/api/uploadthing",
    "/api/public/",
  ];
  if (
    !event.path.startsWith("/api/") ||
    publicRoutes.some((route) => event.path.includes(route))
  ) {
    return;
  }

  try {
    const token = event.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Add auth context for downstream handlers
    event.context.auth = {
      user,
      can: async (resource: string, operation: string, data?: any) =>
        await can(user, resource as any, operation as any, data),
      getConditions: (resource: string) => getConditions(user, resource as any),
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
});
