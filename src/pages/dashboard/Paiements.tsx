
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { CreditCard } from 'lucide-react';

// Données fictives pour démonstration
const paiementsData = [
  { 
    id: 1, 
    eleve: 'Marie Ndong',
    classe: 'CM1',
    montant: '150 000 FCFA',
    type: 'Frais de scolarité',
    date: '05/09/2024',
    statut: 'Payé'
  },
  { 
    id: 2, 
    eleve: 'Paul Obiang',
    classe: 'CE2',
    montant: '75 000 FCFA',
    type: 'Frais de scolarité (Acompte)',
    date: '10/09/2024',
    statut: 'Partiellement payé'
  },
  { 
    id: 3, 
    eleve: 'Sophie Mba',
    classe: 'CM2',
    montant: '25 000 FCFA',
    type: 'Fournitures scolaires',
    date: '15/09/2024',
    statut: 'Payé'
  },
  { 
    id: 4, 
    eleve: 'Jean Ondo',
    classe: '6ème',
    montant: '200 000 FCFA',
    type: 'Frais de scolarité',
    date: '01/09/2024',
    statut: 'Payé'
  },
  { 
    id: 5, 
    eleve: 'Lucie Mintsa',
    classe: '5ème',
    montant: '150 000 FCFA',
    type: 'Frais de scolarité',
    date: '08/09/2024',
    statut: 'En attente'
  }
];

const Paiements: React.FC = () => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-orange-100 text-orange-800';
      case 'Partiellement payé':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Paiements</h2>
          <p className="text-muted-foreground">Gestion des paiements et de la comptabilité</p>
        </div>
        <Button className="flex items-center gap-2">
          <CreditCard size={18} />
          Enregistrer un paiement
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <h3 className="text-green-800 text-sm font-medium mb-1">Total perçu</h3>
          <p className="text-2xl font-bold text-green-700">3 750 000 FCFA</p>
          <p className="text-xs text-green-600 mt-1">+12% par rapport au mois précédent</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-blue-800 text-sm font-medium mb-1">Paiements en attente</h3>
          <p className="text-2xl font-bold text-blue-700">850 000 FCFA</p>
          <p className="text-xs text-blue-600 mt-1">5 paiements en attente</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <h3 className="text-purple-800 text-sm font-medium mb-1">Total des frais</h3>
          <p className="text-2xl font-bold text-purple-700">4 600 000 FCFA</p>
          <p className="text-xs text-purple-600 mt-1">Pour 125 élèves inscrits</p>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Élève</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
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
                <TableCell>{paiement.montant}</TableCell>
                <TableCell>{paiement.type}</TableCell>
                <TableCell>{paiement.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(paiement.statut)}`}>
                    {paiement.statut}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Détails</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Paiements;
