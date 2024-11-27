"use server";

import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => {
      return { };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  audioUploader: f({ audio: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => {
      return { };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;