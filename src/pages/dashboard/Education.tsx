
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BookOpen, Book, FileText, Plus } from 'lucide-react';

// Données fictives pour la démonstration
const unitesData = [
  { id: 1, nom: 'Mathématiques', groupe: 'Scientifique', coefficient: 7, responsable: 'Dr. Mbeng', classes: ['Terminale S', '1ère S'] },
  { id: 2, nom: 'Physique-Chimie', groupe: 'Scientifique', coefficient: 6, responsable: 'Dr. Nguema', classes: ['Terminale S', '1ère S'] },
  { id: 3, nom: 'Français', groupe: 'Littéraire', coefficient: 5, responsable: 'Mme. Obame', classes: ['Terminale L', '1ère L', 'Terminale S'] },
  { id: 4, nom: 'Histoire-Géographie', groupe: 'Littéraire', coefficient: 4, responsable: 'M. Ndong', classes: ['Terminale S', 'Terminale L'] },
];

const matieresData = [
  { id: 1, nom: 'Algèbre', unite: 'Mathématiques', coefficient: 4, heuresHebdo: 5, enseignant: 'M. Ondo' },
  { id: 2, nom: 'Géométrie', unite: 'Mathématiques', coefficient: 3, heuresHebdo: 3, enseignant: 'Mme. Assoumou' },
  { id: 3, nom: 'Mécanique', unite: 'Physique-Chimie', coefficient: 3, heuresHebdo: 4, enseignant: 'Dr. Nguema' },
  { id: 4, nom: 'Littérature', unite: 'Français', coefficient: 4, heuresHebdo: 4, enseignant: 'Mme. Obame' },
];

const chapitresData = [
  { id: 1, titre: 'Fonctions dérivées', matiere: 'Algèbre', description: 'Étude des dérivées de fonctions', duree: '3 semaines' },
  { id: 2, titre: 'Intégration', matiere: 'Algèbre', description: 'Calcul intégral et applications', duree: '4 semaines' },
  { id: 3, titre: 'Triangles semblables', matiere: 'Géométrie', description: 'Étude des similitudes', duree: '2 semaines' },
  { id: 4, titre: 'Forces et mouvements', matiere: 'Mécanique', description: 'Lois fondamentales de la dynamique', duree: '3 semaines' },
];

const Education: React.FC = () => {
  const [activeTab, setActiveTab] = useState('unites');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Unités d'Enseignement</h2>
          <p className="text-muted-foreground">Gérez les unités d'enseignement, matières et chapitres</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          {activeTab === 'unites' && 'Nouvelle Unité'}
          {activeTab === 'matieres' && 'Nouvelle Matière'}
          {activeTab === 'chapitres' && 'Nouveau Chapitre'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="unites" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Unités d'enseignement</span>
            <span className="sm:hidden">Unités</span>
          </TabsTrigger>
          <TabsTrigger value="matieres" className="flex items-center gap-2">
            <Book size={16} />
            <span className="hidden sm:inline">Matières</span>
            <span className="sm:hidden">Matières</span>
          </TabsTrigger>
          <TabsTrigger value="chapitres" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline">Chapitres</span>
            <span className="sm:hidden">Chapit.</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="unites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={18} />
                Unités d'Enseignement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Groupe</TableHead>
                      <TableHead className="hidden md:table-cell">Coefficient</TableHead>
                      <TableHead className="hidden md:table-cell">Responsable</TableHead>
                      <TableHead className="hidden md:table-cell">Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unitesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.groupe}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.coefficient}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.responsable}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.classes.join(', ')}</TableCell>
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
        
        <TabsContent value="matieres">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book size={18} />
                Matières
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Unité</TableHead>
                      <TableHead className="hidden md:table-cell">Coefficient</TableHead>
                      <TableHead className="hidden md:table-cell">Heures/semaine</TableHead>
                      <TableHead className="hidden md:table-cell">Enseignant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matieresData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.unite}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.coefficient}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.heuresHebdo}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.enseignant}</TableCell>
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
        
        <TabsContent value="chapitres">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={18} />
                Chapitres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Matière</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden md:table-cell">Durée</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chapitresData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.titre}</TableCell>
                        <TableCell>{item.matiere}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.description}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.duree}</TableCell>
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

export default Education;
