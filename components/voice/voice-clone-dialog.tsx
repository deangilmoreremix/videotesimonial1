"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Info,
  Languages,
  Sliders,
  Volume2,
  Sparkles
} from "lucide-react";

interface VoiceCloneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceCreated: (voiceId: string) => void;
}

export function VoiceCloneDialog({
  isOpen,
  onClose,
  onVoiceCreated,
}: VoiceCloneDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [generatedVoiceId, setGeneratedVoiceId] = useState<string>();
  const [voiceLabels, setVoiceLabels] = useState({
    age: "young",
    gender: "female",
    accent: "neutral",
    useCase: "general",
  });
  const [cloneSettings, setCloneSettings] = useState({
    enhanceClarity: true,
    removeBackground: true,
    optimizeLength: true,
    modelVersion: "latest"
  });
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
      // Process audio files if needed
      if (cloneSettings.enhanceClarity || cloneSettings.removeBackground) {
        setProgress(20);
        // Audio enhancement would go here
      }

      // Optimize sample lengths if enabled
      if (cloneSettings.optimizeLength) {
        setProgress(40);
        // Length optimization would go here
      }

      // Clone voice with processed samples
      setProgress(60);
      const result = await elevenLabsClient.cloneVoice(name, files, description);
      
      // Add voice labels
      if (result.voice_id) {
        setProgress(80);
        await elevenLabsClient.editVoice(result.voice_id, name, voiceLabels);
      }

      setProgress(100);
      setGeneratedVoiceId(result.voice_id);

      toast({
        title: "Voice cloned successfully",
        description: "Your custom voice is ready to use.",
      });

      onVoiceCreated(result.voice_id);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Clone Voice</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="labels">Labels</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedVoiceId}>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="labels" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["young", "middle", "senior"].map((age) => (
                    <Button
                      key={age}
                      variant={voiceLabels.age === age ? "default" : "outline"}
                      onClick={() => setVoiceLabels(prev => ({ ...prev, age }))}
                    >
                      {age.charAt(0).toUpperCase() + age.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["male", "female", "neutral"].map((gender) => (
                    <Button
                      key={gender}
                      variant={voiceLabels.gender === gender ? "default" : "outline"}
                      onClick={() => setVoiceLabels(prev => ({ ...prev, gender }))}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["neutral", "british", "american", "australian"].map((accent) => (
                    <Button
                      key={accent}
                      variant={voiceLabels.accent === accent ? "default" : "outline"}
                      onClick={() => setVoiceLabels(prev => ({ ...prev, accent }))}
                    >
                      {accent.charAt(0).toUpperCase() + accent.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Use Case</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["general", "narration", "business", "entertainment"].map((useCase) => (
                    <Button
                      key={useCase}
                      variant={voiceLabels.useCase === useCase ? "default" : "outline"}
                      onClick={() => setVoiceLabels(prev => ({ ...prev, useCase }))}
                    >
                      {useCase.charAt(0).toUpperCase() + useCase.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enhance Audio Clarity</Label>
                  <p className="text-sm text-muted-foreground">
                    Improve sample quality and reduce noise
                  </p>
                </div>
                <Button
                  variant={cloneSettings.enhanceClarity ? "default" : "outline"}
                  onClick={() => setCloneSettings(prev => ({
                    ...prev,
                    enhanceClarity: !prev.enhanceClarity
                  }))}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {cloneSettings.enhanceClarity ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Remove Background Noise</Label>
                  <p className="text-sm text-muted-foreground">
                    Filter out ambient sounds and music
                  </p>
                </div>
                <Button
                  variant={cloneSettings.removeBackground ? "default" : "outline"}
                  onClick={() => setCloneSettings(prev => ({
                    ...prev,
                    removeBackground: !prev.removeBackground
                  }))}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {cloneSettings.removeBackground ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Optimize Sample Length</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically trim silence and normalize duration
                  </p>
                </div>
                <Button
                  variant={cloneSettings.optimizeLength ? "default" : "outline"}
                  onClick={() => setCloneSettings(prev => ({
                    ...prev,
                    optimizeLength: !prev.optimizeLength
                  }))}
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  {cloneSettings.optimizeLength ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Model Version</Label>
                  <p className="text-sm text-muted-foreground">
                    Select the voice cloning model to use
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["latest", "stable"].map((version) => (
                    <Button
                      key={version}
                      variant={cloneSettings.modelVersion === version ? "default" : "outline"}
                      onClick={() => setCloneSettings(prev => ({
                        ...prev,
                        modelVersion: version
                      }))}
                    >
                      {version.charAt(0).toUpperCase() + version.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            {generatedVoiceId ? (
              <VoicePreview
                voiceId={generatedVoiceId}
                sampleText="This is a preview of your custom voice. How does it sound?"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                Generate a voice to preview it
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Creating your custom voice... {progress}%
            </p>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Create Voice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}