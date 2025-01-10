import type { Prisma, User } from "@prisma/client";

export type Operation = "create" | "read" | "update" | "delete";
export type Resource = "User" | "RefreshToken" | "Invitation";

export type Role = "ADMIN" | "USER" | "PUBLIC";

export interface InvitationData {
  token?: string;
  email?: string;
}

type PermissionCheck<T> = boolean | ((user: User, data?: T) => boolean);

interface Permission<T = any> {
  operations: Operation[];
  conditions?: (
    user: User
  ) => Prisma.UserWhereInput | Prisma.RefreshTokenWhereInput;
  check?: PermissionCheck<T>;
}

type Permissions = {
  [K in Resource]: Permission;
};

const PERMISSIONS: { [R in Role]: Permissions } = {
  ADMIN: {
    User: {
      operations: ["create", "read", "update", "delete"],
    },
    RefreshToken: {
      operations: ["read", "delete"],
    },
    Invitation: {
      operations: ["create", "read", "update", "delete"],
    },
  },
  USER: {
    User: {
      operations: ["read", "update"],
      conditions: (user) => ({
        id: user.id,
      }),
      check: (user, data) => user.id === data?.id,
    },
    RefreshToken: {
      operations: ["read"],
      conditions: (user) => ({
        userId: user.id,
      }),
    },
    Invitation: {
      operations: ["read"],
      conditions: (user) => ({
        email: user.email,
      }),
    },
  },
  PUBLIC: {
    User: {
      operations: ["read"],
    },
    RefreshToken: {
      operations: [],
    },
    Invitation: {
      operations: ["read", "update"],
      check: (user, data: InvitationData) => {
        // Allow reading if token and email match
        if (!data.token || !data.email) return false;
        return true; // Actual token/email validation will be done in the route handler
      },
    },
  },
};

export function can(
  user: User | null, // Make user optional for PUBLIC role
  resource: Resource,
  operation: Operation,
  data?: any
): boolean {
  // Handle PUBLIC role when user is null
  const role = user?.role || "PUBLIC";
  const permissions = PERMISSIONS[role]?.[resource];

  if (!permissions) return false;
  if (!permissions.operations.includes(operation)) return false;

  if (permissions.check && data && user) {
    return typeof permissions.check === "function"
      ? permissions.check(user, data)
      : permissions.check;
  }

  return true;
}

export function getConditions(
  user: User,
  resource: Resource
): Prisma.UserWhereInput | Prisma.RefreshTokenWhereInput | undefined {
  return PERMISSIONS[user.role]?.[resource]?.conditions?.(user);
}
