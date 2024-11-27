"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { enhanceTestimonialContent, analyzeSentiment } from "@/lib/ai/content-enhancement";
import { enhancePortrait, removeBackground } from "@/lib/ai/image-enhancement";
import { Wand2, Image, Type, Mic, Loader2 } from "lucide-react";
import { VoiceSelector } from "./voice-selector";
import { VoiceSettings } from "./voice-settings";

interface EnhancedTestimonialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  testimonialText: string;
  onComplete: (enhancedData: {
    imageUrl: string;
    text: string;
    voiceId?: string;
    voiceSettings?: any;
  }) => void;
}

export function EnhancedTestimonialDialog({
  isOpen,
  onClose,
  imageUrl,
  testimonialText,
  onComplete,
}: EnhancedTestimonialDialogProps) {
  const [activeTab, setActiveTab] = useState("image");
  const [enhancedImage, setEnhancedImage] = useState(imageUrl);
  const [enhancedText, setEnhancedText] = useState(testimonialText);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voiceSettings, setVoiceSettings] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleImageEnhancement = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Enhance portrait
      setProgress(30);
      const enhancedPortrait = await enhancePortrait(imageUrl);
      
      // Remove background
      setProgress(60);
      const processedImage = await removeBackground(enhancedPortrait);
      
      setEnhancedImage(processedImage);
      setProgress(100);
      
      toast({
        title: "Image enhanced",
        description: "Portrait has been optimized and background removed.",
      });
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
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Enhance content
      setProgress(40);
      const enhanced = await enhanceTestimonialContent(testimonialText);
      
      // Analyze sentiment
      setProgress(70);
      const sentiment = await analyzeSentiment(enhanced);
      
      setEnhancedText(enhanced);
      setProgress(100);
      
      toast({
        title: "Content enhanced",
        description: `Testimonial enhanced with sentiment score: ${(sentiment * 100).toFixed(0)}%`,
      });
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
    onComplete({
      imageUrl: enhancedImage,
      text: enhancedText,
      voiceId: selectedVoice,
      voiceSettings,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Enhance Testimonial</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
              <img
                src={enhancedImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>

            <Button
              onClick={handleImageEnhancement}
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
                  Enhance Portrait
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Enhancing image... {progress}%
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              <textarea
                value={enhancedText}
                onChange={(e) => setEnhancedText(e.target.value)}
                className="w-full h-40 p-4 rounded-lg border resize-none"
                placeholder="Enhanced testimonial text will appear here..."
              />

              <Button
                onClick={handleContentEnhancement}
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
                    <Type className="mr-2 h-4 w-4" />
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
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}