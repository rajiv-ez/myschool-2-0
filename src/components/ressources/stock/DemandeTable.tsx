
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from 'lucide-react';
import { Demande } from './StockTypes';
import { format } from "date-fns";

interface DemandeTableProps {
  demandes: Demande[];
  onApprove: (id: string) => void;
  onOpenRejectModal: (demande: Demande) => void;
}

const DemandeTable: React.FC<DemandeTableProps> = ({
  demandes,
  onApprove,
  onOpenRejectModal
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Demandeur</TableHead>
            <TableHead>Article</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Motif</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demandes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucune demande trouvée
              </TableCell>
            </TableRow>
          ) : (
            demandes.map(demande => (
              <TableRow key={demande.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={demande.demandeur.avatar} />
                      <AvatarFallback>
                        {demande.demandeur.prenom.charAt(0)}{demande.demandeur.nom.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{demande.demandeur.prenom} {demande.demandeur.nom}</div>
                      <div className="text-sm text-gray-500">{demande.demandeur.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{demande.article.nom}</TableCell>
                <TableCell>{demande.quantite}</TableCell>
                <TableCell>{demande.motif}</TableCell>
                <TableCell>{format(demande.date, "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <Badge variant={
                    demande.statut === 'Approuvée' ? "default" : 
                    demande.statut === 'Refusée' ? "destructive" : 
                    "outline"
                  }>
                    {demande.statut}
                  </Badge>
                  {demande.statut === 'Refusée' && demande.motifRefus && (
                    <div className="text-xs text-red-600 mt-1">
                      Motif: {demande.motifRefus}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {demande.statut === 'En attente' && (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                        onClick={() => onApprove(demande.id)}
                      >
                        <Check size={14} className="mr-1" />
                        Approuver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => onOpenRejectModal(demande)}
                      >
                        <X size={14} className="mr-1" />
                        Refuser
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemandeTable;
