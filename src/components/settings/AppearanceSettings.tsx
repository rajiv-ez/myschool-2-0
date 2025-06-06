
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Sun, 
  Monitor,
  LayoutList,
  LayoutPanelLeft,
  Check
} from 'lucide-react';

import { usePreferencesStore } from '@/stores/usePreferencesStore';
import { useEffect } from 'react';

// Theme and layout settings interface
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  couleur: string;
  layoutType: 'tabs' | 'sidebar';
}

// Color palettes
const couleurs = [
  { id: 'purple', name: 'Violet', primaryColor: '#9b87f5', secondaryColor: '#7E69AB' },
  { id: 'blue', name: 'Bleu', primaryColor: '#0EA5E9', secondaryColor: '#0284C7' },
  { id: 'green', name: 'Vert', primaryColor: '#10B981', secondaryColor: '#059669' },
  { id: 'orange', name: 'Orange', primaryColor: '#F97316', secondaryColor: '#EA580C' },
  { id: 'red', name: 'Rouge', primaryColor: '#EF4444', secondaryColor: '#DC2626' },
  { id: 'pink', name: 'Rose', primaryColor: '#EC4899', secondaryColor: '#DB2777' },
];

// Function to convert a hexadecimal color to HSL
const hexToHSL = (hex: string): { h: number, s: number, l: number } | null => {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert hexadecimal values to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    
    h *= 60;
  }
  
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// Variable CSS for colors
const applyCouleur= (palette: string) => {
  const selectedPalette = couleurs.find(p => p.id === palette);
  
  if (!selectedPalette) return;

  document.documentElement.style.setProperty('--color-primary', selectedPalette.primaryColor);
  document.documentElement.style.setProperty('--color-primary-hover', selectedPalette.secondaryColor);
  
  // Update CSS variables for Tailwind colors
  document.documentElement.style.setProperty('--primary', selectedPalette.primaryColor);
  document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
  
  // Update custom CSS variables for shadcn/ui
  const hslPrimary = hexToHSL(selectedPalette.primaryColor);
  if (hslPrimary) {
    document.documentElement.style.setProperty('--primary', `${hslPrimary.h} ${hslPrimary.s}% ${hslPrimary.l}%`);
  }
};

interface AppearanceSettingsProps {
  settings: AppSettings;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onCouleurChange: (couleur: string) => void;
  onLayoutTypeChange: (layoutType: 'tabs' | 'sidebar') => void;
  onSaveSettings: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onThemeChange,
  onCouleurChange,
  onLayoutTypeChange,
  onSaveSettings
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Thème</CardTitle>
          <CardDescription>
            Choisissez le mode d'affichage qui vous convient le mieux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={settings.theme} 
            onValueChange={(value) => onThemeChange(value as 'light' | 'dark' | 'system')}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Label 
                htmlFor="light" 
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                  ${settings.theme === 'light' ? 'border-primary' : ''}
                `}
              >
                <Sun className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Clair</p>
                  <p className="text-sm text-muted-foreground">
                    Mode clair standard
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Label 
                htmlFor="dark" 
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                  ${settings.theme === 'dark' ? 'border-primary' : ''}
                `}
              >
                <Moon className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Sombre</p>
                  <p className="text-sm text-muted-foreground">
                    Réduit la fatigue oculaire
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Label 
                htmlFor="system" 
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                  ${settings.theme === 'system' ? 'border-primary' : ''}
                `}
              >
                <Monitor className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Système</p>
                  <p className="text-sm text-muted-foreground">
                    Adapté à vos préférences
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Palette de couleurs</CardTitle>
          <CardDescription>
            Choisissez la palette de couleurs principale de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {couleurs.map((palette) => (
              <button
                key={palette.id}
                onClick={() => onCouleurChange(palette.id as AppSettings['couleur'])}
                className={`
                  relative flex flex-col items-center rounded-md border-2 border-muted p-4 hover:border-accent
                  ${settings.couleur=== palette.id ? 'border-primary' : ''}
                `}
              >
                <div className="flex space-x-2 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: palette.primaryColor }}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: palette.secondaryColor }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{palette.name}</span>
                
                {settings.couleur=== palette.id && (
                  <div className="absolute top-2 right-2 text-primary">
                    <Check size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Disposition</CardTitle>
          <CardDescription>
            Choisissez le style de navigation que vous préférez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={settings.layoutType}
            onValueChange={(value) => onLayoutTypeChange(value as 'tabs' | 'sidebar')}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="tabs" id="tabs" className="sr-only" />
              <Label 
                htmlFor="tabs" 
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                  ${settings.layoutType === 'tabs' ? 'border-primary' : ''}
                `}
              >
                <LayoutList className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Onglets</p>
                  <p className="text-sm text-muted-foreground">
                    Navigation horizontale par onglets
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="sidebar" id="sidebar" className="sr-only" />
              <Label 
                htmlFor="sidebar" 
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                  ${settings.layoutType === 'sidebar' ? 'border-primary' : ''}
                `}
              >
                <LayoutPanelLeft className="mb-3 h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">Barre latérale</p>
                  <p className="text-sm text-muted-foreground">
                    Navigation verticale avec menu latéral
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button onClick={onSaveSettings}>
          Enregistrer les modifications
        </Button>
      </div>
    </>
  );
};

export { AppearanceSettings, applyCouleur, couleurs };
export type { AppSettings };
