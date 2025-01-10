
export default defineEventHandler(async (event) => {
  const { auth } = event.context;
  const id = event.context.params?.id;

  if (!auth.can('User', 'read', { id })) {
    throw createError({
      statusCode: 403,
      message: 'Insufficient permissions'
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
      ...auth.getConditions('User')
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    });
  }

  return user;
});