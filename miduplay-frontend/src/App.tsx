import axios from "axios";
import React from "react";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react';

const App = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const fileChangeHandler = async (file: File) => {
    console.log("file", file);
    setSelectedFile(file)
    
  };

   const { getToken } = useAuth()
  const uploadHandler = async () => {
    console.log("import.meta.env.VITE_API_URL", import.meta.env.VITE_API_URL);
    if (!selectedFile) {  
      console.error("No file selected");
      return;
    }

    const token = await getToken();
    console.log("token", token);


    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/get-presigned-url`,
      {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response", response);

    const { url, filePath } = response.data;

    const uploadResponse = await axios.put(url, selectedFile, {
      headers: {
        "Content-Type": selectedFile.type,
      },
      onUploadProgress: (progress) => {
        console.log("progress", progress);
      },
    });

    console.log("uploadResponse", uploadResponse);
    if (uploadResponse.status === 200) {
      console.log("File uploaded successfully");
    } else {
      console.error("File upload failed");
    }
  };
  return (
    <div className="flex flex-col items-center mt-3 h-screen">
         <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>

      <div className="flex flex-col items-center mt-5">
        <h2 className="text-2xl font-semibold">Upload video</h2>
        <input
          type="file"
          value=""
          className="mt-2 p-2 border-t-3"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              fileChangeHandler(file);
            }
          }}
        />
        <button onClick={uploadHandler}>Upload</button>
      </div>
    </div>
  );
};

export default App;
