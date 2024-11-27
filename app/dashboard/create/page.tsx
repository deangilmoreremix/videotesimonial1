"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadImage } from "@/components/upload-image";
import { TestimonialForm } from "@/components/testimonial-form";
import { VideoPreview } from "@/components/video-preview";
import { FaceDetectionPreview } from "@/components/face-detection-preview";

export default function CreatePage() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [testimonialText, setTestimonialText] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Video Testimonial</h1>
      
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">1. Upload Image</TabsTrigger>
          <TabsTrigger value="testimonial" disabled={!imageUrl}>2. Add Testimonial</TabsTrigger>
          <TabsTrigger value="preview" disabled={!testimonialText}>3. Preview & Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Portrait Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadImage onUploadComplete={handleUploadComplete} />
              {imageUrl && <FaceDetectionPreview imageUrl={imageUrl} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonial">
          <Card>
            <CardHeader>
              <CardTitle>Write Testimonial</CardTitle>
            </CardHeader>
            <CardContent>
              <TestimonialForm 
                onSubmit={(text) => setTestimonialText(text)}
                imageUrl={imageUrl!}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview & Generate Video</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPreview 
                imageUrl={imageUrl!}
                testimonialText={testimonialText!}
                isGenerating={isGenerating}
                onGenerate={() => setIsGenerating(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}