
import React, { useEffect } from 'react';
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
  Check,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

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
  hex = hex.replace('#', '');
  
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

const applyCouleur = (palette: string) => {
  const selectedPalette = couleurs.find(p => p.id === palette);
  
  if (!selectedPalette) return;

  document.documentElement.style.setProperty('--color-primary', selectedPalette.primaryColor);
  document.documentElement.style.setProperty('--color-primary-hover', selectedPalette.secondaryColor);
  document.documentElement.style.setProperty('--primary', selectedPalette.primaryColor);
  document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
  
  const hslPrimary = hexToHSL(selectedPalette.primaryColor);
  if (hslPrimary) {
    document.documentElement.style.setProperty('--primary', `${hslPrimary.h} ${hslPrimary.s}% ${hslPrimary.l}%`);
  }
};

const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const html = document.documentElement;
  if (theme === 'dark') html.classList.add('dark');
  else if (theme === 'light') html.classList.remove('dark');
  else if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    prefersDark ? html.classList.add('dark') : html.classList.remove('dark');
  }
};

const AppearanceSettings: React.FC = () => {
  const { 
    preferences, 
    loading, 
    error, 
    loadPreferences, 
    savePreferences, 
    updateLocalPreferences 
  } = usePreferencesStore();
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (preferences) {
      console.log('Préférences chargées:', preferences);
      // Apply theme
      applyTheme(preferences.theme);

      // Apply color palette
      applyCouleur(preferences.couleur);
  
    }
  }, [preferences]);

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    updateLocalPreferences({ theme });
    
    try {
      await savePreferences({ theme });
      toast({
        title: "Thème modifié",
        description: `Thème ${theme === 'light' ? 'clair' : theme === 'dark' ? 'sombre' : 'système'} appliqué`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le thème",
        variant: "destructive"
      });
    }
  };

  const handleCouleurChange = async (couleur: string) => {
    updateLocalPreferences({ couleur: couleur as any });
    applyCouleur(couleur);
    
    try {
      await savePreferences({ couleur: couleur as any });
      toast({
        title: "Palette de couleurs modifiée",
        description: `Palette ${couleurs.find(p => p.id === couleur)?.name} appliquée`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la palette",
        variant: "destructive"
      });
    }
  };

  const handleLayoutTypeChange = async (layoutType: 'tabs' | 'sidebar') => {
    if (layoutType === preferences?.disposition) return;
    
    updateLocalPreferences({ disposition: layoutType });
    
    try {
      await savePreferences({ disposition: layoutType });
      toast({
        title: "Disposition modifiée",
        description: `Disposition ${layoutType === 'tabs' ? 'en onglets' : 'avec barre latérale'} appliquée.`,
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la disposition",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des préférences...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">{error}</p>
        <Button onClick={loadPreferences} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center p-8">
        <p>Aucune préférence trouvée</p>
      </div>
    );
  }

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
            value={preferences.theme} 
            onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Label 
                htmlFor="light" 
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                  ${preferences.theme === 'light' ? 'border-primary' : ''}
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
                  ${preferences.theme === 'dark' ? 'border-primary' : ''}
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
                  ${preferences.theme === 'system' ? 'border-primary' : ''}
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
                onClick={() => handleCouleurChange(palette.id)}
                className={`
                  relative flex flex-col items-center rounded-md border-2 border-muted p-4 hover:border-accent
                  ${preferences.couleur === palette.id ? 'border-primary' : ''}
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
                
                {preferences.couleur === palette.id && (
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
            value={preferences.disposition}
            onValueChange={(value) => handleLayoutTypeChange(value as 'tabs' | 'sidebar')}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="tabs" id="tabs" className="sr-only" />
              <Label 
                htmlFor="tabs" 
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                  ${preferences.disposition === 'tabs' ? 'border-primary' : ''}
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
                  ${preferences.disposition === 'sidebar' ? 'border-primary' : ''}
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
    </>
  );
};

export { AppearanceSettings, applyTheme, applyCouleur, couleurs };
