
import React from 'react';
import { BookOpen, Book, FileText } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import { useTeachingData } from '@/hooks/useTeachingData';
import { Domaine, UniteEnseignement, Matiere } from '@/types/teaching';
import DomaineForm from '@/components/forms/DomaineForm';
import UniteForm from '@/components/forms/UniteForm';
import MatiereForm from '@/components/forms/MatiereForm';

const Education: React.FC = () => {
  const {
    domaines,
    unites,
    matieres,
    fromApi,
    createDomaine,
    updateDomaine,
    deleteDomaine,
    createUnite,
    updateUnite,
    deleteUnite,
    createMatiere,
    updateMatiere,
    deleteMatiere,
  } = useTeachingData();

  // Fonctions utilitaires
  const getDomaineName = (id: number) => {
    return domaines.find(d => d.id === id)?.nom || 'Inconnu';
  };

  const getUniteName = (id: number) => {
    return unites.find(u => u.id === id)?.nom || 'Inconnue';
  };

  const getDomainesForUnite = (domaineIds: number[]) => {
    return domaineIds.map(id => getDomaineName(id)).join(', ');
  };

  const getCoefficientColor = (coefficient: number) => {
    if (coefficient <= 2) return 'bg-orange-100 text-orange-800';
    if (coefficient === 3) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  // Fonctions d'export Excel (mock)
  const exportDomaines = () => console.log('Export domaines');
  const exportUnites = () => console.log('Export unités');
  const exportMatieres = () => console.log('Export matières');

  // Fonctions d'import Excel (mock)
  const importDomaines = async (data: any[]) => console.log('Import domaines', data);
  const importUnites = async (data: any[]) => console.log('Import unités', data);
  const importMatieres = async (data: any[]) => console.log('Import matières', data);

  const tabs: TabConfig<any>[] = [
    {
      id: 'domaines',
      label: 'Domaines',
      icon: BookOpen,
      items: domaines,
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'description', label: 'Description' },
      ],
      searchFields: ['nom', 'description'],
      form: DomaineForm,
      createLabel: 'Nouveau Domaine',
      exportFunction: exportDomaines,
      importType: 'succursales' as const,
      onImport: importDomaines,
    },
    {
      id: 'unites',
      label: 'Unités',
      icon: Book,
      items: unites,
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'description', label: 'Description' },
        { key: 'domaines', label: 'Domaines', render: (item) => getDomainesForUnite(item.domaines) },
      ],
      searchFields: ['nom', 'description'],
      filters: {
        domaine: {
          type: 'select' as const,
          placeholder: 'Filtrer par domaine',
          options: domaines.map(d => ({ value: d.id.toString(), label: d.nom })),
          filterFunction: (item: UniteEnseignement, value: string) => item.domaines.includes(parseInt(value)),
        },
      },
      form: UniteForm,
      createLabel: 'Nouvelle Unité',
      exportFunction: exportUnites,
      importType: 'succursales' as const,
      onImport: importUnites,
    },
    {
      id: 'matieres',
      label: 'Matières',
      icon: FileText,
      items: matieres,
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'unite', label: 'Unité', render: (item) => getUniteName(item.unite) },
        { 
          key: 'coefficient', 
          label: 'Coefficient', 
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCoefficientColor(item.coefficient)}`}>
              {item.coefficient}
            </span>
          )
        },
        { key: 'description', label: 'Description' },
      ],
      searchFields: ['nom', 'description'],
      filters: {
        unite: {
          type: 'select' as const,
          placeholder: 'Filtrer par unité',
          options: unites.map(u => ({ value: u.id.toString(), label: u.nom })),
          filterFunction: (item: Matiere, value: string) => item.unite.toString() === value,
        },
      },
      form: MatiereForm,
      createLabel: 'Nouvelle Matière',
      exportFunction: exportMatieres,
      importType: 'succursales' as const,
      onImport: importMatieres,
    },
  ];

  return (
    <DataManagementPage
      title="Unités d'Enseignement"
      description="Gérez les domaines, unités d'enseignement et matières"
      tabs={tabs}
      fromApi={fromApi}
      additionalProps={{
        domaines,
        unites,
        matieres,
      }}
    />
  );
};

export default Education;
