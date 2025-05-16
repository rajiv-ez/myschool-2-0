
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AppearanceSettings, applyColorPalette, colorPalettes, AppSettings } from '@/components/settings/AppearanceSettings';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import PlaceholderSettings from '@/components/settings/PlaceholderSettings';

// Default settings with tabs as the default layout
const defaultSettings: AppSettings = {
  theme: 'light',
  colorPalette: 'purple',
  layoutType: 'tabs'
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [currentTab, setCurrentTab] = useState('appearance');
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings({
        ...defaultSettings,
        ...parsedSettings
      });
      
      // Apply the color palette at loading
      applyColorPalette(parsedSettings.colorPalette || defaultSettings.colorPalette);
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
    
    // Apply the color palette
    applyColorPalette(colorPalette);
    
    toast({
      title: "Palette de couleurs modifiée",
      description: `Palette ${colorPalettes.find(p => p.id === colorPalette)?.name} appliquée`,
    });
  };

  // Handle layout type change
  const handleLayoutTypeChange = (layoutType: 'tabs' | 'sidebar') => {
    // If already on the selected layout, no need to reload
    if (layoutType === settings.layoutType) return;
    
    const newSettings = { ...settings, layoutType };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    toast({
      title: "Disposition modifiée",
      description: `Disposition ${layoutType === 'tabs' ? 'en onglets' : 'avec barre latérale'} appliquée.`,
    });
    
    // Reload the page to apply the changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
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
        {/* Settings Sidebar */}
        <SettingsSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Settings Content */}
        <div className="space-y-6">
          {currentTab === 'appearance' ? (
            <AppearanceSettings 
              settings={settings}
              onThemeChange={handleThemeChange}
              onColorPaletteChange={handleColorPaletteChange}
              onLayoutTypeChange={handleLayoutTypeChange}
              onSaveSettings={handleSaveSettings}
            />
          ) : (
            <PlaceholderSettings currentTab={currentTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
