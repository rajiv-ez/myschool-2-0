
import React from 'react';
import { BookOpen, Book, FileText } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import { useTeachingData } from '@/hooks/useTeachingData';
import { Domaine, UniteEnseignement, Matiere } from '@/types/teaching';
import { teachingService } from '@/services/teachingService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import DomaineForm from '@/components/forms/DomaineForm';
import UniteForm from '@/components/forms/UniteForm';
import MatiereForm from '@/components/forms/MatiereForm';
import { 
  exportDomainesToExcel, 
  exportUnitesToExcel, 
  exportMatieresToExcel,
  validateDomainesImport 
} from '@/utils/excelUtils';

const Education: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  // Import functions with API integration
  const handleImportDomaines = async (data: any[]) => {
    console.log('Starting import of domaines:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating domaine:', item);
          const result = await teachingService.createDomaine(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating domaine:', error);
          throw error;
        }
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['domaines'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} domaine(s) importé(s) avec succès`,
      });
      
      console.log('Domaines import completed successfully:', results);
    } catch (error) {
      console.error('Domaines import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des domaines',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleImportUnites = async (data: any[]) => {
    console.log('Starting import of unites:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating unite:', item);
          const result = await teachingService.createUnite(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating unite:', error);
          throw error;
        }
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['unites'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} unité(s) importée(s) avec succès`,
      });
      
      console.log('Unites import completed successfully:', results);
    } catch (error) {
      console.error('Unites import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des unités',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleImportMatieres = async (data: any[]) => {
    console.log('Starting import of matieres:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating matiere:', item);
          const result = await teachingService.createMatiere(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating matiere:', error);
          throw error;
        }
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['matieres'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} matière(s) importée(s) avec succès`,
      });
      
      console.log('Matieres import completed successfully:', results);
    } catch (error) {
      console.error('Matieres import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des matières',
        variant: 'destructive'
      });
      throw error;
    }
  };

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
      exportFunction: (items) => exportDomainesToExcel(items),
      importType: 'succursales' as const,
      onImport: handleImportDomaines,
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
      exportFunction: (items) => exportUnitesToExcel(items, domaines),
      importType: 'succursales' as const,
      onImport: handleImportUnites,
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
      exportFunction: (items) => exportMatieresToExcel(items, unites),
      importType: 'succursales' as const,
      onImport: handleImportMatieres,
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
