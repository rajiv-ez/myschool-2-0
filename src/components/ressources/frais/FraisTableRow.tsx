
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';

interface FraisScolaire {
  id: string;
  nom: string;
  description: string;
  sessionId: string;
  palierId?: string;
  quantite?: number;
  montant: number;
}

interface FraisTableRowProps {
  frais: FraisScolaire;
  getSessionName: (id: string) => string;
  getPalierName: (sessionId: string, palierId?: string) => string;
  onEdit: (frais: FraisScolaire) => void;
  onDelete: (id: string) => void;
}

const FraisTableRow: React.FC<FraisTableRowProps> = ({
  frais,
  getSessionName,
  getPalierName,
  onEdit,
  onDelete
}) => {
  return (
    <TableRow key={frais.id}>
      <TableCell className="font-medium">{frais.nom}</TableCell>
      <TableCell>{frais.description}</TableCell>
      <TableCell>{getSessionName(frais.sessionId)}</TableCell>
      <TableCell>{getPalierName(frais.sessionId, frais.palierId)}</TableCell>
      <TableCell>{frais.quantite !== undefined ? frais.quantite : '-'}</TableCell>
      <TableCell className="text-right">{frais.montant.toLocaleString()} FCFA</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(frais)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(frais.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FraisTableRow;
