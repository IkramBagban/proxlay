import App from "@/App";
import SpacesPage from "@/app/workspace/page";
import YoutubeSpace from "@/app/platforms/youtube/page";
import UploadVideo from "@/app/upload/page";
import React from "react";
import { Route, Routes } from "react-router";

const RootRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/upload" element={<UploadVideo />} />
      <Route path="/spaces">
        <Route index element={<SpacesPage />} />
        <Route path="/spaces/youtube" element={<YoutubeSpace /> } />
      </Route>
    </Routes>
  );
};

export default RootRouter;
