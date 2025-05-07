
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FraisTableRow from './FraisTableRow';

interface FraisScolaire {
  id: string;
  nom: string;
  description: string;
  sessionId: string;
  palierId?: string;
  quantite?: number;
  montant: number;
}

interface FraisTableProps {
  fraisList: FraisScolaire[];
  getSessionName: (id: string) => string;
  getPalierName: (sessionId: string, palierId?: string) => string;
  onEdit: (frais: FraisScolaire) => void;
  onDelete: (id: string) => void;
}

const FraisTable: React.FC<FraisTableProps> = ({
  fraisList,
  getSessionName,
  getPalierName,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Trimestre</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fraisList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucun frais trouvé
              </TableCell>
            </TableRow>
          ) : (
            fraisList.map(frais => (
              <FraisTableRow 
                key={frais.id}
                frais={frais}
                getSessionName={getSessionName}
                getPalierName={getPalierName}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FraisTable;
