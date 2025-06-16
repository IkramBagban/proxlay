import React from "react";
import { useOutletContext, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  Users,
  Upload,
  Activity,
  Youtube,
  Play
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@clerk/clerk-react";
import axiosClient from "@/lib/axios-client";
import type { ProtectedRouteOutletContext } from "@/routes/protected-route";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

const WorkspaceDashboard = () => {
  const outletCtx: ProtectedRouteOutletContext = useOutletContext();
  const { workspaceId } = useParams();
  console.log("Workspace ID:", workspaceId);
  const { getToken } = useAuth();

  const { data: videos = [] } = useFetch(`/youtube/videos/${workspaceId}`, true);
  const { data: members = [] } = useFetch(`/workspace/members/${workspaceId}`, true);
  const { data: youtubeAuthData } = useFetch(`/youtube/check-auth/${workspaceId}`, true);

  const stats = [
    {
      title: "Total Videos",
      value: videos?.length,
      icon: Video,
      description: "Videos in workspace",
    },
    {
      title: "Team Members",
      value: members?.length,
      icon: Users,
      description: "Active collaborators",
    },
    {
      title: "YouTube Status",
      value: youtubeAuthData?.isAuthorized ? "Connected" : "Not Connected",
      icon: Youtube,
      description: "Integration status",
      status: youtubeAuthData?.isAuthorized,
    },
  ];

  const recentVideos = videos?.slice(0, 3);

  const authorizeYoutubeHandler = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const { data: { redirectUrl } } = await axiosClient.get(
        `/youtube/authorize/${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = redirectUrl;
    } catch (error) {
      console.log('error authorizing youtube', error);
      if(isAxiosError(error) && error.response) {
        toast.error(error.response.data?.error || "Failed to authorize YouTube account.");
      }
      else if (error instanceof Error) {
        toast.error(error.message || "Failed to authorize YouTube account.");
      }
      else {
        toast.error("Failed to authorize YouTube account.");
      }
      console.error("Error authorizing YouTube:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                {stat.status !== undefined && (
                  <Badge variant={stat.status ? "default" : "secondary"}>
                    {stat.status ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = `/workspace/${workspaceId}/youtube/upload`}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New Video
            </Button>

            {!youtubeAuthData?.isAuthorized && outletCtx?.isOwner && (
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={authorizeYoutubeHandler}
              >
                <Youtube className="mr-2 h-4 w-4" />
                Connect YouTube
              </Button>
            )}

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = `/workspace/${workspaceId}/members`}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </Button>
          </CardContent>
        </Card>

        {/* Recent Videos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Videos</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/workspace/${workspaceId}/videos`}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentVideos?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No videos uploaded yet
              </p>
            ) : (
              <div className="space-y-3">
                {(recentVideos ?? [])?.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(video.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {video.privacyStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* YouTube Integration Status */}
      {!youtubeAuthData?.isAuthorized && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">
              YouTube Integration Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-4">
              Connect your YouTube account to start uploading videos directly from this workspace.
            </p>
            <Button onClick={authorizeYoutubeHandler} className="bg-orange-600 hover:bg-orange-700">
              <Youtube className="mr-2 h-4 w-4" />
              Connect YouTube Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkspaceDashboard;