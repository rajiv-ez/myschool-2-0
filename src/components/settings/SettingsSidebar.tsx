
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Palette, 
  CircleUser,
  Monitor,
  Briefcase,
  Bell,
  Languages,
  Smartphone,
  LockKeyhole,
  Share2,
  FileText,
  InfoIcon
} from 'lucide-react';

interface SettingsSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ currentTab, setCurrentTab }) => {
  return (
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
  );
};

export default SettingsSidebar;
