
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Palette, 
  Shield, 
  Building2,
  Bell, 
  Globe, 
  CreditCard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    {
      id: 'appearance',
      label: 'Apparence',
      icon: Palette,
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
    },
    {
      id: 'security',
      label: 'Sécurité',
      icon: Shield,
    },
    {
      id: 'organisation',
      label: 'Organisation',
      icon: Building2,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
    },
    {
      id: 'langue',
      label: 'Langue',
      icon: Globe,
    },
    {
      id: 'facturation',
      label: 'Facturation',
      icon: CreditCard,
    },
  ];

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={currentTab === item.id ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              currentTab === item.id && 'bg-secondary'
            )}
            onClick={() => setCurrentTab(item.id)}
          >
            <Icon size={16} className="mr-2" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
};

export default SettingsSidebar;
