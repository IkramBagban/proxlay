import axios from "axios";
import React from "react";
import { useAuth } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { uploadVideoSchema } from "@shared/schemas/youtube.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagsInput from "@/components/tags-input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router";
import axiosClient from "@/lib/axios-client";

const YoutubeVideoUpload = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const form = useForm<z.infer<typeof uploadVideoSchema>>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      privacyStatus: "private",
      categoryId: "",
    },
  });
  const { getToken } = useAuth();
  const { workspaceId } = useParams();

  const fileChangeHandler = async (file: File) => {
    console.log("file", file);
    setSelectedFile(file);
  };

  const onSubmit = async (data: z.infer<typeof uploadVideoSchema>) => {
    console.log("form values", data);

    const { title, description, tags, privacyStatus, categoryId } = data;

    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const uploadData = {
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      workspaceId,
      title,
      description,
      tags,
      categoryId,
      privacyStatus,
    };

    const token = await getToken();
    const response = await axiosClient.post("/youtube/upload-video", uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response", response);
    if (response.status === 200) {
      const { url } = response.data;
      const uploadResponse = await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
        onUploadProgress: (progress) => {
          console.log("progress", progress);
        },
      });
      console.log("File uploaded successfully", uploadResponse);
    } else {
      console.error("File upload failed");
    }
  };
  return (
    <div className="flex flex-col items-center mt-3 h-screen">
      <div className="flex flex-col  mt-5">
        <h2 className="text-2xl font-semibold">Upload video</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Video Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Video Description" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privacyStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Film and Animation</SelectItem>
                        <SelectItem value="2">Autos and Vehicles</SelectItem>
                        <SelectItem value="3">Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsInput name="tags" />
                  </FormControl>
                  <FormDescription>
                    Up to 10 tags, press Enter or click Add
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex ">
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
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default YoutubeVideoUpload;
