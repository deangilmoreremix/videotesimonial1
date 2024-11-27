import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Mic, Settings } from "lucide-react";

export default function Create() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Video Testimonial</h1>
        <p className="text-muted-foreground">
          Follow the steps below to create your AI-powered video testimonial
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">1. Upload Image</TabsTrigger>
          <TabsTrigger value="voice">2. Configure Voice</TabsTrigger>
          <TabsTrigger value="generate">3. Generate Video</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Upload Portrait Image</h2>
              <p className="text-muted-foreground mb-4">
                Upload a clear portrait photo of your testimonial subject
              </p>
              <Button>Choose Image</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card className="p-6">
            <div className="text-center">
              <Mic className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Voice Configuration</h2>
              <p className="text-muted-foreground mb-4">
                Select or clone a voice for your video testimonial
              </p>
              <Button>Configure Voice</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card className="p-6">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Generate Video</h2>
              <p className="text-muted-foreground mb-4">
                Review settings and generate your video
              </p>
              <Button>Generate Video</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}