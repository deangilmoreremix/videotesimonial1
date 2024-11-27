"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";

export function VoiceCloner() {
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || files.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a name and upload audio samples.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    files.forEach(file => formData.append("files", file));

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch("/api/voice-clone", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        throw new Error("Voice cloning failed");
      }

      const data = await response.json();
      toast({
        title: "Voice cloned successfully",
        description: "Your custom voice is ready to use.",
      });

      // Reset form
      setName("");
      setFiles([]);
      setProgress(0);
    } catch (error) {
      toast({
        title: "Error cloning voice",
        description: "Failed to create custom voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="voice-name">Voice Name</Label>
        <Input
          id="voice-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for your custom voice"
        />
      </div>

      <div className="space-y-2">
        <Label>Voice Samples</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("voice-samples")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Samples
          </Button>
          <input
            id="voice-samples"
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {files.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {files.length} file(s) selected
          </p>
        )}
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Creating your custom voice... {progress}%
          </p>
        </div>
      )}

      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Voice...
          </>
        ) : (
          "Create Custom Voice"
        )}
      </Button>
    </form>
  );
}