
import React from 'react';
import { CalendarDays, Calendar, GraduationCap } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import { useAcademicData } from '@/hooks/useAcademicData';
import { Session, Palier, ClasseSession } from '@/types/academic';
import SessionForm from '@/components/forms/SessionForm';
import PalierForm from '@/components/forms/PalierForm';
import ClasseSessionForm from '@/components/forms/ClasseSessionForm';

const Sessions: React.FC = () => {
  const {
    sessions,
    paliers,
    classes,
    classeSessions,
    createSession,
    updateSession,
    deleteSession,
    createPalier,
    updatePalier,
    deletePalier,
    createClasseSession,
    updateClasseSession,
    deleteClasseSession,
  } = useAcademicData();

  // Utility functions
  const getSessionName = (id: number) => {
    return sessions.find(s => s.id === id)?.nom || 'Inconnue';
  };

  const getClassName = (id: number) => {
    return classes.find(c => c.id === id)?.nom || 'Inconnue';
  };

  const getStatusColor = (enCours: boolean) => {
    return enCours 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (enCours: boolean) => {
    return enCours ? 'En cours' : 'Terminé';
  };

  // Mock export functions
  const exportSessions = () => console.log('Export sessions');
  const exportPaliers = () => console.log('Export paliers');
  const exportClasseSessions = () => console.log('Export classe sessions');

  // Mock import functions
  const importSessions = async (data: any[]) => console.log('Import sessions', data);
  const importPaliers = async (data: any[]) => console.log('Import paliers', data);
  const importClasseSessions = async (data: any[]) => console.log('Import classe sessions', data);

  const tabs: TabConfig<any>[] = [
    {
      id: 'sessions',
      label: 'Sessions',
      icon: CalendarDays,
      items: sessions,
      columns: [
        { key: 'nom', label: 'Nom de la session' },
        { 
          key: 'debut', 
          label: 'Date de début',
          render: (item) => new Date(item.debut).toLocaleDateString()
        },
        { 
          key: 'fin', 
          label: 'Date de fin',
          render: (item) => new Date(item.fin).toLocaleDateString()
        },
        { 
          key: 'en_cours', 
          label: 'Statut',
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.en_cours)}`}>
              {getStatusText(item.en_cours)}
            </span>
          )
        },
        { 
          key: 'auto_activer_palier', 
          label: 'Auto-activation',
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.auto_activer_palier 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.auto_activer_palier ? 'Activé' : 'Désactivé'}
            </span>
          )
        },
      ],
      searchFields: ['nom'],
      filters: {
        statut: {
          type: 'select' as const,
          placeholder: 'Filtrer par statut',
          options: [
            { value: 'en_cours', label: 'En cours' },
            { value: 'termine', label: 'Terminé' },
          ],
          filterFunction: (item: Session, value: string) => {
            if (value === 'en_cours') return item.en_cours;
            if (value === 'termine') return !item.en_cours;
            return true;
          },
        },
      },
      form: SessionForm,
      createLabel: 'Nouvelle Session',
      exportFunction: exportSessions,
      importType: 'succursales' as const,
      onImport: importSessions,
    },
    {
      id: 'paliers',
      label: 'Paliers',
      icon: Calendar,
      items: paliers,
      columns: [
        { key: 'nom', label: 'Nom du palier' },
        { 
          key: 'session', 
          label: 'Session',
          render: (item) => getSessionName(item.session)
        },
        { 
          key: 'debut', 
          label: 'Date de début',
          render: (item) => new Date(item.debut).toLocaleDateString()
        },
        { 
          key: 'fin', 
          label: 'Date de fin',
          render: (item) => new Date(item.fin).toLocaleDateString()
        },
        { 
          key: 'en_cours', 
          label: 'Statut',
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.en_cours)}`}>
              {getStatusText(item.en_cours)}
            </span>
          )
        },
      ],
      searchFields: ['nom'],
      filters: {
        session: {
          type: 'select' as const,
          placeholder: 'Filtrer par session',
          options: sessions.map(s => ({ value: s.id.toString(), label: s.nom })),
          filterFunction: (item: Palier, value: string) => item.session.toString() === value,
        },
        statut: {
          type: 'select' as const,
          placeholder: 'Filtrer par statut',
          options: [
            { value: 'en_cours', label: 'En cours' },
            { value: 'termine', label: 'Terminé' },
          ],
          filterFunction: (item: Palier, value: string) => {
            if (value === 'en_cours') return item.en_cours;
            if (value === 'termine') return !item.en_cours;
            return true;
          },
        },
      },
      form: PalierForm,
      createLabel: 'Nouveau Palier',
      exportFunction: exportPaliers,
      importType: 'succursales' as const,
      onImport: importPaliers,
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: GraduationCap,
      items: classeSessions.map(cs => {
        const classe = classes.find(c => c.id === cs.classe);
        const session = sessions.find(s => s.id === cs.session);
        return {
          ...cs,
          classeData: classe,
          sessionData: session
        };
      }).filter(cs => cs.classeData && cs.sessionData),
      columns: [
        { 
          key: 'classe', 
          label: 'Classe',
          render: (item) => getClassName(item.classe)
        },
        { 
          key: 'session', 
          label: 'Session',
          render: (item) => getSessionName(item.session)
        },
        { key: 'capacite', label: 'Capacité' },
        { 
          key: 'description', 
          label: 'Description',
          render: (item) => item.classeData?.description || ''
        },
      ],
      searchFields: ['classeData.nom', 'sessionData.nom'],
      filters: {
        session: {
          type: 'select' as const,
          placeholder: 'Filtrer par session',
          options: sessions.map(s => ({ value: s.id.toString(), label: s.nom })),
          filterFunction: (item: any, value: string) => item.session.toString() === value,
        },
      },
      form: ClasseSessionForm,
      createLabel: 'Nouvelle Classe',
      exportFunction: exportClasseSessions,
      importType: 'succursales' as const,
      onImport: importClasseSessions,
    },
  ];

  return (
    <DataManagementPage
      title="Sessions et Paliers"
      description="Gérez les sessions scolaires, les paliers et les classes académiques"
      tabs={tabs}
      fromApi={false}
      additionalProps={{
        sessions,
        paliers,
        classes,
        classeSessions,
      }}
    />
  );
};

export default Sessions;
