export enum Permissions {
  AUTHORIZE_YOUTUBE_ACCOUNT = "authorize_youtube_account",

  INVITE_USER = "invite_user",
  HANDLE_JOIN_REQUEST = "handle_join_request",

  UPLOAD_VIDEO_AND_METADATA = "upload_video_and_metadata",
  EDIT_VIDEO_AND_METADATA = "edit_video_and_metadata",
  UPLOAD_VIDEO_TO_YOUTUBE = "upload_video_to_youtube",
  EDIT_VIDEO_ON_YOUTUBE = "edit_video_on_youtube",

  ASSIGN_ROLE_TO_USER = "assign_role_to_user",
  REMOVE_USER_FROM_WORKSPACE = "remove_user_from_workspace",

  VIEW_INVITES_AND_JOIN_REQUESTS = "view_invites_and_join_requests",
  VIEW_WORKSPACE_MEMBERS = "view_workspace_members",
}

export enum Roles {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

