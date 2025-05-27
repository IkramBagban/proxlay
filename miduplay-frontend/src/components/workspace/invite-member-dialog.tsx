import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search } from "lucide-react";
import axiosClient from "@/lib/axios-client";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useWorkspace } from "@/hooks/tanstack/useWorkspace";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  memberStatus: "ACTIVE" | "PENDING" | "INVITED" | "NOT_MEMBER";
}

interface Props {
  workspaceId: string;
}

const InviteMemberDialog: React.FC<Props> = ({ workspaceId }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { getToken } = useAuth();

  const { inviteUserToWorkspace } = useWorkspace({ workspaceId });

  // Debounced search function
  const searchUsers = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const token = await getToken();
        const response = await axiosClient.get(
          `/workspace/${workspaceId}/members/search?q=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(response.data || []);
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          toast.error(error.response.data?.error || "Failed to search users");
        }
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [getToken, workspaceId]
  );

  useEffect(() => {
    searchUsers(searchTerm);
    return () => searchUsers.cancel();
  }, [searchTerm, searchUsers]);

  const handleInvite = async (userId: string) => {
    try {
      await inviteUserToWorkspace.mutateAsync(
        {
          workspaceId,
          userId,
        },
        {
          onSuccess: () => {
            toast.success("Invitation sent successfully===<userId>");
            setOpen(false);
            setSearchTerm("");
            setSearchResults([]);
          },
        }
      );

      // const response = await axiosClient.post(
      //   `/workspace/invite/${workspaceId}`,
      //   { userId },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // if (response.status === 200) {
      //   toast.success("Invitation sent successfully");
      //   setOpen(false);
      //   setSearchTerm("");
      //   setSearchResults([]);
      // }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data?.error || "Failed to send invitation");
      }
      console.error("Error sending invitation:", error);
    }
  };

  const getStatusInfo = (memberStatus: string) => {
    switch (memberStatus) {
      case "ACTIVE":
        return {
          message: "Member",
          className: "bg-green-100 text-green-700 border-green-200",
        };
      case "PENDING":
        return {
          message: "Pending Request",
          className: "bg-orange-100 text-orange-700 border-orange-200",
        };
      case "INVITED":
        return {
          message: "Invited",
          className: "bg-blue-100 text-blue-700 border-blue-200",
        };
      default:
        return { message: "", className: "" };
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Invite Member
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 text-sm border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md transition-all duration-200"
            />
          </div>
          <div className="max-h-72 overflow-y-auto rounded-md border border-gray-100">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            ) : searchResults.length === 0 && searchTerm ? (
              <p className="text-center text-sm text-gray-500 py-8">
                No users found for "{searchTerm}"
              </p>
            ) : (
              searchResults.map((user) => {
                const { message, className } = getStatusInfo(user.memberStatus);
                const canInvite = user.memberStatus === "NOT_MEMBER";

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.imageUrl ||
                          `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`
                        }
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {canInvite ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs font-medium cursor-pointer"
                        onClick={() => handleInvite(user.id)}
                      >
                        Invite
                      </Button>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${className}`}
                      >
                        {message}
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
