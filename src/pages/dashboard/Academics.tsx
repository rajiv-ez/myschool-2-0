
import React from 'react';
import { Layers, GraduationCap, Grid, School } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import { useAcademicsData } from '@/hooks/useAcademicsData';
import { Niveau, Filiere, Specialite, Classe } from '@/types/academic';
import { academicService } from '@/services/academicService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import NiveauForm from '@/components/forms/NiveauForm';
import FiliereForm from '@/components/forms/FiliereForm';
import SpecialiteForm from '@/components/forms/SpecialiteForm';
import ClasseForm from '@/components/forms/ClasseForm';
import { 
  exportNiveauxToExcel, 
  exportFilieresToExcel, 
  exportSpecialitesToExcel, 
  exportClassesToExcel,
  validateNiveauxImport 
} from '@/utils/excelUtils';

const Academics: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  // Import functions with API integration
  const handleImportNiveaux = async (data: any[]) => {
    console.log('Starting import of niveaux:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating niveau:', item);
          const result = await academicService.createNiveau(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating niveau:', error);
          throw error;
        }
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['niveaux'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} niveau(x) importé(s) avec succès`,
      });
      
      console.log('Niveaux import completed successfully:', results);
    } catch (error) {
      console.error('Niveaux import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des niveaux',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleImportFilieres = async (data: any[]) => {
    console.log('Starting import of filieres:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating filiere:', item);
          const result = await academicService.createFiliere(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating filiere:', error);
          throw error;
        }
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['filieres'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} filière(s) importée(s) avec succès`,
      });
      
      console.log('Filieres import completed successfully:', results);
    } catch (error) {
      console.error('Filieres import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des filières',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleImportSpecialites = async (data: any[]) => {
    console.log('Starting import of specialites:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating specialite:', item);
          const result = await academicService.createSpecialite(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating specialite:', error);
          throw error;
        }
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['specialites'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} spécialité(s) importée(s) avec succès`,
      });
      
      console.log('Specialites import completed successfully:', results);
    } catch (error) {
      console.error('Specialites import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des spécialités',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const handleImportClasses = async (data: any[]) => {
    console.log('Starting import of classes:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating classe:', item);
          const result = await academicService.createClasse(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating classe:', error);
          throw error;
        }
      }
      
      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['classes'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} classe(s) importée(s) avec succès`,
      });
      
      console.log('Classes import completed successfully:', results);
    } catch (error) {
      console.error('Classes import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des classes',
        variant: 'destructive'
      });
      throw error;
    }
  };

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
      exportFunction: (items) => exportNiveauxToExcel(items),
      importType: 'succursales' as const,
      onImport: handleImportNiveaux,
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
      exportFunction: (items) => exportFilieresToExcel(items, niveaux),
      importType: 'succursales' as const,
      onImport: handleImportFilieres,
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
      exportFunction: (items) => exportSpecialitesToExcel(items, filieres),
      importType: 'succursales' as const,
      onImport: handleImportSpecialites,
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
      exportFunction: (items) => exportClassesToExcel(items, specialites),
      importType: 'succursales' as const,
      onImport: handleImportClasses,
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
