import { auth } from "./auth";
import { redirect } from "next/navigation";

export type Role = "admin" | "editor" | "viewer";

export const PERMISSIONS = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: true,
    canManageSettings: true,
    canManageBackups: true,
  },
  editor: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageBackups: false,
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageBackups: false,
  },
};

export async function requireAuth() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }
  
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role as Role)) {
    redirect("/admin");
  }
  
  return session;
}

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS.admin): boolean {
  return PERMISSIONS[role][permission] ?? false;
}

