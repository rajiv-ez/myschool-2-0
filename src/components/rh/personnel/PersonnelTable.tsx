
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { PersonnelMember } from '../types';

interface PersonnelTableProps {
  personnel: PersonnelMember[];
  onViewDetails: (personne: PersonnelMember) => void;
  onEdit: (personne: PersonnelMember) => void;
  onDelete: (id: string) => void;
}

const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnel,
  onViewDetails,
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
            <TableHead>Poste</TableHead>
            <TableHead>Matières</TableHead>
            <TableHead>Tél.</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnel.map((personne) => (
            <TableRow key={personne.id}>
              <TableCell>{personne.id}</TableCell>
              <TableCell className="font-medium">
                {personne.prenom} <span className="uppercase">{personne.nom}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{personne.poste}</Badge>
              </TableCell>
              <TableCell>
                {personne.matieres.length > 0 ? (
                  <div>
                    <div>{personne.matieres.join(', ')}</div>
                    <div className="text-xs italic text-muted-foreground">
                      ({personne.niveaux.join(', ')})
                    </div>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <div>
                  <div>{personne.tel1}</div>
                  {personne.tel2 && <div>{personne.tel2}</div>}
                  {personne.whatsapp && (
                    <div className="text-xs">
                      <a 
                        href={`https://wa.me/${personne.whatsapp.replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        WhatsApp: {personne.whatsapp}
                      </a>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{personne.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  personne.statut === 'Actif' 
                    ? 'bg-green-100 text-green-800' 
                    : personne.statut === 'En congé'
                    ? 'bg-yellow-100 text-yellow-800'
                    : personne.statut === 'Suspendu'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {personne.statut}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onViewDetails(personne)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEdit(personne)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDelete(personne.id)}
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

export default PersonnelTable;
