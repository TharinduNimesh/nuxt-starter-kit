import { v4 as uuidv4 } from "uuid";
import { createError } from "h3";
import { inviteUserSchema } from "~~/shared/schemas/invitation";
import { sendMail } from "~~/server/utils/email";

export interface InvitationRequest {
  email: string;
  role: "USER" | "ADMIN";
}

export default defineEventHandler(async (event) => {
  const { auth } = event.context;

  if (!(await auth.can("Invitation", "create"))) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    });
  }

  const body = await validateBody<InvitationRequest>(event, inviteUserSchema);
  await checkExistingInvitation(body.email);
  const invitation = await createInvitation(body, auth.user.id);

  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.APP_URL;

  let emailSent = true;
  try {
    await sendMail({
      to: invitation.email,
      subject: "You've been invited to join our platform",
      template: "invitation",
      context: {
        role: invitation.role,
        inviterName: auth.user.name || auth.user.email.split('@')[0],
        invitationLink: `${baseUrl}/auth/invitation/${invitation.token}`,
        baseUrl: baseUrl as string,
        email: invitation.email,
      }
    });
  } catch (error) {
    console.error('Failed to send invitation email:', error);
    emailSent = false;
  }

  return {
    status: "success",
    message: emailSent ? "Invitation created and email sent successfully" : "Invitation created but email sending failed",
    data: {
      id: invitation.id,
      email: invitation.email,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      emailSent,
    },
  };
});

const checkExistingInvitation = async (email: string) => {
  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email,
      status: "PENDING",
    },
  });

  if (existingInvitation) {
    throw createError({
      statusCode: 400,
      message: "Invitation already sent",
    });
  }
};

const createInvitation = async (body: InvitationRequest, userId: string) => {
  return await prisma.invitation.create({
    data: {
      email: body.email,
      role: body.role,
      token: uuidv4(),
      invitedBy: userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
};
