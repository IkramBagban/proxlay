import dotenv from "dotenv";
import express from "express";
import { google } from "googleapis";
import path from "path";
import fs from "fs";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import workspaceRoutes from "./routes/v1/workspace.route";
import { prismaClient } from "./lib/db";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});
const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
};

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
// const oauth2Client = getOAuthClient();

const scopes = ["https://www.googleapis.com/auth/youtube.upload"];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/workspace", requireAuth(), workspaceRoutes);

app.post("/get-presigned-url", requireAuth(), async (req: any, res) => {
  console.log("req.body", req.body);

  const { fileName, fileType, workspaceId } = req.body;

  const bucketName = process.env.AWS_BUCKET_NAME!;
  const filePath = `${workspaceId}/youtube/${fileName}`;
  // const filePath = `${fileName}`;
  const params = {
    Bucket: bucketName,
    Key: filePath,
    ContentType: fileType,
  };

    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  res.status(200).json({ url, filePath });
});

const getPresignedUrl = async (params: any) => {  
 const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
};

app.post("/api/v1/youtube/upload-video", requireAuth(), async (req: any, res: any) => {
  const { fileName, fileType, workspaceId, title, description, tags, categoryId, privacyStatus } = req.body;
  const bucketName = process.env.AWS_BUCKET_NAME!;
  const filePath = `${workspaceId}/youtube/${fileName}`;
  const params = {
    Bucket: bucketName,
    Key: filePath,
    ContentType: fileType,
  };
  const presignedUrl = await getPresignedUrl(params);
  const { userId } = getAuth(req);

  const payload = {
    fileName: fileName,
      key: filePath,
      title: title,
      description: description,
      tags: tags,
      categoryId: categoryId,
      privacyStatus: privacyStatus || "private",
      workspaceId: workspaceId,
      uploaderId: userId!
  }

  console.log("payload", payload);

  const metaData = await prismaClient.videoMetaData.create({
    data: {
      fileName: fileName,
      key: filePath,
      title: title,
      description: description,
      tags: tags,
      categoryId: categoryId,
      privacyStatus: privacyStatus || "private",
      workspaceId: workspaceId,
      uploaderId: userId!
    },

    })
    

    res.status(200).json({ url: presignedUrl, key: filePath, metaData });
  });

app.get("/api/v1/youtube/videos/:workspaceId", requireAuth(), async (req: any, res: any) => {
  const { workspaceId } = req.params;
  const videos = await prismaClient.videoMetaData.findMany({
    where: {
      workspaceId: workspaceId,
    },
  });

  if (!videos) {
    return res.status(404).json({ message: "No videos found" });
  }
  
  const uploaderIds = videos.map((video) => video.uploaderId);
  const uploaders = await clerkClient.users.getUserList({
    userId: uploaderIds,
  });
  console.log("uploaders", uploaders);
 const userMap = new Map(
      // @ts-ignore
      (uploaders?.data || [])?.map((user) => [
        user.id,
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailAddresses?.[0]?.emailAddress,
          imageUrl: user.imageUrl,
        },
      ])
    );

    const enrichedVideos = videos.map((video) => ({
      ...video,
      uploader: userMap.get(video.uploaderId),
    }));
  console.log("enrichedVideos", enrichedVideos);
  console.log("videos", videos);
  res.status(200).json(enrichedVideos);
});

app.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({ user: 123 }),
  });
  res.status(200).json({ redirect: authUrl });
  // res.redirect(authUrl);
});

app.get("/oauth2callback", async (req: any, res: any) => {
  console.log("req", req.query);
  const code = req.query.code;
  console.log("code", code);
  if (!code) {
    return res.status(400).send("Authorization code not found.");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    // console.log("Tokens", tokens);
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
          privacyStatus,
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });
    // console.log("Upload response:", response.data);
    res.send("Video uploaded successfully! 🎥");
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).send("Failed to upload video");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
