
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
  itemName: string;
  itemDetails?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName,
  itemDetails
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet élément ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p>
            Vous êtes sur le point de supprimer {itemType === 'session' && `la session "${itemName}"`}
            {itemType === 'palier' && `le palier "${itemName}" ${itemDetails ? `de la session "${itemDetails}"` : ''}`}
            {itemType === 'classe' && `la classe ${itemName} ${itemDetails ? `de la session "${itemDetails}"` : ''}`}.
          </p>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button 
            variant="destructive"
            onClick={onConfirm}
          >
            Supprimer définitivement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;
