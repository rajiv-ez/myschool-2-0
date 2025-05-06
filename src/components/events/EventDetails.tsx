
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarDays,
  Clock,
  MapPin,
  Repeat,
  FileText,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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

interface EventDetailsProps {
  event: Event;
  onEdit: () => void;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onEdit, onClose }) => {
  // Format des dates
  const formatDate = (date: Date) => {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };
  
  // Format de l'heure
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };
  
  // Libellé du type d'événement
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'meeting': return 'Réunion';
      case 'class': return 'Cours';
      case 'exam': return 'Examen';
      case 'holiday': return 'Congé';
      case 'other': return 'Autre';
      default: return type;
    }
  };
  
  // Couleur de badge selon le type
  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'class': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-amber-100 text-amber-800';
      case 'holiday': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Libellé du modèle de récurrence
  const getRecurrenceLabel = (pattern?: string) => {
    if (!pattern) return '';
    
    switch(pattern) {
      case 'daily': return 'Quotidienne';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuelle';
      default: return pattern;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{event.title}</h2>
        <div className="flex items-center mt-2">
          <Badge className={getTypeBadgeColor(event.type)}>
            {getTypeLabel(event.type)}
          </Badge>
          
          {event.recurring && (
            <Badge variant="outline" className="ml-2 flex items-center gap-1">
              <Repeat size={12} />
              <span>{getRecurrenceLabel(event.recurrencePattern)}</span>
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">{formatDate(event.start)}</p>
            {event.allDay ? (
              <p className="text-sm text-muted-foreground">Toute la journée</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {event.start.toDateString() === event.end.toDateString() 
                  ? `${formatTime(event.start)} à ${formatTime(event.end)}` 
                  : `${formatTime(event.start)} à ${formatDate(event.end)} ${formatTime(event.end)}`}
              </p>
            )}
          </div>
        </div>
        
        {event.location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <p>{event.location}</p>
          </div>
        )}
        
        {event.palier && (
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
            <p>Palier: {event.palier}</p>
          </div>
        )}
        
        {event.description && (
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Description</p>
              <p className="text-sm whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Fermer</Button>
        <Button onClick={onEdit}>Modifier</Button>
      </DialogFooter>
    </div>
  );
};

export default EventDetails;
