import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  UserPlus,
  Mail,
  Crown,
  User,
  Shield,
  MoreVertical,
  Users,
  Clock,
  UserCheck,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios-client";
import { useAuth } from "@clerk/clerk-react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import InviteMemberDialog from "@/components/workspace/invite-member-dialog";
import { useMember } from "@/hooks/tanstack/useMembers";
import { useWorkspace } from "@/hooks/tanstack/useWorkspace";

const WorkspaceMembers = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");

  // const { data: members = [], loading: membersLoading } = useFetch(
  //   `/workspace/members/${workspaceId}`,
  //   true
  // );

  const { queryWorkspaceMembers } = useMember({
    workspaceId: workspaceId || "",
  });

  const { handleJoinRequest } = useWorkspace({
    workspaceId: workspaceId || "",
  });
  const {data: members = [], isLoading: membersLoading} = queryWorkspaceMembers;
  console.log("queryWorkspaceMembers", queryWorkspaceMembers);
  console.log("queryWorkspaceMembers2", members);

  useEffect(() => {
    if (!workspaceId) {
      navigate("/workspace");
      console.error("Workspace ID is required");
    }
  }, [workspaceId, navigate]);

  if (!workspaceId) {
    console.error("Workspace ID is required");
    return <p className="text-red-500">Workspace ID is required</p>;
  }

  // Filter members based on status
  const activeMembers =
    members?.filter((member) => member.status?.toLowerCase() === "active") ||
    [];
  const invitedMembers =
    members?.filter((member) => member.status?.toLowerCase() === "invited") ||
    [];
  const pendingMembers =
    members?.filter((member) => member.status?.toLowerCase() === "pending") ||
    [];

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case "members":
        return activeMembers;
      case "invites":
        return invitedMembers;
      case "requests":
        return pendingMembers;
      default:
        return [];
    }
  };

  // Filter by search term
  const filteredData = getCurrentTabData().filter((member) => {
    const fullName =
      `${member.user?.firstName} ${member.user?.lastName}`.toLowerCase();
    const email = member.user?.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "owner":
        return Crown;
      case "admin":
        return Shield;
      default:
        return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "owner":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "invited":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleJoinWorkspaceRequest = async (
    action: "ACCEPT" | "REJECT",
    membershipId: string
  ) => {
    console.log(`Request to ${action} join workspace`);
    const confirmMessage = `Are you sure you want to ${action.toLowerCase()} this join request?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    try {
      const response = await handleJoinRequest.mutateAsync({
        action,
        membershipId,
        workspaceId
      });
      console.log("Join request handled successfully:", response);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.error("Error handling join request:", error.response.data);
        toast.error(
          error.response.data?.error || "Failed to handle join request"
        );
        console.error("Error joining workspace:", error);
      }
    }
  };
  const tabs = [
    {
      id: "members",
      label: "Members",
      count: activeMembers.length,
      icon: Users,
      color: "text-green-600",
    },
    {
      id: "invites",
      label: "Invites",
      count: invitedMembers.length,
      icon: Mail,
      color: "text-blue-600",
    },
    {
      id: "requests",
      label: "Requests",
      count: pendingMembers.length,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const renderMemberRow = (member, index) => {
    const { firstName, lastName, email, imageUrl } = member.user || {};
    const RoleIcon = getRoleIcon(member.role);

    return (
      <tr
        key={member.id || index}
        className="hover:bg-gray-50 transition-colors"
      >
        {/* Avatar & Name */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-1 ring-gray-100">
                <img
                  src={
                    imageUrl ||
                    `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
                  }
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                  member.status === "active"
                    ? "bg-green-500"
                    : member.status === "invited"
                    ? "bg-blue-500"
                    : member.status === "pending"
                    ? "bg-orange-500"
                    : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {firstName} {lastName}
              </div>
              <div className="text-sm text-gray-500">{email}</div>
            </div>
          </div>
        </td>

        {/* Role */}
        <td className="px-6 py-4">
          <Badge
            variant="outline"
            className={`capitalize font-medium ${getRoleColor(member.role)}`}
          >
            <RoleIcon className="h-3 w-3 mr-1" />
            {member.role}
          </Badge>
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <Badge
            variant="outline"
            className={`capitalize font-medium ${getStatusColor(
              member.status
            )}`}
          >
            {member.status}
          </Badge>
        </td>

        {/* Joined Date */}
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(member.createdAt || Date.now()).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {activeTab === "members" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-blue-50"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </>
            )}
            {activeTab === "invites" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-green-50 hover:border-green-200 text-green-700"
                >
                  Resend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-red-50 hover:border-red-200 text-red-700"
                >
                  Cancel
                </Button>
              </>
            )}
            {activeTab === "requests" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-green-50 hover:border-green-200 text-green-700"
                  onClick={() =>
                    handleJoinWorkspaceRequest("ACCEPT", member.id)
                  }
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-red-50 hover:border-red-200 text-red-700"
                  onClick={() =>
                    handleJoinWorkspaceRequest("REJECT", member.id)
                  }
                >
                  Decline
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage workspace members and their permissions
          </p>
        </div>
        <InviteMemberDialog workspaceId={workspaceId} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Card key={tab.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center`}
                  >
                    <Icon className={`h-6 w-6 ${tab.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tab.count}</p>
                    <p className="text-sm text-muted-foreground">{tab.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs and Content */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <Badge variant="secondary" className="ml-1">
                      {tab.count}
                    </Badge>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Table Content */}
          {membersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading members...</p>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {searchTerm ? "No results found" : `No ${activeTab} found`}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : `This workspace doesn't have any ${activeTab} yet.`}
                  </p>
                </div>
                {!searchTerm && activeTab === "members" && (
                  <Button className="mt-4">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite First Member
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === "members"
                        ? "Joined"
                        : activeTab === "invites"
                        ? "Invited"
                        : "Requested"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map(renderMemberRow)}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceMembers;
