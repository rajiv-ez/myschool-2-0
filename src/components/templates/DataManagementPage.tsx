
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { academicService } from '@/services/academicService';
import DataManagementHeader from './DataManagementHeader';
import DataManagementTabs from './DataManagementTabs';
import DataManagementTabContent from './DataManagementTabContent';
import DataManagementModals from './DataManagementModals';

export interface TabConfig<T> {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: string | number }>;
  items: T[];
  columns: {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  searchFields: string[];
  filters?: {
    [key: string]: {
      type: 'select' | 'range';
      placeholder: string;
      options?: { value: string; label: string }[];
      filterFunction?: (item: T, value: string) => boolean;
    };
  };
  form: React.ComponentType<any>;
  createLabel: string;
  exportFunction: (items: T[]) => void;
  importType: 'succursales' | 'batiments' | 'salles' | 'inscriptions' | 'eleves' | 'tuteurs';
  onImport: (data: any[]) => Promise<void>;
}

export interface DataManagementPageProps<T extends { id: number }> {
  title: string;
  description: string;
  tabs: TabConfig<any>[];
  fromApi: boolean;
  additionalProps?: Record<string, any>;
}

function DataManagementPage<T extends { id: number }>({
  title,
  description,
  tabs,
  fromApi,
  additionalProps = {}
}: DataManagementPageProps<T>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleCreateClick = () => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDetailsClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      try {
        if (activeTab === 'inscriptions') {
          await academicService.deleteInscription(selectedItem.id);
          await queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
          await queryClient.invalidateQueries({ queryKey: ['users'] });
          await queryClient.invalidateQueries({ queryKey: ['eleves'] });
        } else if (activeTab === 'eleves' && additionalProps.deleteEleveDetail) {
          await additionalProps.deleteEleveDetail(selectedItem.id);
        } else if (activeTab === 'tuteurs' && additionalProps.deleteTuteurDetail) {
          await additionalProps.deleteTuteurDetail(selectedItem.id);
        }
        
        toast({
          title: 'Suppression réussie',
          description: 'L\'élément a été supprimé avec succès.',
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la suppression.',
          variant: 'destructive'
        });
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleExportExcel = () => {
    if (currentTab) {
      currentTab.exportFunction(currentTab.items);
      toast({
        title: 'Export Excel',
        description: 'Le fichier Excel a été téléchargé avec succès',
      });
    }
  };

  const handleImportExcel = () => {
    setIsImportModalOpen(true);
  };

  // Enhanced error logging and handling
  const logOperationDetails = (operation: string, data: any, context: any) => {
    console.log(`========== ${operation.toUpperCase()} OPERATION ==========`);
    console.log('Active tab:', activeTab);
    console.log('Is edit:', !!selectedItem);
    console.log('Selected item:', selectedItem);
    console.log('Form data received:', JSON.stringify(data, null, 2));
    console.log('Additional props available:', Object.keys(additionalProps));
    console.log('Context:', context);
    console.log('====================================');
  };

  const handleApiError = (error: any, operation: string) => {
    console.error(`========== ${operation.toUpperCase()} ERROR ==========`);
    console.error('Error object:', error);
    console.error('Error message:', error?.message);
    console.error('Error response:', error?.response);
    console.error('Error response data:', error?.response?.data);
    console.error('Error response status:', error?.response?.status);
    console.error('Error response headers:', error?.response?.headers);
    console.error('================================');
    
    // Extract meaningful error message
    let errorMessage = 'Une erreur inattendue s\'est produite.';
    
    if (error?.response?.data) {
      const responseData = error.response.data;
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else {
        // Try to extract field validation errors
        const fieldErrors = [];
        for (const [field, errors] of Object.entries(responseData)) {
          if (Array.isArray(errors)) {
            fieldErrors.push(`${field}: ${errors.join(', ')}`);
          } else if (typeof errors === 'string') {
            fieldErrors.push(`${field}: ${errors}`);
          }
        }
        if (fieldErrors.length > 0) {
          errorMessage = `Erreurs de validation: ${fieldErrors.join('; ')}`;
        }
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return errorMessage;
  };

  const handleFormSubmit = async (data: any) => {
    const isEdit = !!selectedItem;
    
    logOperationDetails(isEdit ? 'update' : 'create', data, {
      activeTab,
      selectedItem,
      additionalProps: Object.keys(additionalProps)
    });
    
    try {
      let result;
      
      if (activeTab === 'inscriptions') {
        if (isEdit) {
          console.log('DataManagementPage: Updating inscription with ID:', selectedItem.id);
          result = await academicService.updateInscription(selectedItem.id, data);
          toast({ 
            title: 'Inscription mise à jour', 
            description: 'L\'inscription a été modifiée avec succès.' 
          });
        } else {
          console.log('DataManagementPage: Creating new inscription');
          result = await academicService.createInscription(data);
          toast({ 
            title: 'Inscription créée', 
            description: 'L\'inscription a été créée avec succès.' 
          });
        }
        
        await queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['eleves'] });
        
      } else if (activeTab === 'eleves') {
        if (isEdit && additionalProps.updateEleveDetail) {
          console.log('DataManagementPage: Updating eleve with ID:', selectedItem.id);
          console.log('DataManagementPage: Update function available:', !!additionalProps.updateEleveDetail);
          
          // Enhanced data validation before sending
          if (!data.user) {
            throw new Error('Les données utilisateur sont manquantes');
          }
          
          // Validate required user fields
          const requiredFields = ['nom', 'prenom', 'email', 'genre', 'date_naissance', 'lieu_naissance', 'adresse', 'tel1'];
          for (const field of requiredFields) {
            if (!data.user[field]) {
              throw new Error(`Le champ ${field} est requis`);
            }
          }
          
          // Log detailed data structure before sending
          console.log('DataManagementPage: Eleve update data structure check:');
          console.log('- Has user object:', !!data.user);
          console.log('- User object keys:', data.user ? Object.keys(data.user) : 'N/A');
          console.log('- Has matricule:', !!data.matricule);
          console.log('- Full data being sent:', JSON.stringify(data, null, 2));
          
          result = await additionalProps.updateEleveDetail(selectedItem.id, data);
          console.log('DataManagementPage: Eleve update result:', result);
          
          toast({ 
            title: 'Élève mis à jour', 
            description: 'L\'élève a été modifié avec succès.' 
          });
        } else if (!isEdit && additionalProps.createEleveDetail) {
          console.log('DataManagementPage: Creating new eleve');
          
          // Enhanced data validation before sending
          if (!data.user) {
            throw new Error('Les données utilisateur sont manquantes');
          }
          
          // Validate required user fields
          const requiredFields = ['nom', 'prenom', 'email', 'genre', 'date_naissance', 'lieu_naissance', 'adresse', 'tel1'];
          for (const field of requiredFields) {
            if (!data.user[field]) {
              throw new Error(`Le champ ${field} est requis`);
            }
          }
          
          console.log('DataManagementPage: Eleve create data being sent:', JSON.stringify(data, null, 2));
          
          result = await additionalProps.createEleveDetail(data);
          console.log('DataManagementPage: Eleve create result:', result);
          
          toast({ 
            title: 'Élève créé', 
            description: 'L\'élève a été créé avec succès.' 
          });
        } else {
          throw new Error(`Fonction ${isEdit ? 'updateEleveDetail' : 'createEleveDetail'} non disponible`);
        }
      } else if (activeTab === 'tuteurs') {
        if (isEdit && additionalProps.updateTuteurDetail) {
          console.log('DataManagementPage: Updating tuteur with ID:', selectedItem.id);
          
          // Enhanced data validation before sending
          if (!data.user) {
            throw new Error('Les données utilisateur sont manquantes');
          }
          
          // Validate required user fields
          const requiredFields = ['nom', 'prenom', 'email', 'genre', 'date_naissance', 'lieu_naissance', 'adresse', 'tel1'];
          for (const field of requiredFields) {
            if (!data.user[field]) {
              throw new Error(`Le champ ${field} est requis`);
            }
          }
          
          console.log('DataManagementPage: Tuteur update data being sent:', JSON.stringify(data, null, 2));
          
          result = await additionalProps.updateTuteurDetail(selectedItem.id, data);
          console.log('DataManagementPage: Tuteur update result:', result);
          
          toast({ 
            title: 'Tuteur mis à jour', 
            description: 'Le tuteur a été modifié avec succès.' 
          });
        } else if (!isEdit && additionalProps.createTuteurDetail) {
          console.log('DataManagementPage: Creating new tuteur');
          
          // Enhanced data validation before sending
          if (!data.user) {
            throw new Error('Les données utilisateur sont manquantes');
          }
          
          // Validate required user fields
          const requiredFields = ['nom', 'prenom', 'email', 'genre', 'date_naissance', 'lieu_naissance', 'adresse', 'tel1'];
          for (const field of requiredFields) {
            if (!data.user[field]) {
              throw new Error(`Le champ ${field} est requis`);
            }
          }
          
          console.log('DataManagementPage: Tuteur create data being sent:', JSON.stringify(data, null, 2));
          
          result = await additionalProps.createTuteurDetail(data);
          console.log('DataManagementPage: Tuteur create result:', result);
          
          toast({ 
            title: 'Tuteur créé', 
            description: 'Le tuteur a été créé avec succès.' 
          });
        } else {
          throw new Error(`Fonction ${isEdit ? 'updateTuteurDetail' : 'createTuteurDetail'} non disponible`);
        }
      } else {
        // For other tabs, use the existing logic
        console.log('DataManagementPage: Handling other tab type:', activeTab);
        toast({ 
          title: `Élément ${isEdit ? 'mis à jour' : 'créé'}`, 
          description: `L'élément a été ${isEdit ? 'modifié' : 'créé'} avec succès.` 
        });
      }
      
      // Log the final result
      console.log('DataManagementPage: Final operation result:', result);
      
    } catch (error) {
      const errorMessage = handleApiError(error, isEdit ? 'update' : 'create');
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
      return; // Don't close modal on error
    }
    
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleFormCancel = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleEditFromDetails = () => {
    setIsDetailsModalOpen(false);
    handleEditClick(selectedItem!);
  };

  return (
    <div>
      <DataManagementHeader
        title={title}
        description={description}
        fromApi={fromApi}
        createLabel={currentTab?.createLabel || 'Créer'}
        onCreateClick={handleCreateClick}
        onExportExcel={handleExportExcel}
        onImportExcel={handleImportExcel}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <DataManagementTabs tabs={tabs} />
        
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id}>
            <DataManagementTabContent
              tab={tab}
              onDetailsClick={handleDetailsClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          </TabsContent>
        ))}
      </Tabs>

      <DataManagementModals
        currentTab={currentTab}
        selectedItem={selectedItem}
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        isDetailsModalOpen={isDetailsModalOpen}
        isImportModalOpen={isImportModalOpen}
        onCreateModalClose={() => setIsCreateModalOpen(false)}
        onEditModalClose={() => setIsEditModalOpen(false)}
        onDeleteModalClose={() => setIsDeleteModalOpen(false)}
        onDetailsModalClose={() => setIsDetailsModalOpen(false)}
        onImportModalClose={() => setIsImportModalOpen(false)}
        onFormSubmit={handleFormSubmit}
        onFormCancel={handleFormCancel}
        onConfirmDelete={handleConfirmDelete}
        onEditFromDetails={handleEditFromDetails}
        additionalProps={additionalProps}
      />
    </div>
  );
}

export default DataManagementPage;
