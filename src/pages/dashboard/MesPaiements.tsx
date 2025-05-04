
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableCaption
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, FileText, FileCheck, AlertTriangle } from 'lucide-react';

// Données fictives pour démonstration
const paiementsData = [
  { 
    id: 1, 
    eleve: 'Marie Ndong',
    classe: 'CM1',
    montant: '150 000 FCFA',
    type: 'Frais de scolarité',
    date: '05/09/2024',
    echeance: '01/09/2024',
    statut: 'Payé'
  },
  { 
    id: 2, 
    eleve: 'Marie Ndong',
    classe: 'CM1',
    montant: '50 000 FCFA',
    type: 'Fournitures scolaires',
    date: '05/09/2024',
    echeance: '15/09/2024',
    statut: 'Payé'
  },
  { 
    id: 3, 
    eleve: 'Paul Obiang',
    classe: 'CE2',
    montant: '75 000 FCFA',
    type: 'Frais de scolarité (Acompte)',
    date: '10/09/2024',
    echeance: '01/09/2024',
    statut: 'Partiellement payé'
  },
  { 
    id: 4, 
    eleve: 'Paul Obiang',
    classe: 'CE2',
    montant: '75 000 FCFA',
    type: 'Frais de scolarité (Solde)',
    date: '-',
    echeance: '01/12/2024',
    statut: 'À payer'
  }
];

const MesPaiements: React.FC = () => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'À payer':
        return 'bg-orange-100 text-orange-800';
      case 'Partiellement payé':
        return 'bg-blue-100 text-blue-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Mes Paiements</h2>
        <p className="text-muted-foreground">Suivi des paiements pour vos enfants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total payé</CardTitle>
            <CreditCard size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">275 000 FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reste à payer</CardTitle>
            <FileText size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">75 000 FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Échéances respectées</CardTitle>
            <FileCheck size={16} className="text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">100%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prochaine échéance</CardTitle>
            <AlertTriangle size={16} className="text-amber-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">01/12/2024</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>Liste des paiements pour l'année scolaire 2024-2025</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Élève</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date de paiement</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paiementsData.map((paiement) => (
              <TableRow key={paiement.id}>
                <TableCell>{paiement.id}</TableCell>
                <TableCell className="font-medium">{paiement.eleve}</TableCell>
                <TableCell>{paiement.classe}</TableCell>
                <TableCell>{paiement.type}</TableCell>
                <TableCell>{paiement.montant}</TableCell>
                <TableCell>{paiement.date}</TableCell>
                <TableCell>{paiement.echeance}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(paiement.statut)}`}>
                    {paiement.statut}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {paiement.statut === 'À payer' ? (
                    <Button variant="default" size="sm">Payer</Button>
                  ) : (
                    <Button variant="outline" size="sm">Reçu</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MesPaiements;
