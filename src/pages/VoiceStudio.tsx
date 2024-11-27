import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Wand2, Settings } from "lucide-react";

export default function VoiceStudio() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Voice Studio</h1>
        <p className="text-muted-foreground">
          Create and manage custom voices for your video testimonials
        </p>
      </div>

      <Tabs defaultValue="voices" className="space-y-8">
        <TabsList>
          <TabsTrigger value="voices">Voice Library</TabsTrigger>
          <TabsTrigger value="clone">Voice Cloning</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="voices">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <Mic className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Professional Male</h3>
              <p className="text-muted-foreground mb-4">
                Clear and authoritative voice for corporate videos
              </p>
              <Button variant="outline" className="w-full">Preview</Button>
            </Card>
            {/* Add more voice cards */}
          </div>
        </TabsContent>

        <TabsContent value="clone">
          <Card className="p-6">
            <div className="text-center">
              <Wand2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Clone New Voice</h2>
              <p className="text-muted-foreground mb-4">
                Create a custom voice from audio samples
              </p>
              <Button>Start Cloning</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Voice Enhancement</h3>
                  <p className="text-muted-foreground">
                    Automatically enhance voice quality
                  </p>
                </div>
                <Settings className="h-6 w-6 text-primary" />
              </div>
              {/* Add more settings */}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}