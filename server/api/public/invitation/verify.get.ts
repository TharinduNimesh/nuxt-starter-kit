import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { token, email } = query;

  if (!token || !email || typeof token !== 'string' || typeof email !== 'string') {
    throw createError({
      statusCode: 400,
      message: "Invalid request. Both token and email are required.",
    });
  }

  // Check permission with token and email data
  if (!(await can(null, "Invitation", "read", { token, email }))) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    });
  }

  // Find invitation in database 
  const invitation = await prisma.invitation.findFirst({
    where: {
      email: email,
      token: token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      inviter: true,
    },
  });

  if (!invitation) {
    throw createError({
      statusCode: 404,
      message: "Invalid or expired invitation.",
    });
  }

  return {
    status: "success",
    data: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      inviter: invitation.inviter.name,
    },
  };
});