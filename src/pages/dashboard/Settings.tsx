
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { 
  Moon, 
  Sun, 
  Palette, 
  Check,
  LayoutList,
  LayoutPanelLeft,
  CircleUser,
  Monitor,
  Briefcase,
  Mail,
  Bell,
  Languages,
  Smartphone,
  LockKeyhole,
  Share2,
  FileText,
  InfoIcon
} from 'lucide-react';

// Theme and layout settings interface
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  colorPalette: string;
  layoutType: 'tabs' | 'sidebar';
}

// Default settings
const defaultSettings: AppSettings = {
  theme: 'light',
  colorPalette: 'purple',
  layoutType: 'tabs'
};

// Color palettes
const colorPalettes = [
  { id: 'purple', name: 'Violet', primaryColor: '#9b87f5', secondaryColor: '#7E69AB' },
  { id: 'blue', name: 'Bleu', primaryColor: '#0EA5E9', secondaryColor: '#0284C7' },
  { id: 'green', name: 'Vert', primaryColor: '#10B981', secondaryColor: '#059669' },
  { id: 'orange', name: 'Orange', primaryColor: '#F97316', secondaryColor: '#EA580C' },
  { id: 'red', name: 'Rouge', primaryColor: '#EF4444', secondaryColor: '#DC2626' },
  { id: 'pink', name: 'Rose', primaryColor: '#EC4899', secondaryColor: '#DB2777' },
];

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [currentTab, setCurrentTab] = useState('appearance');
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Update theme when settings change
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Handle theme change
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const newSettings = { ...settings, theme };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    toast({
      title: "Thème modifié",
      description: `Thème ${theme === 'light' ? 'clair' : theme === 'dark' ? 'sombre' : 'système'} appliqué`,
    });
  };

  // Handle color palette change
  const handleColorPaletteChange = (colorPalette: string) => {
    const newSettings = { ...settings, colorPalette };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    // In a real application, we would apply the color palette here
    // This could involve changing CSS variables or dynamically loading a stylesheet
    
    toast({
      title: "Palette de couleurs modifiée",
      description: `Palette ${colorPalettes.find(p => p.id === colorPalette)?.name} appliquée`,
    });
  };

  // Handle layout type change
  const handleLayoutTypeChange = (layoutType: 'tabs' | 'sidebar') => {
    const newSettings = { ...settings, layoutType };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    toast({
      title: "Disposition modifiée",
      description: `Disposition ${layoutType === 'tabs' ? 'en onglets' : 'avec barre latérale'} appliquée`,
      description: "Veuillez rafraîchir la page pour appliquer les changements",
    });
  };

  // Handle save all settings
  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: "Paramètres enregistrés",
      description: "Vos préférences ont été enregistrées avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Paramètres</h2>
        <p className="text-muted-foreground">Personnalisez votre expérience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <Card>
          <CardContent className="p-4">
            <nav className="space-y-1 mt-2">
              <Button 
                variant={currentTab === 'appearance' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('appearance')}
              >
                <Palette className="mr-2 h-4 w-4" />
                Apparence
              </Button>
              <Button 
                variant={currentTab === 'profile' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('profile')}
              >
                <CircleUser className="mr-2 h-4 w-4" />
                Profil
              </Button>
              <Button 
                variant={currentTab === 'account' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('account')}
              >
                <Monitor className="mr-2 h-4 w-4" />
                Compte
              </Button>
              <Button 
                variant={currentTab === 'organization' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('organization')}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Organisation
              </Button>
              <Button 
                variant={currentTab === 'notifications' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button 
                variant={currentTab === 'language' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('language')}
              >
                <Languages className="mr-2 h-4 w-4" />
                Langue
              </Button>
              <Button 
                variant={currentTab === 'mobile' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('mobile')}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Applications mobiles
              </Button>
              <Button 
                variant={currentTab === 'security' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('security')}
              >
                <LockKeyhole className="mr-2 h-4 w-4" />
                Sécurité
              </Button>
              <Button 
                variant={currentTab === 'sharing' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('sharing')}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Partage
              </Button>
              <Button 
                variant={currentTab === 'legal' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('legal')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Mentions légales
              </Button>
              <Button 
                variant={currentTab === 'about' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setCurrentTab('about')}
              >
                <InfoIcon className="mr-2 h-4 w-4" />
                À propos
              </Button>
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {currentTab === 'appearance' && (
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
                    onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
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

              <Card>
                <CardHeader>
                  <CardTitle>Palette de couleurs</CardTitle>
                  <CardDescription>
                    Choisissez la palette de couleurs principale de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {colorPalettes.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => handleColorPaletteChange(palette.id)}
                        className={`
                          relative flex flex-col items-center rounded-md border-2 border-muted p-4 hover:border-accent
                          ${settings.colorPalette === palette.id ? 'border-primary' : ''}
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
                        
                        {settings.colorPalette === palette.id && (
                          <div className="absolute top-2 right-2 text-primary">
                            <Check size={16} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disposition</CardTitle>
                  <CardDescription>
                    Choisissez le style de navigation que vous préférez
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue={settings.layoutType} 
                    onValueChange={(value) => handleLayoutTypeChange(value as 'tabs' | 'sidebar')}
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

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Enregistrer les modifications
                </Button>
              </div>
            </>
          )}

          {currentTab !== 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentTab === 'profile' && 'Profil'}
                  {currentTab === 'account' && 'Compte'}
                  {currentTab === 'organization' && 'Organisation'}
                  {currentTab === 'notifications' && 'Notifications'}
                  {currentTab === 'language' && 'Langue'}
                  {currentTab === 'mobile' && 'Applications mobiles'}
                  {currentTab === 'security' && 'Sécurité'}
                  {currentTab === 'sharing' && 'Partage'}
                  {currentTab === 'legal' && 'Mentions légales'}
                  {currentTab === 'about' && 'À propos'}
                </CardTitle>
                <CardDescription>
                  Cette section est en cours de développement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    {currentTab === 'profile' && <CircleUser className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'account' && <Monitor className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'organization' && <Briefcase className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'notifications' && <Bell className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'language' && <Languages className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'mobile' && <Smartphone className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'security' && <LockKeyhole className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'sharing' && <Share2 className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'legal' && <FileText className="h-8 w-8 text-muted-foreground" />}
                    {currentTab === 'about' && <InfoIcon className="h-8 w-8 text-muted-foreground" />}
                  </div>
                  <h3 className="mt-4 text-lg font-medium">Fonctionnalité à venir</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Cette section sera disponible dans une prochaine mise à jour. 
                    Nous travaillons actuellement à l'amélioration de cette fonctionnalité.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
