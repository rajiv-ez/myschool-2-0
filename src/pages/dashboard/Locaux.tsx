
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building, Home, DoorClosed, Plus } from 'lucide-react';

// Données fictives pour la démonstration
const succursalesData = [
  { id: 1, nom: 'Campus Principal', adresse: '123 Avenue de l\'Éducation', ville: 'Libreville', telephone: '+241 77 123 456' },
  { id: 2, nom: 'Campus Nord', adresse: '45 Rue des Sciences', ville: 'Libreville', telephone: '+241 77 456 789' },
];

const batimentsData = [
  { id: 1, nom: 'Bâtiment A', succursale: 'Campus Principal', etages: 3, anneeConstruction: 2010 },
  { id: 2, nom: 'Bâtiment B', succursale: 'Campus Principal', etages: 2, anneeConstruction: 2015 },
  { id: 3, nom: 'Bâtiment Principal', succursale: 'Campus Nord', etages: 4, anneeConstruction: 2018 },
];

const sallesData = [
  { id: 1, nom: 'Salle 101', batiment: 'Bâtiment A', etage: 1, capacite: 35, type: 'Classe' },
  { id: 2, nom: 'Salle 102', batiment: 'Bâtiment A', etage: 1, capacite: 30, type: 'Classe' },
  { id: 3, nom: 'Laboratoire 201', batiment: 'Bâtiment B', etage: 2, capacite: 25, type: 'Laboratoire' },
  { id: 4, nom: 'Amphithéâtre', batiment: 'Bâtiment Principal', etage: 1, capacite: 150, type: 'Amphithéâtre' },
];

const Locaux: React.FC = () => {
  const [activeTab, setActiveTab] = useState('succursales');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des Locaux</h2>
          <p className="text-muted-foreground">Gérez les succursales, bâtiments et salles de votre établissement</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          {activeTab === 'succursales' && 'Nouvelle Succursale'}
          {activeTab === 'batiments' && 'Nouveau Bâtiment'}
          {activeTab === 'salles' && 'Nouvelle Salle'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="succursales" className="flex items-center gap-2">
            <Building size={16} />
            <span className="hidden sm:inline">Succursales</span>
            <span className="sm:hidden">Succ.</span>
          </TabsTrigger>
          <TabsTrigger value="batiments" className="flex items-center gap-2">
            <Home size={16} />
            <span className="hidden sm:inline">Bâtiments</span>
            <span className="sm:hidden">Bât.</span>
          </TabsTrigger>
          <TabsTrigger value="salles" className="flex items-center gap-2">
            <DoorClosed size={16} />
            <span className="hidden sm:inline">Salles</span>
            <span className="sm:hidden">Salles</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="succursales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={18} />
                Succursales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead className="hidden md:table-cell">Adresse</TableHead>
                      <TableHead className="hidden md:table-cell">Ville</TableHead>
                      <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {succursalesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.adresse}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.ville}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.telephone}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Détails</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="batiments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home size={18} />
                Bâtiments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Succursale</TableHead>
                      <TableHead className="hidden md:table-cell">Étages</TableHead>
                      <TableHead className="hidden md:table-cell">Année</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batimentsData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.succursale}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.etages}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.anneeConstruction}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Détails</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DoorClosed size={18} />
                Salles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Bâtiment</TableHead>
                      <TableHead className="hidden md:table-cell">Étage</TableHead>
                      <TableHead className="hidden md:table-cell">Capacité</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sallesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.batiment}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.etage}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.capacite}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.type}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Détails</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Locaux;
