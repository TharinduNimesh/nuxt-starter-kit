import { v4 as uuidv4 } from 'uuid';
import { createError } from 'h3';

export interface InvitationRequest {
  email: string;
  role: 'USER' | 'ADMIN';
}

export default defineEventHandler(async (event) => {
  // Get authenticated user from auth context
  const { auth } = event.context;
  if (!auth?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }

  // Check permissions using auth context
  if (!auth.can('Invitation', 'create')) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    });
  }

  // Get request body
  const body = await readBody<InvitationRequest>(event);

  // Validate request
  if (!body.email || !body.role) {
    throw createError({
      statusCode: 400,
      message: 'Email and role are required'
    });
  }

  // Check if invitation already exists
  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email: body.email,
      status: 'PENDING'
    }
  });

  if (existingInvitation) {
    throw createError({
      statusCode: 400,
      message: 'Invitation already sent'
    });
  }

  // Create invitation
  const invitation = await prisma.invitation.create({
    data: {
      email: body.email,
      role: body.role,
      token: uuidv4(),
      invitedBy: auth.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }
  });

  // TODO: Send email with invitation link
  // const invitationLink = `${config.APP_URL}/invitation/${invitation.token}?email=${invitation.email}`;

  return {
    status: 'success',
    data: {
      id: invitation.id,
      email: invitation.email,
      token: invitation.token,
      expiresAt: invitation.expiresAt
    }
  };
});