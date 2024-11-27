"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { Mic, Upload, Loader2, Play, Pause, X } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    files.forEach(file => formData.append("files", file));

    try {
      // Simulate progress while processing
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 95));
      }, 1000);

      const response = await fetch("/api/voice-clone", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Failed to clone voice");
      }

      const data = await response.json();
      onVoiceCreated(data.voice_id);

      toast({
        title: "Voice cloned successfully",
        description: "Your custom voice is ready to use.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error cloning voice",
        description: "Failed to create custom voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Clone Voice</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Voice
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}