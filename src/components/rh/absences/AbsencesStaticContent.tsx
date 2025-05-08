
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, FilePlus, Users, ListFilter } from 'lucide-react';

const absencesData = [
  {
    id: "1",
    nom_complet: "Jean Assoumou",
    date_debut: "10/04/2023",
    date_fin: "12/04/2023",
    motif: "Maladie",
    justificatif: true,
    statut: "Validée"
  },
  {
    id: "2",
    nom_complet: "Marie Ndong",
    date_debut: "05/05/2023",
    date_fin: "07/05/2023",
    motif: "Raison familiale",
    justificatif: true,
    statut: "Validée"
  },
  {
    id: "3",
    nom_complet: "Pierre Ondo",
    date_debut: "15/06/2023",
    date_fin: "16/06/2023",
    motif: "Formation professionnelle",
    justificatif: false,
    statut: "En attente"
  }
];

const AbsencesStaticContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Gestion des absences</h3>
          <p className="text-muted-foreground">Suivi des absences et congés du personnel</p>
        </div>
        <Button className="flex items-center gap-2">
          <FilePlus size={16} />
          <span>Nouvelle absence</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar size={18} />
              Absences ce mois
            </CardTitle>
            <CardDescription>Total des absences du mois en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">7</p>
            <p className="text-sm text-muted-foreground">+2 par rapport au mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users size={18} />
              Personnel absent
            </CardTitle>
            <CardDescription>Nombre actuel d'absents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">Sur 42 employés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListFilter size={18} />
              En attente
            </CardTitle>
            <CardDescription>Demandes à traiter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">À valider ou refuser</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={18} />
            Historique des absences
          </CardTitle>
          <CardDescription>
            Dernières absences enregistrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Justificatif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absencesData.map((absence) => (
                <TableRow key={absence.id}>
                  <TableCell>{absence.id}</TableCell>
                  <TableCell className="font-medium">{absence.nom_complet}</TableCell>
                  <TableCell>{absence.date_debut}</TableCell>
                  <TableCell>{absence.date_fin}</TableCell>
                  <TableCell>{absence.motif}</TableCell>
                  <TableCell>
                    {absence.justificatif ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Fourni
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Non fourni
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      absence.statut === 'Validée' 
                        ? 'bg-green-100 text-green-800' 
                        : absence.statut === 'En attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {absence.statut}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AbsencesStaticContent;
