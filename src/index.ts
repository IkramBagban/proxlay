import dotenv from "dotenv";
import express from "express";
import { google } from "googleapis";
import path from "path";
import fs from "fs";
dotenv.config();
const app = express();

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
};

const oauth2Client = getOAuthClient();

const scopes = ["https://www.googleapis.com/auth/youtube.upload"];

app.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req: any, res: any) => {
  const code = req.query.code;
  console.log("code", code);
  if (!code) {
    return res.status(400).send("Authorization code not found.");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens", tokens);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! You can now upload videos.");
  } catch (error) {
    console.error("Error retrieving access token", error);
    res.status(500).send("Authentication failed.");
  }
});

app.post("/upload", async (req: any, res: any) => {
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  const { title, description, tags, categoryId, privacyStatus } = req.body;

  const filePath = path.join(__dirname, "test-video.mkv");
  try {
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
        },
        status: {
          privacyStatus
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });
    console.log("Upload response:", response.data);
    res.send("Video uploaded successfully! 🎥");
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).send("Failed to upload video");
  }
});


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
