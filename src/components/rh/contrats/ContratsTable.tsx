
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Contrat } from '../types';

interface ContratsTableProps {
  contrats: Contrat[];
  onView: (contrat: Contrat) => void;
  onEdit: (contrat: Contrat) => void;
  onDelete: (id: string) => void;
}

const ContratsTable: React.FC<ContratsTableProps> = ({
  contrats,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom complet</TableHead>
            <TableHead>Type de contrat</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Date de fin</TableHead>
            <TableHead>Salaire</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contrats.map((contrat) => (
            <TableRow key={contrat.id}>
              <TableCell>{contrat.id}</TableCell>
              <TableCell className="font-medium">{contrat.nom_complet}</TableCell>
              <TableCell>{contrat.type_contrat}</TableCell>
              <TableCell>{contrat.date_debut}</TableCell>
              <TableCell>{contrat.date_fin || 'Indéterminé'}</TableCell>
              <TableCell>{contrat.salaire}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contrat.statut === 'Actif' 
                    ? 'bg-green-100 text-green-800' 
                    : contrat.statut === 'Terminé'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {contrat.statut}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onView(contrat)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEdit(contrat)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDelete(contrat.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContratsTable;
