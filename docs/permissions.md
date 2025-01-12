# ABAC (Attribute-Based Access Control)

This application uses a hybrid RBAC + ABAC system. We define roles (e.g., `ADMIN`, `USER`) and also allow checks based on user attributes. Here's how it works:

## How It Works

1. **Roles & Resources**  
   Each role (ADMIN, USER, PUBLIC) has access rules for specific resources (User, RefreshToken, Invitation, etc.).

2. **Operations**  
   Each resource has an allowed set of operations: `create`, `read`, `update`, `delete`.

3. **Attribute Checks**  
   We optionally define a `check` function or database `conditions` to enforce more granular permissions.

4. **Public Role**  
   If no user is logged in, the system treats the access as `PUBLIC` and applies its permissions.

## permission.ts Structure

We've defined a `PERMISSIONS` object with role-based rules. An example snippet:

```ts
export function can(user: User | null, resource: Resource, operation: Operation, data?: any) {
  // ...existing code...
}
```

- `user`: The current user, or `null` for public access.
- `resource`: The resource type (e.g., `User`).
- `operation`: The requested operation (`create`, `read`, etc.).
- `data`: Optional data for attribute checks.

## Defining Rules

In the `permissions.ts` file, each role is assigned an object to specify:
1. **Allowed Operations**: An array of operations (`create`, `read`, `update`, or `delete`).  
2. **Conditions (optional)**: A function returning Prisma query filters to limit what data can be accessed.  
3. **Check (optional)**: A function that implements custom attribute checks.

Example snippet:

```ts
// ...existing code...
const PERMISSIONS: { [R in Role]: Permissions } = {
  ADMIN: {
    User: {
      operations: ["create", "read", "update", "delete"]
      // ...you can add conditions or checks if needed
    },
    Invitation: {
      operations: ["create", "read", "update", "delete"]
      // ...
    },
    // ...other resources
  },
  USER: {
    User: {
      operations: ["read", "update"],
      conditions: (user) => ({
        // Prisma filters
        id: user.id
      }),
      check: (user, data) => user.id === data?.id
    },
    // ...other resources
  },
  // ...other roles
}
```

You can add or remove roles, resources, or operations based on your application's requirements. The `conditions` function, if provided, injects database filters automatically, while `check` is used for extra runtime checks.

## Example Usage

In an API route (e.g., `index.post.ts`):

```ts
// ...existing code...
if (!auth.can("Invitation", "create")) {
  throw createError({
    statusCode: 403,
    message: "Forbidden",
  });
}
// ...existing code...
```

This checks whether the current user can `create` an `Invitation`. If not, a `403` error is thrown.

## Getting Conditions for Queries

We provide a `getConditions` function to apply database filters. For example:

```ts
const user = await prisma.user.findMany({
  where: auth.getConditions("User"),
});
```

This ensures only the permitted records are fetched.

## Summary

- Use `can` to check permissions.  
- Use `getConditions` for database-level attribute filtering.  
- Extend `PERMISSIONS` with your own resources and operations.  
- When defining rules, set `operations` for each resource, optionally add `conditions` for Prisma filters, and a `check` function for more advanced checks.