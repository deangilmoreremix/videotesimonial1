"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageSelector } from './language-selector';
import { VoicePreview } from './voice-preview';
import { SUPPORTED_LANGUAGES } from '@/lib/elevenlabs/constants';
import { Globe, MessageSquare, Settings } from 'lucide-react';

export function MultilingualInterface() {
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0].id);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    setIsTranslating(true);
    // Translation logic would go here
    setIsTranslating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Multilingual Support</h2>
        <p className="text-muted-foreground">
          Generate speech in multiple languages
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <LanguageSelector
                value={selectedLanguage}
                onChange={setSelectedLanguage}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Original Text</label>
              <textarea
                className="w-full h-32 p-3 rounded-md border resize-none"
                placeholder="Enter text to translate..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Translated Text</label>
              <textarea
                value={translatedText}
                readOnly
                className="w-full h-32 p-3 rounded-md border bg-muted resize-none"
                placeholder="Translation will appear here..."
              />
            </div>
          </div>

          <Button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="w-full"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Translate and Generate Speech
          </Button>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Voice Preview</h3>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <VoicePreview
              voiceId="demo"
              sampleText={translatedText || "Preview will appear here after translation."}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}