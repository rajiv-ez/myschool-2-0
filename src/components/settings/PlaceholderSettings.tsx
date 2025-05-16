
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CircleUser, Monitor, Briefcase, Bell, Languages, Smartphone, LockKeyhole, Share2, FileText, InfoIcon } from 'lucide-react';

interface PlaceholderSettingsProps {
  currentTab: string;
}

const PlaceholderSettings: React.FC<PlaceholderSettingsProps> = ({ currentTab }) => {
  return (
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
  );
};

export default PlaceholderSettings;
