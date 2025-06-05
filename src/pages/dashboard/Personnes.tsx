
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Link } from 'react-router-dom';

// Données fictives pour démonstration
const elevesData = [
  { 
    id: 1, 
    nom: 'Ndong', 
    prenom: 'Marie', 
    dateNaissance: '12/05/2014', 
    classe: 'CM1',
    tuteurs: 2
  },
  { 
    id: 2, 
    nom: 'Obiang', 
    prenom: 'Paul', 
    dateNaissance: '03/09/2016', 
    classe: 'CE2',
    tuteurs: 1
  },
  { 
    id: 3, 
    nom: 'Mba', 
    prenom: 'Sophie', 
    dateNaissance: '22/11/2013', 
    classe: 'CM2',
    tuteurs: 2
  },
  { 
    id: 4, 
    nom: 'Ondo', 
    prenom: 'Jean', 
    dateNaissance: '14/07/2012', 
    classe: '6ème',
    tuteurs: 1
  }
];

const tuteursData = [
  { 
    id: 1, 
    nom: 'Ndong', 
    prenom: 'Pierre', 
    telephone: '+241 74 12 36 45', 
    email: 'pierre.ndong@example.com',
    eleves: 1
  },
  { 
    id: 2, 
    nom: 'Mba', 
    prenom: 'Jeanne', 
    telephone: '+241 66 89 74 12', 
    email: 'jeanne.mba@example.com',
    eleves: 2
  },
  { 
    id: 3, 
    nom: 'Obiang', 
    prenom: 'Thomas', 
    telephone: '+241 77 45 23 69', 
    email: 'thomas.obiang@example.com',
    eleves: 1
  }
];

const Personnes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('eleves');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Élèves & Tuteurs</h2>
        <p className="text-muted-foreground">Gérez les informations des élèves et de leurs tuteurs</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="eleves">Élèves</TabsTrigger>
          <TabsTrigger value="tuteurs">Tuteurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="eleves">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Tuteurs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elevesData.map((eleve) => (
                  <TableRow key={eleve.id}>
                    <TableCell>{eleve.id}</TableCell>
                    <TableCell className="font-medium">{eleve.nom}</TableCell>
                    <TableCell>{eleve.prenom}</TableCell>
                    <TableCell>{eleve.dateNaissance}</TableCell>
                    <TableCell>{eleve.classe}</TableCell>
                    <TableCell>{eleve.tuteurs}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Voir détails</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="tuteurs">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Élèves</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tuteursData.map((tuteur) => (
                  <TableRow key={tuteur.id}>
                    <TableCell>{tuteur.id}</TableCell>
                    <TableCell className="font-medium">{tuteur.nom}</TableCell>
                    <TableCell>{tuteur.prenom}</TableCell>
                    <TableCell>{tuteur.telephone}</TableCell>
                    <TableCell>{tuteur.email}</TableCell>
                    <TableCell>{tuteur.eleves}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Voir détails</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Personnes;
