import React from "react";
import { NavLink, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import axiosClient from "@/lib/axios-client";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const { getToken } = useAuth();

  const [isYoutubeAuthorized, setIsYoutubeAuthorized] = React.useState(false);
  const [isYoutubeAuthorizedLoading, setIsYoutubeAuthorizedLoading] =
    React.useState(true);


  const { data: videos = [], loading: videosLoading } = useFetch(
    `/youtube/videos/${workspaceId}`,
    true
  );

  const { data: youtubeAuthData } = useFetch(
    `/youtube/check-auth/${workspaceId}`,
    true
  );
  React.useEffect(() => {
    if (youtubeAuthData) {
      setIsYoutubeAuthorized(youtubeAuthData.isAuthorized);
      setIsYoutubeAuthorizedLoading(false);
    }
  }, [youtubeAuthData]);

  const authorizeYoutubeHandler = async () => {
    if (!workspaceId) {
      console.error("Workspace ID is required");
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        console.error("Authorization token is required");
        return;
      }

      const {
        data: { redirectUrl },
      } = await axiosClient.get(`/youtube/authorize/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error getting token:", error);
      return;
    }
  };

  const uploadToYoutubeHandler = async (payload: any) => {
    const prompt = window.confirm(`Are you sure you want to upload this video with the title ${payload.title}?`);
    if (!workspaceId) {
      console.error("Workspace ID is required");
      return;
    }

    if (!prompt) {
      console.log("Upload cancelled");
      toast.error("Upload cancelled");
      return;
    }

    console.log("payload", payload);

    try {
      const token = await getToken();
      if (!token) {
        console.error("Authorization token is required");
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
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Error uploading to YouTube:", error);
    }
  };
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Workspace Details</h2>
          <p className="text-muted-foreground text-sm">
            Workspace ID: <span className="font-mono">{workspaceId}</span>
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() => {
              if (isYoutubeAuthorized) {
                // Revoke Youtube Access
                alert("Revoke Youtube Access");
              } else {
                authorizeYoutubeHandler();
              }
            }}
            className="flex items-center gap-2"
          >
            {isYoutubeAuthorizedLoading
              ? "Loading..."
              : isYoutubeAuthorized
              ? "Revoke Youtube Access"
              : "Authorize Youtube"}
          </Button>
        </div>
      </div>

     
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Videos</h3>
          <NavLink
            to={`/workspace/${workspaceId}/youtube/upload`}
            className="text-sm text-primary hover:underline"
          >
            + Upload Video
          </NavLink>
        </div>

        {videosLoading ? (
          <p className="text-muted-foreground text-sm">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No videos uploaded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <Card key={video.id} className="rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h4 className="text-lg font-semibold">{video.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(video.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {video.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {video.privacyStatus}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      Category {video.categoryId}
                    </Badge>
                    {video.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="capitalize"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                    <div className="flex items-center gap-2 mt-3">
                      <img
                        src={video.uploader.imageUrl}
                        alt={`${video.uploader.firstName} ${video.uploader.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-muted-foreground">
                        Uploaded by: {video.uploader.firstName}{" "}
                        {video.uploader.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        className="text-sm"
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
                        disabled={!isYoutubeAuthorized}
                      >
                        Upload to Youtube
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

export default WorkspaceDetails;
