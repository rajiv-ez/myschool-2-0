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
  importType: 'succursales' | 'batiments' | 'salles' | 'inscriptions';
  onImport: (data: any[]) => Promise<void>;
}

export interface DataManagementPageProps<T extends { id: number }> {
  title: string;
  description: string;
  tabs: TabConfig<T>[];
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
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleCreateClick = () => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (item: T) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDetailsClick = (item: T) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (item: T) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItem && activeTab === 'inscriptions') {
      try {
        await academicService.deleteInscription(selectedItem.id);
        
        // Refresh the data
        await queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['eleves'] });
        
        toast({
          title: 'Inscription supprimée',
          description: 'L\'inscription a été supprimée avec succès.',
        });
      } catch (error) {
        console.error('Error deleting inscription:', error);
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la suppression de l\'inscription.',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: 'Élément supprimé',
        description: 'L\'élément a été supprimé avec succès.',
      });
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
    
    if (activeTab === 'inscriptions') {
      try {
        if (isEdit) {
          console.log('Updating inscription with data:', data);
          await academicService.updateInscription(selectedItem.id, data);
          toast({ 
            title: 'Inscription mise à jour', 
            description: 'L\'inscription a été modifiée avec succès.' 
          });
        } else {
          console.log('Creating new inscription with data:', data);
          await academicService.createInscription(data);
          toast({ 
            title: 'Inscription créée', 
            description: 'L\'inscription a été créée avec succès.' 
          });
        }
        
        // Refresh the data
        await queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['eleves'] });
        
      } catch (error) {
        console.error('Error saving inscription:', error);
        toast({
          title: 'Erreur',
          description: `Erreur lors de ${isEdit ? 'la modification' : 'la création'} de l'inscription.`,
          variant: 'destructive'
        });
        return; // Don't close modal on error
      }
    } else {
      // For other tabs, use the existing logic
      toast({ 
        title: `Élément ${isEdit ? 'mis à jour' : 'créé'}`, 
        description: `L'élément a été ${isEdit ? 'modifié' : 'créé'} avec succès.` 
      });
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
