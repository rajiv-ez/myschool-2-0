
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Absence } from '../types';
import { Edit } from 'lucide-react';

interface AbsenceDetailsProps {
  absence: Absence;
  onEdit: () => void;
  onClose: () => void;
}

const AbsenceDetails: React.FC<AbsenceDetailsProps> = ({ 
  absence, 
  onEdit, 
  onClose 
}) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + (diffDays > 1 ? ' jours' : ' jour');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{absence.nom_complet}</h3>
          <p className="text-sm text-muted-foreground">ID: {absence.id}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          absence.statut === 'Validée' 
            ? 'bg-green-100 text-green-800' 
            : absence.statut === 'En attente'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {absence.statut}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Date de début</p>
          <p>{formatDate(absence.date_debut)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Date de fin</p>
          <p>{formatDate(absence.date_fin)}</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Durée</p>
        <p>{calculateDuration(absence.date_debut, absence.date_fin)}</p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Motif</p>
        <p className="whitespace-pre-wrap">{absence.motif}</p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Justificatif</p>
        {absence.justificatif ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Fourni
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Non fourni
          </Badge>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
        <Button 
          onClick={onEdit} 
          variant="default" 
          className="flex items-center gap-2"
        >
          <Edit size={16} />
          Modifier
        </Button>
      </div>
    </div>
  );
};

export default AbsenceDetails;
