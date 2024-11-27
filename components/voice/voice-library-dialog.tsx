"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Loader2 } from "lucide-react";
import { useVoices } from "@/lib/elevenlabs/hooks";
import { VoicePreview } from "./voice-preview";
import { VoiceCloneDialog } from "./voice-clone-dialog";
import { VOICE_CATEGORIES } from "@/lib/elevenlabs/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VoiceLibraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceLibraryDialog({ isOpen, onClose }: VoiceLibraryDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const { voices, isLoading, error } = useVoices();
  const { toast } = useToast();

  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || voice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVoiceCreated = async (voiceId: string) => {
    setShowCloneDialog(false);
    toast({
      title: "Voice cloned successfully",
      description: "Your new voice has been added to the library.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Voice Library</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search voices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={() => setShowCloneDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Clone Voice
          </Button>
        </div>

        <Tabs defaultValue="all" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {VOICE_CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredVoices.map((voice) => (
                  <Card key={voice.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{voice.name}</h3>
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                          {voice.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{voice.description}</p>
                      <VoicePreview voiceId={voice.id} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tabs>

        <VoiceCloneDialog
          isOpen={showCloneDialog}
          onClose={() => setShowCloneDialog(false)}
          onVoiceCreated={handleVoiceCreated}
        />
      </DialogContent>
    </Dialog>
  );
}