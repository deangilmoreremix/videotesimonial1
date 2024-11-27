"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { elevenLabsClient } from "@/lib/elevenlabs/api-client";
import { VoicePreview } from "./voice-preview";
import { 
  Mic, 
  Upload, 
  Play, 
  Pause, 
  X, 
  Waveform,
  Settings,
  Info
} from "lucide-react";

export function VoiceCloneInterface() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [generatedVoiceId, setGeneratedVoiceId] = useState<string>();
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 25,
    maxSize: 15 * 1024 * 1024, // 15MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast({
          title: "Invalid files",
          description: "Please ensure files are audio and under 15MB each.",
          variant: "destructive",
        });
        return;
      }
      setFiles(prev => [...prev, ...acceptedFiles]);
    },
  });

  const handleSubmit = async () => {
    if (!name || files.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a name and upload at least one audio sample.",
        variant: "destructive",
      });
      return;
    }

    if (files.length < 3) {
      toast({
        title: "Not enough samples",
        description: "Please upload at least 3 audio samples for better results.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress while processing
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 95));
      }, 1000);

      const result = await elevenLabsClient.cloneVoice(name, files, description);
      clearInterval(interval);
      setProgress(100);
      setGeneratedVoiceId(result.voice_id);

      toast({
        title: "Voice cloned successfully",
        description: "Your custom voice is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Error cloning voice",
        description: "Failed to create custom voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayback = (file: File) => {
    if (playingFile === file.name) {
      setPlayingFile(null);
    } else {
      setPlayingFile(file.name);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Voice Cloning</h2>
        <p className="text-muted-foreground">
          Create a custom voice by providing audio samples
        </p>
      </div>

      <Tabs defaultValue="samples" className="space-y-6">
        <TabsList>
          <TabsTrigger value="samples">Voice Samples</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedVoiceId}>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="samples">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voice-name">Voice Name</Label>
                <Input
                  id="voice-name"
                  placeholder="Enter a name for your custom voice"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-description">Description (Optional)</Label>
                <Input
                  id="voice-description"
                  placeholder="Describe your custom voice"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Voice Samples</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <Mic className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive
                      ? "Drop the audio files here"
                      : "Drag and drop audio files here, or click to select"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3, WAV, or M4A files, max 15MB each
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {files.length} file(s) selected
                  </p>
                  <div className="grid gap-2">
                    {files.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between bg-muted p-2 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePlayback(file)}
                          >
                            {playingFile === file.name ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="text-sm truncate max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Creating your custom voice... {progress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isProcessing || files.length === 0}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Create Voice"}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Waveform className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <h3 className="font-medium">Recording Requirements</h3>
                  <p className="text-sm text-muted-foreground">
                    For best results, provide clear audio samples with:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>High-quality microphone</li>
                    <li>Minimal background noise</li>
                    <li>Natural speaking pace</li>
                    <li>Varied emotional expressions</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Info className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <h3 className="font-medium">Sample Guidelines</h3>
                  <p className="text-sm text-muted-foreground">
                    Recommended sample characteristics:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>3-10 samples</li>
                    <li>30 seconds to 2 minutes each</li>
                    <li>Different speaking styles</li>
                    <li>Various emotional tones</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          {generatedVoiceId && (
            <Card className="p-6">
              <VoicePreview
                voiceId={generatedVoiceId}
                sampleText="This is a preview of your custom voice. How does it sound?"
              />
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}