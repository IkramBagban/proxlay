import axiosClient, { fetchData } from "@/lib/axios-client";

export const fetchWorkspaces = async (token: string) => {
  if (!token) {
    throw new Error("No token found");
  }

  const workspacesResponse = await fetchData("/workspace", token);
  console.log("Workspaces response:", workspacesResponse);
  return workspacesResponse;
};

export const createWorkspaceAPI = async (
  payload: { name: string },
  token: string
) => {
  if (!token) {
    throw new Error("No token found");
  }

  return axiosClient.post("/workspace/create", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export interface JoinRequestInWorkspacePayload {
  workspaceId: string;
  token: string;
}

export const joinRequestInWorkspaceAPI = async (
  payload: JoinRequestInWorkspacePayload
) => {
  const { workspaceId, token } = payload;
  await axiosClient.post(
    `/workspace/request-join/${workspaceId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface JoinRequestParams {
  membershipId: string;
  action: string;
  workspaceId: string;
}

export const handleJoinRequestAPI = async (
  payload: JoinRequestParams,
  token: string
) => {
  const { membershipId, action, workspaceId } = payload;
  console.log("Joining membershipId with ID:", membershipId);
  if (!token) {
    throw new Error("No token found");
  }

  return axiosClient.post(
    `/workspace/handle-join-request/${workspaceId}?membershipId=${membershipId}`,
    { action },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface HandleInvitePayload {
  workspaceId: string;
  userId: string;
}
export const handleInvite = async (
  payload: HandleInvitePayload,
  token: string
) => {
  const { workspaceId, userId } = payload;

  const response = await axiosClient.post(
    `/workspace/invite/${workspaceId}`,
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export interface HandleInvitationPayload {
  action: "ACCEPT" | "DECLINE";
  membershipId: string;
  workspaceId: string;
}

export const handleInvitationRequestAPI = async (
  payload: HandleInvitationPayload,
  token: string
) => {
  const { action, membershipId, workspaceId } = payload;

  return await axiosClient.post(
    `/handle-invitation-request/${membershipId}`,
    {
      action,
      workspaceId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export interface removeUserFromWorkspacePayload {
  workspaceId: string;
  membershipId: string;
}
export const removeUserFromWorkspaceAPI = async (
  payload: removeUserFromWorkspacePayload,
  token: string
) => {
  const { workspaceId, membershipId } = payload;
  return await axiosClient.post(
    `/workspace/remove-user/${workspaceId}`,
    { membershipId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
