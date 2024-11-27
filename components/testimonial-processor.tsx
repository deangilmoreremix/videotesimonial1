"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { TestimonialUploadDialog } from './testimonial-upload-dialog';
import { VoiceLibraryDialog } from './voice/voice-library-dialog';
import { VoiceCloneDialog } from './voice/voice-clone-dialog';
import { VoiceDesignInterface } from './voice/voice-design-interface';
import { MultilingualInterface } from './voice/multilingual-interface';
import { AnalyticsInterface } from './voice/analytics-interface';
import { 
  Mic, 
  Upload, 
  Settings, 
  Languages, 
  Wand2,
  Copy,
  BarChart,
  Loader2
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
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showVoiceLibrary, setShowVoiceLibrary] = useState(false);
  const [showVoiceClone, setShowVoiceClone] = useState(false);
  const [showVoiceDesign, setShowVoiceDesign] = useState(false);
  const [showMultilingual, setShowMultilingual] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();

  const featureButtons = [
    {
      icon: <Mic className="w-4 h-4" />,
      label: "Voice Library",
      description: "Access 30+ professional voices",
      onClick: () => setShowVoiceLibrary(true)
    },
    {
      icon: <Copy className="w-4 h-4" />,
      label: "Voice Cloning",
      description: "Clone and customize voices",
      onClick: () => setShowVoiceClone(true)
    },
    {
      icon: <Wand2 className="w-4 h-4" />,
      label: "Voice Design",
      description: "Create custom voice styles",
      onClick: () => setShowVoiceDesign(true)
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: "Advanced Settings",
      description: "Fine-tune voice parameters",
      onClick: () => {
        toast({
          title: "Advanced Settings",
          description: "Adjust stability, clarity, and speaking rate.",
        });
      }
    },
    {
      icon: <Languages className="w-4 h-4" />,
      label: "Multilingual",
      description: "Support for 29+ languages",
      onClick: () => setShowMultilingual(true)
    },
    {
      icon: <BarChart className="w-4 h-4" />,
      label: "Analytics",
      description: "Voice performance metrics",
      onClick: () => setShowAnalytics(true)
    }
  ];

  const handleUploadComplete = (data: any) => {
    setTestimonialData(data);
    setShowUploadDialog(false);
    toast({
      title: "Upload complete",
      description: "Your testimonial has been processed successfully.",
    });
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
                onClick={() => setShowUploadDialog(true)}
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureButtons.map((button, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex flex-col h-auto p-4 gap-2 items-start"
                onClick={button.onClick}
              >
                <div className="flex items-center gap-2">
                  {button.icon}
                  <span className="font-semibold">{button.label}</span>
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  {button.description}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <TestimonialUploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onComplete={handleUploadComplete}
      />

      <VoiceLibraryDialog 
        isOpen={showVoiceLibrary}
        onClose={() => setShowVoiceLibrary(false)}
      />

      <VoiceCloneDialog
        isOpen={showVoiceClone}
        onClose={() => setShowVoiceClone(false)}
        onVoiceCreated={(voiceId) => {
          toast({
            title: "Voice Cloned",
            description: "Your custom voice has been created successfully.",
          });
          setShowVoiceClone(false);
        }}
      />

      {showVoiceDesign && (
        <Card className="p-6">
          <VoiceDesignInterface />
        </Card>
      )}

      {showMultilingual && (
        <Card className="p-6">
          <MultilingualInterface />
        </Card>
      )}

      {showAnalytics && (
        <Card className="p-6">
          <AnalyticsInterface />
        </Card>
      )}
    </div>
  );
}