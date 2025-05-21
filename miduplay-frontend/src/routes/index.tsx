import App from "@/App";
import SpacesPage from "@/app/workspace/page";
import YoutubeSpace from "@/app/platforms/youtube/page";
import UploadVideo from "@/app/upload/page";
import React from "react";
import { Route, Routes } from "react-router";
import WorkspaceDetails from "@/app/workspace/workspace-details/page";

const RootRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/upload" element={<UploadVideo />} />
      <Route path="/workspace">
        <Route index element={<SpacesPage />} />
        <Route path="/workspace/youtube" element={<YoutubeSpace /> } />
        <Route path="/workspace/:workspaceId" element={<WorkspaceDetails />} />
      </Route>
    </Routes>
  );
};

export default RootRouter;
