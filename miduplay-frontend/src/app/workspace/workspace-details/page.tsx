import React from "react";
import { NavLink, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const { data: members = [], loading: membersLoading } = useFetch(
    `/workspace/members/${workspaceId}`,
    true
  );
  const { data: videos = [], loading: videosLoading } = useFetch(
    `/youtube/videos/${workspaceId}`,
    true
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Workspace Details</h2>
        <p className="text-muted-foreground text-sm">
          Workspace ID: <span className="font-mono">{workspaceId}</span>
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Members</h3>

        {membersLoading ? (
          <p className="text-muted-foreground text-sm">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-muted-foreground text-sm">No members found.</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const { firstName, lastName, email, imageUrl } = member.user;

              return (
                <Card key={member.id} className="rounded-2xl shadow-sm">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={imageUrl}
                        alt={`${firstName} ${lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{firstName} {lastName}</h4>
                        <p className="text-sm text-muted-foreground">{email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">{member.role}</Badge>
                          <Badge variant={member.status === "active" ? "default" : "secondary"} className="capitalize">
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit {firstName}'s role</span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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
          <p className="text-muted-foreground text-sm">No videos uploaded yet.</p>
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

                  <p className="text-sm text-muted-foreground">{video.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">{video.privacyStatus}</Badge>
                    <Badge variant="outline" className="capitalize">Category {video.categoryId}</Badge>
                    {video.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="capitalize">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <img
                      src={video.uploader.imageUrl}
                      alt={`${video.uploader.firstName} ${video.uploader.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-muted-foreground">
                      Uploaded by: {video.uploader.firstName} {video.uploader.lastName}
                    </span>
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
