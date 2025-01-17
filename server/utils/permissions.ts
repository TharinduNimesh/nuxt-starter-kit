import type { Prisma, User } from "@prisma/client";

export type Operation = "create" | "read" | "update" | "delete";
export type Resource = "User" | "RefreshToken" | "Invitation";
export type Role = "ADMIN" | "USER" | "PUBLIC";

interface BasePermission<T = any> {
  operations: Operation[];
  description: string;
  conditions?: (
    user: User
  ) =>
    | Prisma.UserWhereInput
    | Prisma.RefreshTokenWhereInput
    | Prisma.InvitationWhereInput;
  check?: (user: User, data: T) => boolean | Promise<boolean>;
}

// Resource-specific permissions
interface UserPermission extends BasePermission {
  resourceId?: (user: User) => string;
}

interface RefreshTokenPermission extends BasePermission {
  userId?: (user: User) => string;
}

interface InvitationPermission extends BasePermission {
  emailMatch?: (user: User) => string;
}

const PERMISSIONS: {
  [R in Role]: {
    User?: UserPermission;
    RefreshToken?: RefreshTokenPermission;
    Invitation?: InvitationPermission;
  };
} = {
  ADMIN: {
    User: {
      operations: ["create", "read", "update", "delete"],
      description: "Full access to all user operations",
    },
    RefreshToken: {
      operations: ["read", "delete"],
      description: "Can view and revoke any refresh token",
    },
    Invitation: {
      operations: ["create", "read", "update", "delete"],
      description: "Full control over invitations",
    },
  },
  USER: {
    User: {
      operations: ["read", "update"],
      description: "Can read and update own profile",
      resourceId: (user) => user.id,
      check: (user, data) => user.id === data?.id,
    },
    RefreshToken: {
      operations: ["read"],
      description: "Can view own refresh tokens",
      conditions: (user) => ({
        userId: user.id,
      }),
    },
    Invitation: {
      operations: ["read"],
      description: "Can view invitations sent to their email",
      conditions: (user) => ({
        email: user.email,
        status: "PENDING",
      }),
    },
  },
  PUBLIC: {
    Invitation: {
      operations: ["read", "update"],
      description: "Can verify and accept/reject invitations with valid token",
      check: async (_, data) => {
        if (!data?.token || !data?.email) return false;

        try {
          let invitation = null;
          if (data.id) {
            invitation = await prisma.invitation.findFirst({
              where: {
                id: data.id,
                email: data.email,
                token: data.token,
                status: "PENDING",
              },
            });
          } else {
            invitation = await prisma.invitation.findFirst({
              where: {
                token: data.token,
                email: data.email,
                status: "PENDING",
              },
            });
          }
          return !!invitation;
        } catch (error) {
          return false;
        }
      },
    },
  },
};

export async function can(
  user: User | null,
  resource: Resource,
  operation: Operation,
  data?: any
): Promise<boolean> {
  const role = user?.role || "PUBLIC";
  const permissions = PERMISSIONS[role]?.[resource];

  if (!permissions?.operations.includes(operation)) {
    return Promise.resolve(false);
  }

  const checks: Promise<boolean>[] = [];

  if (permissions.check) {
    checks.push(Promise.resolve(permissions.check(user!, data)));
  }

  if (
    resource === "User" &&
    (permissions as UserPermission).resourceId &&
    data?.id
  ) {
    const resourceIdFn = (permissions as UserPermission).resourceId;
    checks.push(Promise.resolve(resourceIdFn?.(user!) === data.id));
  }

  return Promise.all(checks).then((results) =>
    results.every((result) => result)
  );
}

export function getConditions(
  user: User,
  resource: Resource
):
  | Prisma.UserWhereInput
  | Prisma.RefreshTokenWhereInput
  | Prisma.InvitationWhereInput
  | undefined {
  return PERMISSIONS[user.role]?.[resource]?.conditions?.(user);
}
