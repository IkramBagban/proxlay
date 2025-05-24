// app/workspace/workspace-details/videos.tsx
import React from "react";
import { useParams, NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@clerk/clerk-react";
import axiosClient from "@/lib/axios-client";
import toast from "react-hot-toast";

const WorkspaceVideos = () => {
  const { workspaceId } = useParams();
  const { getToken } = useAuth();

  const { data: videos = [], loading: videosLoading } = useFetch(
    `/youtube/videos/${workspaceId}`,
    true
  );

  const { data: youtubeAuthData } = useFetch(
    `/youtube/check-auth/${workspaceId}`,
    true
  );

  const uploadToYoutubeHandler = async (payload: any) => {
    const prompt = window.confirm(
      `Are you sure you want to upload this video with the title ${payload.title}?`
    );
    
    if (!prompt) {
      toast.error("Upload cancelled");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authorization token is required");
        return;
      }

      const { data } = await axiosClient.post(
        `/youtube/upload-to-youtube/${workspaceId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Video uploaded to YouTube successfully!");
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Error uploading to YouTube:", error);
      toast.error("Failed to upload video to YouTube");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Videos</h1>
          <p className="text-sm text-muted-foreground">
            Manage and upload videos in this workspace
          </p>
        </div>
        <NavLink to={`/workspace/${workspaceId}/youtube/upload`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Upload Video
          </Button>
        </NavLink>
      </div>

      {/* YouTube Authorization Status */}
      {!youtubeAuthData?.isAuthorized && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-800">
                  YouTube not connected
                </p>
                <p className="text-sm text-orange-700">
                  Connect your YouTube account to upload videos directly
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                onClick={() => window.location.href = `/workspace/${workspaceId}`}
              >
                Connect Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        {videosLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No videos yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload your first video to get started
                  </p>
                </div>
                <NavLink to={`/workspace/${workspaceId}/youtube/upload`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                </NavLink>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Video Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {video.description}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(video.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Tags and Metadata */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">
                        {video.privacyStatus}
                      </Badge>
                      <Badge variant="outline">
                        Category {video.categoryId}
                      </Badge>
                      {video.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                      {video.tags.length > 3 && (
                        <Badge variant="secondary">
                          +{video.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <img
                          src={video.uploader.imageUrl}
                          alt={`${video.uploader.firstName} ${video.uploader.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-muted-foreground">
                          Uploaded by {video.uploader.firstName}{" "}
                          {video.uploader.lastName}
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => uploadToYoutubeHandler({
                          videoId: video.id,
                          title: video.title,
                          description: video.description,
                          tags: video.tags,
                          categoryId: video.categoryId,
                          privacyStatus: video.privacyStatus,
                          workspaceId: workspaceId,
                          key: video.key,
                        })}
                        disabled={!youtubeAuthData?.isAuthorized}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload to YouTube
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceVideos;