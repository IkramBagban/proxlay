import { Permissions, Roles } from "./permissions";

const RolePermissions: Record<Roles, Permissions[]> = {
  [Roles.OWNER]: [
    Permissions.AUTHORIZE_YOUTUBE_ACCOUNT,

    Permissions.INVITE_USER,
    Permissions.HANDLE_JOIN_REQUEST,
    Permissions.UPLOAD_VIDEO_AND_METADATA,
    Permissions.EDIT_VIDEO_AND_METADATA,
    Permissions.UPLOAD_VIDEO_TO_YOUTUBE,
    Permissions.EDIT_VIDEO_ON_YOUTUBE,
    Permissions.VIEW_INVITES_AND_JOIN_REQUESTS,
    Permissions.VIEW_WORKSPACE_MEMBERS,
    Permissions.ASSIGN_ROLE_TO_USER,
    Permissions.REMOVE_USER_FROM_WORKSPACE,
  ],
  [Roles.MANAGER]: [
    Permissions.INVITE_USER,
    Permissions.HANDLE_JOIN_REQUEST,
    Permissions.UPLOAD_VIDEO_AND_METADATA,
    Permissions.EDIT_VIDEO_AND_METADATA,
    Permissions.UPLOAD_VIDEO_TO_YOUTUBE,
    Permissions.EDIT_VIDEO_ON_YOUTUBE,
    Permissions.VIEW_INVITES_AND_JOIN_REQUESTS,
    Permissions.VIEW_WORKSPACE_MEMBERS,
    Permissions.ASSIGN_ROLE_TO_USER,
    Permissions.REMOVE_USER_FROM_WORKSPACE,
  ],
  [Roles.MEMBER]: [
    Permissions.UPLOAD_VIDEO_AND_METADATA,
    Permissions.EDIT_VIDEO_AND_METADATA,
    Permissions.VIEW_WORKSPACE_MEMBERS,
  ],
};

export class RBAC {
  hasPermission(role: Roles, permission: Permissions): boolean {
    const allowed = RolePermissions[role] || [];
    return allowed.includes(permission);
  }
}

export const rbac = new RBAC();
