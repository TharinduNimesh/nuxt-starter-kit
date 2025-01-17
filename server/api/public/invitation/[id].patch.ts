import { createError } from "h3";
import { z } from "zod";
import { can } from "~~/server/utils/permissions";

// Schema for request body validation
const updateInvitationSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either ACCEPTED or DECLINED",
  }),
});

export default defineEventHandler(async (event) => {
  try {
    // Get id from params
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Invitation ID is required",
      });
    }

    // Get email and token from query
    const query = getQuery(event);
    const { token, email } = query;

    if (!token || !email || typeof token !== "string" || typeof email !== "string") {
      throw createError({
        statusCode: 400,
        message: "Invalid request. Both token and email are required.",
      });
    }

    // Check permission with id, token and email
    if (!(await can(null, "Invitation", "update", { id, token, email }))) {
      throw createError({
        statusCode: 403,
        message: "Forbidden",
      });
    }

    // Validate request body
    const body = await readBody(event);
    const validatedBody = updateInvitationSchema.parse(body);

    // Prepare update data based on status
    const updateData: any = {
      status: validatedBody.status,
    };

    // Add additional fields when status is ACCEPTED
    if (validatedBody.status === 'ACCEPTED') {
      updateData.isAccepted = true;
      updateData.acceptedAt = new Date();
    }

    // Update invitation status and related fields
    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: updateData,
      include: {
        inviter: true,
      },
    });

    return {
      status: "success",
      data: {
        id: updatedInvitation.id,
        email: updatedInvitation.email,
        role: updatedInvitation.role,
        status: updatedInvitation.status,
        expiresAt: updatedInvitation.expiresAt,
        inviter: updatedInvitation.inviter.name,
        isAccepted: updatedInvitation.isAccepted,
        acceptedAt: updatedInvitation.acceptedAt,
      },
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: error.errors[0].message,
      });
    }
    throw error;
  }
});