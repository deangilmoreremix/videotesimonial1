"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import {
  Wand2,
  Sliders,
  Languages,
  Mic,
  Video,
  Download,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { VoiceSelector } from "./voice-selector";
import { VoiceSettings } from "./voice-settings";
import { VideoSettings } from "./video-settings";

interface TestimonialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  testimonialText: string;
}

export function TestimonialDialog({
  isOpen,
  onClose,
  imageUrl,
  testimonialText,
}: TestimonialDialogProps) {
  const [activeTab, setActiveTab] = useState("voice");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Add generation logic here
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Talking Head Testimonial</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="col-span-1 space-y-4">
            <Card className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Testimonial"
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Testimonial Text</Label>
              <p className="text-sm text-muted-foreground">{testimonialText}</p>
            </div>
          </div>

          {/* Settings Section */}
          <div className="col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="voice">Voice</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="space-y-4">
                <VoiceSelector
                  value={selectedVoice}
                  onChange={setSelectedVoice}
                />
                <VoiceSettings
                  onChange={(settings) => console.log(settings)}
                />
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <VideoSettings
                  settings={{
                    enhancer: true,
                    expressionScale: 1,
                    poseStyle: 0,
                  }}
                  onSettingsComplete={(settings) => console.log(settings)}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      <Label>Language Detection</Label>
                    </div>
                    <Switch />
                  </Card>

                  <Card className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4" />
                      <Label>Auto Enhancement</Label>
                    </div>
                    <Switch />
                  </Card>

                  <Card className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      <Label>Background Removal</Label>
                    </div>
                    <Switch />
                  </Card>

                  <Card className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <Label>Motion Smoothing</Label>
                    </div>
                    <Slider
                      defaultValue={[0.5]}
                      max={1}
                      step={0.1}
                      className="mt-2"
                    />
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}</boltArtifact>

Now, let's update the TestimonialProcessor component to use this dialog:

<boltArtifact id="update-testimonial-processor" title="Update TestimonialProcessor to use Dialog">
<boltAction type="file" filePath="components/testimonial-processor.tsx">"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { extractTextFromImage } from '@/lib/text-extraction';
import { TestimonialDialog } from './testimonial-dialog';
import { 
  Loader2, 
  Upload,
} from 'lucide-react';

interface TestimonialData {
  imageUrl: string;
  text: string;
  author: string;
  title: string;
}

export function TestimonialProcessor() {
  const [testimonialData, setTestimonialData] = useState<TestimonialData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const processTestimonial = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    
    try {
      setIsProcessing(true);
      // Extract text from the testimonial image
      const extractedText = await extractTextFromImage(imageUrl);
      
      // Basic text processing to separate testimonial, author, and title
      const lines = extractedText.split('\n').filter(line => line.trim());
      const testimonialText = lines[0]; // First paragraph is usually the testimonial
      const author = lines[lines.length - 2] || ''; // Second to last line is usually the author
      const title = lines[lines.length - 1] || ''; // Last line is usually the title

      setTestimonialData({
        imageUrl,
        text: testimonialText,
        author,
        title
      });

      // Show the dialog after processing
      setShowDialog(true);

      toast({
        title: "Testimonial processed",
        description: "Text and image extracted successfully.",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to extract text from the image.",
        variant: "destructive",
      });
      console.error('Error processing testimonial:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processTestimonial(file);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Process Testimonial Image</h2>
            <p className="text-sm text-muted-foreground">
              Upload your testimonial image to extract the portrait and text.
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => document.getElementById('testimonial-upload')?.click()}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Testimonial Image
                  </>
                )}
              </Button>
              <input
                id="testimonial-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </Card>

      {testimonialData && (
        <TestimonialDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          imageUrl={testimonialData.imageUrl}
          testimonialText={testimonialData.text}
        />
      )}
    </div>
  );
}