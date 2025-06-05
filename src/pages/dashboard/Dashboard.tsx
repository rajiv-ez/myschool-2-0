
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap,
  Award
} from 'lucide-react';
import StaffView from '@/components/dashboard/StaffView';
import TuteurView from '@/components/dashboard/TuteurView';
import EleveView from '@/components/dashboard/EleveView';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('staff');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre espace scolaire</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'staff' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('staff')}
          >
            <GraduationCap className="w-4 h-4 mr-1" />
            Staff
          </Button>
          <Button 
            variant={activeView === 'tuteur' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('tuteur')}
          >
            <Users className="w-4 h-4 mr-1" />
            Tuteur
          </Button>
          <Button 
            variant={activeView === 'eleve' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('eleve')}
          >
            <Award className="w-4 h-4 mr-1" />
            Élève
          </Button>
        </div>
      </div>

      {activeView === 'staff' && <StaffView />}
      {activeView === 'tuteur' && <TuteurView />}
      {activeView === 'eleve' && <EleveView />}
    </div>
  );
};

export default Dashboard;
