import React from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";


const WorkspaceDetails = () => {
  const { workspaceId } = useParams();

  const { data: members, loading } = useFetch(
    `/workspace/members/${workspaceId}`,
    true
  );
  console.log("members", members);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Workspace Details</h2>
        <p className="text-muted-foreground text-sm">
          Workspace ID: {workspaceId}
        </p>
      </div>

     <div>
  <h3 className="text-lg font-semibold mb-4">Members</h3>

  <div className="space-y-3">
    {(members || []).map((member) => {
      const { firstName, lastName, email, imageUrl } = member.user;

      return (
        <Card key={member.id}>
          <CardContent className="p-3 flex items-center justify-between">
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
                  <Badge variant="outline" className="capitalize">
                    {member.role}
                  </Badge>
                  <Badge
                    variant={member.status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
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
</div>


      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Videos</h3>
          <Button>Upload Video</Button>
        </div>
        {/* Video list would go here */}
        <p className="text-sm text-muted-foreground">No videos yet.</p>
      </div>
    </div>
  );
};

export default WorkspaceDetails;
