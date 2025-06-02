// routes/index.tsx
import App from "@/App";
import SpacesPage from "@/app/workspace/page";
import { Route, Routes } from "react-router";
// import WorkspaceLayout from "@/components/workspace/workspace-layout";
// import WorkspaceDashboard from "@/app/workspace/workspace-details/dashboard";
import WorkspaceDashboard from "@/app/workspace/workspace-details/dashboard";
// import WorkspaceMembers from "@/app/workspace/workspace-details/";
import WorkspaceVideos from "@/app/workspace/workspace-details/videos";
// import WorkspacePlatforms from "@/app/workspace/workspace-details/platforms";
import YoutubeVideoUpload from "@/app/platforms/youtube/upload-video/page";
import WorkspaceLayout from "@/app/workspace/workspace-layout";
import WorkspaceMembers from "@/app/Members/page";
import ProtectedRoute from "./protected-route";

const RootRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/workspace" element={<SpacesPage />} />
      </Route>


      <Route element={<ProtectedRoute redirectIfNotPartOfWorkspace={true} />}>
        <Route path="/workspace/:workspaceId" element={<WorkspaceLayout />}>
          <Route index element={<WorkspaceDashboard />} />
          <Route path="members" element={<WorkspaceMembers />} />
          <Route path="videos" element={<WorkspaceVideos />} />
          {/* <Route path="platforms" element={<WorkspacePlatforms />} /> */}
          <Route path="youtube/upload" element={<YoutubeVideoUpload />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RootRouter;