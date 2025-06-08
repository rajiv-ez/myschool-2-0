
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useClassroomData } from '@/hooks/useClassroomData';
import ConfigurationForm from './ConfigurationForm';
import DispositionForm from './DispositionForm';
import ConfigurationsList from './ConfigurationsList';
import { ConfigurationClasse, DispositionClasse } from '@/types/configuration';

const ClassroomEditor: React.FC = () => {
  const [editMode, setEditMode] = useState<'config' | 'assignment'>('config');
  
  const {
    configurations,
    dispositions,
    classeSessions,
    activeConfiguration,
    activeDisposition,
    createConfiguration,
    activateConfiguration,
    createDisposition,
    activateDisposition,
    getStudentsForActiveConfig,
    isLoading
  } = useClassroomData();

  const handleLoadConfiguration = (config: ConfigurationClasse) => {
    // Configuration will be loaded automatically when it becomes active
    console.log('Loading configuration:', config);
  };

  const handleLoadDisposition = (disposition: DispositionClasse) => {
    // Disposition will be loaded automatically when it becomes active
    console.log('Loading disposition:', disposition);
  };

  const handleDeleteConfiguration = (id: number) => {
    // TODO: Implement delete functionality
    console.log('Delete configuration:', id);
  };

  const handleDeleteDisposition = (id: number) => {
    // TODO: Implement delete functionality
    console.log('Delete disposition:', id);
  };

  const students = getStudentsForActiveConfig();

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button 
          variant={editMode === 'config' ? 'default' : 'outline'}
          onClick={() => setEditMode('config')}
        >
          Configuration des rangées
        </Button>
        <Button 
          variant={editMode === 'assignment' ? 'default' : 'outline'}
          onClick={() => setEditMode('assignment')}
        >
          Attribution des places
        </Button>
      </div>

      {editMode === 'config' ? (
        <div className="space-y-6">
          <ConfigurationForm
            activeConfiguration={activeConfiguration}
            classeSessions={classeSessions}
            onCreateConfiguration={createConfiguration}
            onActivateConfiguration={activateConfiguration}
            isLoading={isLoading}
          />
          
          <ConfigurationsList
            configurations={configurations}
            dispositions={dispositions}
            activeConfiguration={activeConfiguration}
            activeDisposition={activeDisposition}
            onLoadConfiguration={handleLoadConfiguration}
            onLoadDisposition={handleLoadDisposition}
            onDeleteConfiguration={handleDeleteConfiguration}
            onDeleteDisposition={handleDeleteDisposition}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <DispositionForm
            activeDisposition={activeDisposition}
            activeConfigId={activeConfiguration?.id}
            students={students}
            onCreateDisposition={createDisposition}
            onActivateDisposition={activateDisposition}
            isLoading={isLoading}
            rows={activeConfiguration?.nb_rangees || 3}
            linesPerRow={activeConfiguration?.nb_lignes_par_rangee || 3}
            positionsPerLine={activeConfiguration?.nb_places_par_ligne || 3}
          />
          
          <ConfigurationsList
            configurations={configurations}
            dispositions={dispositions}
            activeConfiguration={activeConfiguration}
            activeDisposition={activeDisposition}
            onLoadConfiguration={handleLoadConfiguration}
            onLoadDisposition={handleLoadDisposition}
            onDeleteConfiguration={handleDeleteConfiguration}
            onDeleteDisposition={handleDeleteDisposition}
          />
        </div>
      )}
    </div>
  );
};

export default ClassroomEditor;
