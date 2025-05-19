import axios from "axios";
import React from "react";

const App = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const fileChangeHandler = async (file: File) => {
    console.log("file", file);
    // setSelectedFile(file)
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/get-presigned-url`,
      {
        fileName: file.name,
        fileType: file.type,
      }
    );
    console.log("response", response);

    const { url } = response.data;

    const uploadResponse = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progress) => {
        console.log("progress", progress);
      },
    });

    console.log("uploadResponse", uploadResponse);
  };
  return (
    <div className="flex flex-col items-center mt-3 h-screen">
      <h1 className="text-3xl font-bold">
        Welcome to the YouTube Video Uploader
      </h1>

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
      </div>
    </div>
  );
};

export default App;
