"use client";

import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const languages = [
  { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { id: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { id: 'es', name: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', name: 'French', flag: '🇫🇷' },
  { id: 'de', name: 'German', flag: '🇩🇪' },
  { id: 'it', name: 'Italian', flag: '🇮🇹' },
  { id: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { id: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { id: 'pl', name: 'Polish', flag: '🇵🇱' },
  { id: 'ru', name: 'Russian', flag: '🇷🇺' },
  { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { id: 'ko', name: 'Korean', flag: '🇰🇷' },
  { id: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { id: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  onLanguageChange: (languageId: string) => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    setOpen(false);
    onLanguageChange(language.id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            <span>{selectedLanguage.flag}</span>
            <span className="ml-2">{selectedLanguage.name}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {languages.map((language) => (
              <CommandItem
                key={language.id}
                value={language.name}
                onSelect={() => handleSelect(language)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLanguage.id === language.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}