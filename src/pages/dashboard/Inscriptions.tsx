
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
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

// Données fictives pour démonstration
const inscriptionsData = [
  { 
    id: 1, 
    nom: 'Ndong', 
    prenom: 'Marie', 
    classe: 'CM1', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '12/08/2024' 
  },
  { 
    id: 2, 
    nom: 'Obiang', 
    prenom: 'Paul', 
    classe: 'CE2', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '15/08/2024' 
  },
  { 
    id: 3, 
    nom: 'Mba', 
    prenom: 'Sophie', 
    classe: 'CM2', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '10/08/2024' 
  },
  { 
    id: 4, 
    nom: 'Ondo', 
    prenom: 'Jean', 
    classe: '6ème', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '18/08/2024' 
  },
  { 
    id: 5, 
    nom: 'Mintsa', 
    prenom: 'Lucie', 
    classe: '5ème', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '05/08/2024' 
  }
];

const Inscriptions: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inscriptions et réinscriptions</h2>
          <p className="text-muted-foreground">Gérez les inscriptions des élèves pour l'année scolaire</p>
        </div>
        <Button className="flex items-center gap-2" asChild>
          <Link to="/dashboard/inscriptions/nouvelle">
            <UserPlus size={18} />
            Nouvelle inscription
          </Link>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inscriptionsData.map((inscription) => (
              <TableRow key={inscription.id}>
                <TableCell>{inscription.id}</TableCell>
                <TableCell className="font-medium">{inscription.nom}</TableCell>
                <TableCell>{inscription.prenom}</TableCell>
                <TableCell>{inscription.classe}</TableCell>
                <TableCell>{inscription.session}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    inscription.statut === 'Nouvelle' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {inscription.statut}
                  </span>
                </TableCell>
                <TableCell>{inscription.date}</TableCell>
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

export default Inscriptions;
