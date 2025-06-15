
import React from 'react';
import { UserPlus } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import InscriptionForm from '@/components/forms/InscriptionForm';
import { useInscriptionsData } from '@/hooks/useInscriptionsData';
import { exportInscriptionsToExcel } from '@/utils/excelUtils';
import { academicService } from '@/services/academicService';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Inscription } from '@/types/academic';

const Inscriptions: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    inscriptions, 
    classesAcademiques, 
    sessions, 
    classes,
    isLoading, 
    fromApi 
  } = useInscriptionsData();

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const handleImportInscriptions = async (data: any[]) => {
    console.log('Starting import of inscriptions:', data);
    
    try {
      const results = [];
      for (const item of data) {
        try {
          console.log('Creating inscription:', item);
          const result = await academicService.createInscription(item);
          results.push(result);
        } catch (error) {
          console.error('Error creating inscription:', error);
          throw error;
        }
      }
      
      // Refresh all related data
      await queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['eleves'] });
      
      toast({
        title: 'Import réussi',
        description: `${results.length} inscription(s) importée(s) avec succès`,
      });
      
      console.log('Import completed successfully:', results);
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import des inscriptions',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const tabs: TabConfig<Inscription & { 
    eleveNom: string;
    classeSessionNom: string;
    statutLabel: string;
    statutColor: string;
    typeLabel: string;
    typeColor: string;
    dateFormatted: string;
  }>[] = [
    {
      id: 'inscriptions',
      label: 'Inscriptions',
      icon: UserPlus,
      items: inscriptions,
      columns: [
        { 
          key: 'id', 
          label: 'ID' 
        },
        { 
          key: 'eleveNom', 
          label: 'Élève' 
        },
        { 
          key: 'classeSessionNom', 
          label: 'Classe/Session' 
        },
        { 
          key: 'dateFormatted', 
          label: 'Date inscription' 
        },
        { 
          key: 'typeLabel', 
          label: 'Type',
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.typeColor}`}>
              {item.typeLabel}
            </span>
          )
        },
        { 
          key: 'statutLabel', 
          label: 'Statut',
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.statutColor}`}>
              {item.statutLabel}
            </span>
          )
        }
      ],
      searchFields: ['eleveNom', 'classeSessionNom'],
      filters: {
        session: {
          type: 'select',
          placeholder: 'Session',
          options: [
            ...sessions.map(session => ({
              value: session.id.toString(),
              label: session.nom
            }))
          ],
          filterFunction: (item, value) => {
            // Trouver la session de cette inscription
            const sessionId = parseInt(value);
            return item.classeSessionNom.includes(
              sessions.find(s => s.id === sessionId)?.nom || ''
            );
          }
        },
        classe: {
          type: 'select',
          placeholder: 'Classe',
          options: [
            ...classes.map(classe => ({
              value: classe.id.toString(),
              label: classe.nom
            }))
          ],
          filterFunction: (item, value) => {
            const classeId = parseInt(value);
            return item.classeSessionNom.includes(
              classes.find(c => c.id === classeId)?.nom || ''
            );
          }
        },
        statut: {
          type: 'select',
          placeholder: 'Statut',
          options: [
            { value: 'CONFIRMEE', label: 'Confirmée' },
            { value: 'EN_ATTENTE', label: 'En attente' },
            { value: 'ANNULEE', label: 'Annulée' }
          ],
          filterFunction: (item, value) => item.statut === value
        }
      },
      form: ({ isEditing, selectedItem, onSubmit, onCancel, ...props }) => (
        <InscriptionForm
          isEditing={isEditing}
          selectedInscription={selectedItem}
          classesAcademiques={classesAcademiques}
          onSubmit={onSubmit}
          onCancel={onCancel}
          {...props}
        />
      ),
      createLabel: 'Nouvelle inscription',
      exportFunction: (items) => {
        exportInscriptionsToExcel(items);
      },
      importType: 'inscriptions',
      onImport: handleImportInscriptions
    }
  ];

  return (
    <DataManagementPage
      title="Inscriptions"
      description="Gérez les inscriptions des élèves pour les sessions"
      tabs={tabs}
      fromApi={fromApi}
      additionalProps={{
        classesAcademiques
      }}
    />
  );
};

export default Inscriptions;
