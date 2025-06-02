import axiosClient from "@/lib/axios-client";
import { useAuth } from "@clerk/clerk-react";
import React, { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Outlet, useParams } from "react-router";

type ProtectedRouteProps = {
  checkOwner?: boolean;
  redirectIfNotOwner?: boolean;
  redirectIfNotPartOfWorkspace?: boolean;
};

interface ProtectedRouteOutletContext {
  token: string | null;
  workspaceId: string | undefined;

  isOwner: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  checkOwner = false,
  redirectIfNotOwner = false,
  redirectIfNotPartOfWorkspace = false,
}) => {
  const { userId, isSignedIn, getToken } = useAuth();
  const [token, setToken] = React.useState<string | null>(null);
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [checkIsWorkspaceOwner, setCheckIsWorkspaceOwner] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);
  console.log("ProtectedRoute props", {
    checkOwner,
    redirectIfNotOwner,
    redirectIfNotPartOfWorkspace,
  });

  const fetchToken = useCallback(async () => {
    try {
      const token = await getToken();
      setToken(token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }, [getToken]);

  const checkWorkspaceRole = useCallback(async (): Promise<{ isOwner: boolean; isPartOfWorkspace: boolean }> => {
    try {
      const response = await axiosClient.get(`/workspace/check-role/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;
      const isPartOfWorkspace = data.isPartOfWorkspace;
      console.log("checkWorkspaceRole response", data);

      setCheckIsWorkspaceOwner(data.isOwner);
      return {
        isOwner: data.isOwner,
        isPartOfWorkspace: isPartOfWorkspace
      };
    } catch (error) {
      console.error("Error checking workspace ownership:", error);
      setCheckIsWorkspaceOwner(false);
      return {
        isOwner: false,
        isPartOfWorkspace: false
      };
    }
  }, [userId, token, workspaceId]);

  useEffect(() => {
    const initialize = async () => {
      if (isSignedIn === false) {
        toast.error("You are not signed in");
        navigate("/");
        return;
      }

      await fetchToken();
      const { isOwner, isPartOfWorkspace } = await checkWorkspaceRole();
      console.log("checkWorkspaceRole", { isOwner, isPartOfWorkspace });
      if (isPartOfWorkspace === false) {
        if (redirectIfNotPartOfWorkspace) {
          toast.error("You are not part of this workspacerr");
          navigate("/workspace");
          return;
        }
      }

      if (checkOwner) {

        if (!isOwner && redirectIfNotOwner) {
          toast.error("You are not authorized to access this workspace");
          navigate("/workspace");
          return;
        }
      }

      setLoading(false);
    };

    initialize();
  }, [isSignedIn, fetchToken, checkOwner, checkWorkspaceRole, redirectIfNotOwner, navigate, redirectIfNotPartOfWorkspace]);

  if (loading) return "loading...";

  return <Outlet context={{ token, workspaceId, isOwner: checkIsWorkspaceOwner }} />;
};

export default ProtectedRoute;
export type { ProtectedRouteOutletContext };
