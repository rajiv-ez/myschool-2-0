
import React, { useState } from 'react';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import OrganisationSettings from '@/components/settings/OrganisationSettings';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import PlaceholderSettings from '@/components/settings/PlaceholderSettings';

const Settings: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('appearance');

  const renderContent = () => {
    switch (currentTab) {
      case 'appearance':
        return <AppearanceSettings />;
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'organisation':
        return <OrganisationSettings />;
      default:
        return <PlaceholderSettings currentTab={currentTab} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Paramètres</h2>
        <p className="text-muted-foreground">Personnalisez votre expérience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <SettingsSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
