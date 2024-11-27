"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { enhanceTestimonialContent, analyzeSentiment } from "@/lib/ai/content-enhancement";
import { enhancePortrait, removeBackground } from "@/lib/ai/image-enhancement";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Upload, 
  Wand2, 
  Image as ImageIcon, 
  Type, 
  Mic, 
  Loader2,
  Settings,
  Languages,
  BarChart,
  Crop,
  Maximize2,
  MinusCircle,
  PlusCircle,
  RotateCw,
  Palette
} from "lucide-react";
import { VoiceSelector } from "./voice-selector";
import { VoiceSettings } from "./voice/voice-settings";
import { useDropzone } from "react-dropzone";

interface TestimonialUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    imageUrl: string;
    text: string;
    voiceId?: string;
    voiceSettings?: any;
  }) => void;
}

export function TestimonialUploadDialog({
  isOpen,
  onClose,
  onComplete,
}: TestimonialUploadDialogProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [imageUrl, setImageUrl] = useState<string>();
  const [testimonialText, setTestimonialText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voiceSettings, setVoiceSettings] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageSettings, setImageSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0,
    zoom: 100,
    removeBackground: true,
    enhanceFace: true,
    smartCrop: true
  });
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast({
          title: "Invalid file",
          description: "Please upload an image under 10MB in size.",
          variant: "destructive"
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        if (imageSettings.enhanceFace) {
          await handleImageEnhancement(url);
        }
      }
    }
  });

  const handleImageEnhancement = async (url: string) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Smart cropping
      if (imageSettings.smartCrop) {
        setProgress(20);
        // Smart cropping logic would go here
      }

      // Enhance portrait
      if (imageSettings.enhanceFace) {
        setProgress(50);
        const enhancedPortrait = await enhancePortrait(url);
        url = enhancedPortrait;
      }
      
      // Remove background
      if (imageSettings.removeBackground) {
        setProgress(80);
        const processedImage = await removeBackground(url);
        url = processedImage;
      }
      
      setImageUrl(url);
      setProgress(100);
      
      toast({
        title: "Image enhanced",
        description: "Portrait has been optimized according to your settings.",
      });

      setActiveTab("content");
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "Failed to enhance image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContentEnhancement = async () => {
    if (!testimonialText) {
      toast({
        title: "No content",
        description: "Please enter testimonial text first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Enhance content
      setProgress(40);
      const enhanced = await enhanceTestimonialContent(testimonialText);
      
      // Analyze sentiment
      setProgress(70);
      const sentiment = await analyzeSentiment(enhanced);
      
      setTestimonialText(enhanced);
      setProgress(100);
      
      toast({
        title: "Content enhanced",
        description: `Testimonial enhanced with sentiment score: ${(sentiment * 100).toFixed(0)}%`,
      });

      setActiveTab("voice");
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    if (!imageUrl || !testimonialText) {
      toast({
        title: "Missing information",
        description: "Please provide both image and testimonial text.",
        variant: "destructive",
      });
      return;
    }

    onComplete({
      imageUrl,
      text: testimonialText,
      voiceId: selectedVoice,
      voiceSettings,
    });
    onClose();
  };

  const updateImageSetting = (key: keyof typeof imageSettings, value: number | boolean) => {
    setImageSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Video Testimonial</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="upload">1. Upload</TabsTrigger>
            <TabsTrigger value="content" disabled={!imageUrl}>2. Content</TabsTrigger>
            <TabsTrigger value="voice" disabled={!testimonialText}>3. Voice</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the image here"
                    : "Drag and drop an image, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG or WebP (max 10MB)
                </p>
              </div>
            </div>

            {imageUrl && (
              <>
                <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    style={{
                      filter: `
                        brightness(${imageSettings.brightness}%) 
                        contrast(${imageSettings.contrast}%)
                        saturate(${imageSettings.saturation}%)
                        blur(${imageSettings.blur}px)
                      `,
                      transform: `
                        rotate(${imageSettings.rotation}deg)
                        scale(${imageSettings.zoom / 100})
                      `
                    }}
                  />
                </div>

                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Image Adjustments</h3>
                      
                      <div className="space-y-2">
                        <Label>Brightness</Label>
                        <div className="flex items-center gap-2">
                          <MinusCircle className="h-4 w-4" />
                          <Slider
                            value={[imageSettings.brightness]}
                            min={0}
                            max={200}
                            step={1}
                            onValueChange={([value]) => updateImageSetting("brightness", value)}
                          />
                          <PlusCircle className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Contrast</Label>
                        <div className="flex items-center gap-2">
                          <MinusCircle className="h-4 w-4" />
                          <Slider
                            value={[imageSettings.contrast]}
                            min={0}
                            max={200}
                            step={1}
                            onValueChange={([value]) => updateImageSetting("contrast", value)}
                          />
                          <PlusCircle className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Saturation</Label>
                        <div className="flex items-center gap-2">
                          <MinusCircle className="h-4 w-4" />
                          <Slider
                            value={[imageSettings.saturation]}
                            min={0}
                            max={200}
                            step={1}
                            onValueChange={([value]) => updateImageSetting("saturation", value)}
                          />
                          <PlusCircle className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Rotation</Label>
                        <div className="flex items-center gap-2">
                          <RotateCw className="h-4 w-4" />
                          <Slider
                            value={[imageSettings.rotation]}
                            min={0}
                            max={360}
                            step={90}
                            onValueChange={([value]) => updateImageSetting("rotation", value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Zoom</Label>
                        <div className="flex items-center gap-2">
                          <Maximize2 className="h-4 w-4" />
                          <Slider
                            value={[imageSettings.zoom]}
                            min={50}
                            max={150}
                            step={1}
                            onValueChange={([value]) => updateImageSetting("zoom", value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Enhancement Options</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Smart Crop</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically crop to focus on face
                          </p>
                        </div>
                        <Switch
                          checked={imageSettings.smartCrop}
                          onCheckedChange={(checked) => updateImageSetting("smartCrop", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Remove Background</Label>
                          <p className="text-sm text-muted-foreground">
                            Isolate the subject from background
                          </p>
                        </div>
                        <Switch
                          checked={imageSettings.removeBackground}
                          onCheckedChange={(checked) => updateImageSetting("removeBackground", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Enhance Face</Label>
                          <p className="text-sm text-muted-foreground">
                            Improve facial details and lighting
                          </p>
                        </div>
                        <Switch
                          checked={imageSettings.enhanceFace}
                          onCheckedChange={(checked) => updateImageSetting("enhanceFace", checked)}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleImageEnhancement(imageUrl)}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Apply Enhancements
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Processing image... {progress}%
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              <textarea
                value={testimonialText}
                onChange={(e) => setTestimonialText(e.target.value)}
                className="w-full h-40 p-4 rounded-lg border resize-none"
                placeholder="Enter your testimonial text here..."
              />

              <Button
                onClick={handleContentEnhancement}
                disabled={isProcessing || !testimonialText}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Enhance Content
                  </>
                )}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">
                    Enhancing content... {progress}%
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceSelector
              value={selectedVoice}
              onChange={setSelectedVoice}
            />
            
            {selectedVoice && (
              <VoiceSettings
                onChange={setVoiceSettings}
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleComplete}>
            Create Video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}