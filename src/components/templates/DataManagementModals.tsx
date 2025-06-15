
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TabConfig } from './DataManagementPage';
import ExcelImportDialog from '@/components/excel/ExcelImportDialog';

interface DataManagementModalsProps<T extends { id: number }> {
  currentTab: TabConfig<T> | undefined;
  selectedItem: T | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isImportModalOpen: boolean;
  onCreateModalClose: () => void;
  onEditModalClose: () => void;
  onDeleteModalClose: () => void;
  onDetailsModalClose: () => void;
  onImportModalClose: () => void;
  onFormSubmit: (data: any) => void;
  onFormCancel: () => void;
  onConfirmDelete: () => void;
  onEditFromDetails: () => void;
  additionalProps: Record<string, any>;
}

function DataManagementModals<T extends { id: number }>({
  currentTab,
  selectedItem,
  isCreateModalOpen,
  isEditModalOpen,
  isDeleteModalOpen,
  isDetailsModalOpen,
  isImportModalOpen,
  onCreateModalClose,
  onEditModalClose,
  onDeleteModalClose,
  onDetailsModalClose,
  onImportModalClose,
  onFormSubmit,
  onFormCancel,
  onConfirmDelete,
  onEditFromDetails,
  additionalProps
}: DataManagementModalsProps<T>) {
  return (
    <>
      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={() => {
        onCreateModalClose();
        onEditModalClose();
      }}>
        <DialogContent className="md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Modifier' : 'Créer'} {currentTab?.label.slice(0, -1)}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous
            </DialogDescription>
          </DialogHeader>
          {currentTab && (
            <currentTab.form
              isEditing={!!selectedItem}
              selectedItem={selectedItem}
              onSubmit={onFormSubmit}
              onCancel={onFormCancel}
              {...additionalProps}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={onDetailsModalClose}>
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p>{selectedItem.id}</p>
              </div>
              {currentTab?.columns.map(column => (
                <div key={column.key} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{column.label}</p>
                  <p>{column.render ? column.render(selectedItem) : (selectedItem as any)[column.key]}</p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onDetailsModalClose}>Fermer</Button>
            <Button onClick={onEditFromDetails}>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={onDeleteModalClose}>
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer l'élément</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      {currentTab && (
        <ExcelImportDialog
          open={isImportModalOpen}
          onOpenChange={onImportModalClose}
          type={currentTab.importType}
          onImport={currentTab.onImport}
          {...additionalProps}
        />
      )}
    </>
  );
}

export default DataManagementModals;
