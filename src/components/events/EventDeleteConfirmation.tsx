
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

// Event type
interface Event {
  id: number;
  title: string;
  type: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  palier?: string;
  allDay: boolean;
  recurring?: boolean;
  recurrencePattern?: string;
}

interface EventDeleteConfirmationProps {
  event: Event;
  onConfirm: () => void;
}

const EventDeleteConfirmation: React.FC<EventDeleteConfirmationProps> = ({
  event,
  onConfirm
}) => {
  // Format de la date pour l'affichage
  const formatDate = (date: Date) => {
    return format(date, 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <div>
      <div className="py-4">
        <p>
          Vous êtes sur le point de supprimer l'événement{' '}
          <span className="font-semibold">"{event.title}"</span>{' '}
          du {formatDate(event.start)}.
        </p>
        {event.recurring && (
          <p className="mt-2 text-amber-600">
            Attention: Cet événement est récurrent. Sa suppression entraînera celle de toutes ses occurrences futures.
          </p>
        )}
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
    </div>
  );
};

export default EventDeleteConfirmation;
