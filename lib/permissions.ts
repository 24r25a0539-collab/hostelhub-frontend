import { UserRole } from './auth-context'

export type ModuleAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'manage'
  | 'vote'

export type ModuleName =
  | 'students'
  | 'attendance'
  | 'fund-management'
  | 'expenses'
  | 'cooking-duties'
  | 'announcements'
  | 'complaints'
  | 'visitors'
  | 'elections'
  | 'reports'
  | 'bus-pass'

// Permission matrix: role -> module -> allowed actions
const permissionMatrix: Record<UserRole, Partial<Record<ModuleName, ModuleAction[]>>> = {
  STUDENT: {
    attendance: ['view', 'edit'], // Can view and edit own attendance (max 3 times)
    fund_management: ['view'],
    cooking_duties: ['view'],
    announcements: ['view'],
    complaints: ['create', 'view'],
    visitors: ['view'],
    elections: ['view', 'vote'],
    reports: ['view'],
    'bus-pass': ['view'],
  },
  MAINTAINER: {
    students: ['view', 'create', 'edit', 'delete'],
    attendance: ['view', 'create', 'edit', 'delete', 'manage'],
    'fund-management': ['view', 'create', 'edit', 'delete', 'manage'],
    expenses: ['view', 'create', 'edit', 'delete', 'manage'],
    'cooking-duties': ['view', 'create', 'edit', 'delete', 'manage'],
    announcements: ['view', 'create', 'edit', 'delete', 'manage'],
    complaints: ['view', 'manage'],
    visitors: ['view', 'create', 'edit', 'delete', 'manage'],
    elections: ['view', 'create', 'edit', 'delete', 'manage'],
    reports: ['view', 'create', 'manage'],
    'bus-pass': ['view', 'create', 'edit', 'delete', 'manage'],
  },
}

export function canAccess(role: UserRole, module: ModuleName, action: ModuleAction): boolean {
  const modulePermissions = permissionMatrix[role]?.[module] || []
  return modulePermissions.includes(action)
}

export function getAllowedActions(role: UserRole, module: ModuleName): ModuleAction[] {
  return permissionMatrix[role]?.[module] || []
}

export function hasPermission(
  role: UserRole,
  module: ModuleName,
  action: ModuleAction,
): boolean {
  return canAccess(role, module, action)
}
