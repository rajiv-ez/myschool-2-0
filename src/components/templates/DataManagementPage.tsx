
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

  const handleFormSubmit = async (data: any) => {
    const isEdit = !!selectedItem;
    
    try {
      console.log('Form data received:', data);
      console.log('Selected item:', selectedItem);
      console.log('Active tab:', activeTab);
      
      let result;
      
      if (activeTab === 'inscriptions') {
        if (isEdit) {
          console.log('Updating inscription with data:', data);
          result = await academicService.updateInscription(selectedItem.id, data);
          toast({ 
            title: 'Inscription mise à jour', 
            description: 'L\'inscription a été modifiée avec succès.' 
          });
        } else {
          console.log('Creating new inscription with data:', data);
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
          console.log('Updating eleve with data:', data);
          result = await additionalProps.updateEleveDetail(selectedItem.id, data);
          toast({ 
            title: 'Élève mis à jour', 
            description: 'L\'élève a été modifié avec succès.' 
          });
        } else if (!isEdit && additionalProps.createEleveDetail) {
          console.log('Creating new eleve with data:', data);
          result = await additionalProps.createEleveDetail(data);
          toast({ 
            title: 'Élève créé', 
            description: 'L\'élève a été créé avec succès.' 
          });
        }
      } else if (activeTab === 'tuteurs') {
        if (isEdit && additionalProps.updateTuteurDetail) {
          console.log('Updating tuteur with data:', data);
          result = await additionalProps.updateTuteurDetail(selectedItem.id, data);
          toast({ 
            title: 'Tuteur mis à jour', 
            description: 'Le tuteur a été modifié avec succès.' 
          });
        } else if (!isEdit && additionalProps.createTuteurDetail) {
          console.log('Creating new tuteur with data:', data);
          result = await additionalProps.createTuteurDetail(data);
          toast({ 
            title: 'Tuteur créé', 
            description: 'Le tuteur a été créé avec succès.' 
          });
        }
      } else {
        // For other tabs, use the existing logic
        toast({ 
          title: `Élément ${isEdit ? 'mis à jour' : 'créé'}`, 
          description: `L'élément a été ${isEdit ? 'modifié' : 'créé'} avec succès.` 
        });
      }
      
      // Log the result for debugging
      console.log('Operation result:', result);
      
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de ${isEdit ? 'la modification' : 'la création'}.`,
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
