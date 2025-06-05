
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Layers, Grid, School, Plus } from 'lucide-react';

// Données fictives pour la démonstration
const niveauxData = [
  { id: 1, nom: 'Maternelle', description: 'De 3 à 5 ans', ordre: 1 },
  { id: 2, nom: 'Primaire', description: 'De 6 à 11 ans', ordre: 2 },
  { id: 3, nom: 'Collège', description: 'De 12 à 15 ans', ordre: 3 },
  { id: 4, nom: 'Lycée', description: 'De 16 à 18 ans', ordre: 4 },
];

const specialitesData = [
  { id: 1, nom: 'Scientifique', niveau: 'Lycée', description: 'Option sciences', code: 'S' },
  { id: 2, nom: 'Littéraire', niveau: 'Lycée', description: 'Option lettres et philosophie', code: 'L' },
  { id: 3, nom: 'Économique', niveau: 'Lycée', description: 'Option économie et gestion', code: 'ES' },
  { id: 4, nom: 'Générale', niveau: 'Primaire', description: 'Programme général', code: 'G' },
];

const classesData = [
  { id: 1, nom: 'CP', niveau: 'Primaire', specialite: 'Générale', description: 'Cours Préparatoire', effectif: 30 },
  { id: 2, nom: 'CE1', niveau: 'Primaire', specialite: 'Générale', description: 'Cours Élémentaire 1', effectif: 28 },
  { id: 3, nom: 'CM1', niveau: 'Primaire', specialite: 'Générale', description: 'Cours Moyen 1', effectif: 25 },
  { id: 4, nom: 'Terminale S', niveau: 'Lycée', specialite: 'Scientifique', description: 'Terminale Scientifique', effectif: 32 },
];

const Academics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('niveaux');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Structure Académique</h2>
          <p className="text-muted-foreground">Gérez les niveaux, spécialités et classes de votre établissement</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          {activeTab === 'niveaux' && 'Nouveau Niveau'}
          {activeTab === 'specialites' && 'Nouvelle Spécialité'}
          {activeTab === 'classes' && 'Nouvelle Classe'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="niveaux" className="flex items-center gap-2">
            <Layers size={16} />
            <span className="hidden sm:inline">Niveaux</span>
            <span className="sm:hidden">Niv.</span>
          </TabsTrigger>
          <TabsTrigger value="specialites" className="flex items-center gap-2">
            <Grid size={16} />
            <span className="hidden sm:inline">Spécialités</span>
            <span className="sm:hidden">Spé.</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <School size={16} />
            <span className="hidden sm:inline">Classes</span>
            <span className="sm:hidden">Classes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="niveaux">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers size={18} />
                Niveaux d'Enseignement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Ordre</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {niveauxData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.description}</TableCell>
                        <TableCell>{item.ordre}</TableCell>
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
        
        <TabsContent value="specialites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid size={18} />
                Spécialités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden md:table-cell">Code</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialitesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.niveau}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.description}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.code}</TableCell>
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
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School size={18} />
                Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead className="hidden md:table-cell">Spécialité</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden md:table-cell">Effectif</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.niveau}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.specialite}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.description}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.effectif}</TableCell>
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

export default Academics;
