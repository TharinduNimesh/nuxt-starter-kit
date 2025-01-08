import { H3Event } from "h3";
import { verifyAccessToken } from "../utils/jwt";

export default defineEventHandler(async (event: H3Event) => {
  // Skip auth check for non-API routes and auth-related API routes
  if (!event.path.startsWith("/api/") || event.path.includes("/api/auth/")) {
    return;
  }

  try {
    const token = event.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    const payload = verifyAccessToken(token);
    event.context.auth = payload;
  } catch (error) {
    return createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
});
