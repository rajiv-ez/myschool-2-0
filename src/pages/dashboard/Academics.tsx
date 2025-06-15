
import React from 'react';
import { Layers, GraduationCap, Grid, School } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import { useAcademicsData } from '@/hooks/useAcademicsData';
import { Niveau, Filiere, Specialite, Classe } from '@/types/academic';
import NiveauForm from '@/components/forms/NiveauForm';
import FiliereForm from '@/components/forms/FiliereForm';
import SpecialiteForm from '@/components/forms/SpecialiteForm';
import ClasseForm from '@/components/forms/ClasseForm';

const Academics: React.FC = () => {
  const {
    niveaux,
    filieres,
    specialites,
    classes,
    loading,
    fromApi,
    createNiveau,
    updateNiveau,
    deleteNiveau,
    createFiliere,
    updateFiliere,
    deleteFiliere,
    createSpecialite,
    updateSpecialite,
    deleteSpecialite,
    createClasse,
    updateClasse,
    deleteClasse,
  } = useAcademicsData();

  // Fonctions utilitaires
  const getNiveauName = (id: number) => {
    return niveaux.find(n => n.id === id)?.nom || 'Inconnu';
  };

  const getFiliereName = (id: number) => {
    return filieres.find(f => f.id === id)?.nom || 'Inconnue';
  };

  const getSpecialiteName = (id: number) => {
    return specialites.find(s => s.id === id)?.nom || 'Inconnue';
  };

  // Fonctions d'export Excel (mock)
  const exportNiveaux = () => console.log('Export niveaux');
  const exportFilieres = () => console.log('Export filières');
  const exportSpecialites = () => console.log('Export spécialités');
  const exportClasses = () => console.log('Export classes');

  // Fonctions d'import Excel (mock)
  const importNiveaux = async (data: any[]) => console.log('Import niveaux', data);
  const importFilieres = async (data: any[]) => console.log('Import filières', data);
  const importSpecialites = async (data: any[]) => console.log('Import spécialités', data);
  const importClasses = async (data: any[]) => console.log('Import classes', data);

  const tabs: TabConfig<any>[] = [
    {
      id: 'niveaux',
      label: 'Niveaux',
      icon: Layers,
      items: niveaux,
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'description', label: 'Description', render: (item) => item.description || '-' },
      ],
      searchFields: ['nom', 'description'],
      form: NiveauForm,
      createLabel: 'Nouveau Niveau',
      exportFunction: exportNiveaux,
      importType: 'succursales' as const,
      onImport: importNiveaux,
    },
    {
      id: 'filieres',
      label: 'Filières',
      icon: GraduationCap,
      items: filieres,
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'niveau', label: 'Niveau', render: (item) => getNiveauName(item.niveau) },
        { key: 'description', label: 'Description' },
      ],
      searchFields: ['nom', 'description'],
      filters: {
        niveau: {
          type: 'select' as const,
          placeholder: 'Filtrer par niveau',
          options: niveaux.map(n => ({ value: n.id.toString(), label: n.nom })),
          filterFunction: (item: Filiere, value: string) => item.niveau.toString() === value,
        },
      },
      form: FiliereForm,
      createLabel: 'Nouvelle Filière',
      exportFunction: exportFilieres,
      importType: 'succursales' as const,
      onImport: importFilieres,
    },
    {
      id: 'specialites',
      label: 'Spécialités',
      icon: Grid,
      items: specialites,
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'filiere', label: 'Filière', render: (item) => getFiliereName(item.filiere) },
        { key: 'description', label: 'Description' },
      ],
      searchFields: ['nom', 'description'],
      filters: {
        filiere: {
          type: 'select' as const,
          placeholder: 'Filtrer par filière',
          options: filieres.map(f => ({ value: f.id.toString(), label: f.nom })),
          filterFunction: (item: Specialite, value: string) => item.filiere.toString() === value,
        },
      },
      form: SpecialiteForm,
      createLabel: 'Nouvelle Spécialité',
      exportFunction: exportSpecialites,
      importType: 'succursales' as const,
      onImport: importSpecialites,
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: School,
      items: classes,
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'specialite', label: 'Spécialité', render: (item) => getSpecialiteName(item.specialite) },
        { key: 'description', label: 'Description' },
      ],
      searchFields: ['nom', 'description'],
      filters: {
        specialite: {
          type: 'select' as const,
          placeholder: 'Filtrer par spécialité',
          options: specialites.map(s => ({ value: s.id.toString(), label: s.nom })),
          filterFunction: (item: Classe, value: string) => item.specialite.toString() === value,
        },
      },
      form: ClasseForm,
      createLabel: 'Nouvelle Classe',
      exportFunction: exportClasses,
      importType: 'succursales' as const,
      onImport: importClasses,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <DataManagementPage
      title="Structure Académique"
      description="Gérez les niveaux, filières, spécialités et classes de votre établissement"
      tabs={tabs}
      fromApi={fromApi}
      additionalProps={{
        niveaux,
        filieres,
        specialites,
        classes,
      }}
    />
  );
};

export default Academics;
