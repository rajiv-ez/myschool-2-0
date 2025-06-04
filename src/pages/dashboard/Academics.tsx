
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Layers, Grid, School, Plus, AlertCircle } from 'lucide-react';
import { useApiWithFallback } from '@/hooks/useApiWithFallback';
import { academicService } from '@/services/academicService';
import { Niveau, Filiere, Specialite, Classe } from '@/types/academic';
import { Skeleton } from '@/components/ui/skeleton';

const Academics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('niveaux');

  // Chargement des données avec les nouveaux services
  const { data: niveaux, loading: niveauxLoading, error: niveauxError } = useApiWithFallback(
    () => academicService.getNiveaux(),
    []
  );

  const { data: filieres, loading: filieresLoading, error: filieresError } = useApiWithFallback(
    () => academicService.getFilieres(),
    []
  );

  const { data: specialites, loading: specialitesLoading, error: specialitesError } = useApiWithFallback(
    () => academicService.getSpecialites(),
    []
  );

  const { data: classes, loading: classesLoading, error: classesError } = useApiWithFallback(
    () => academicService.getClasses(),
    []
  );

  // Fonction pour obtenir le nom du niveau par ID
  const getNiveauNom = (id: number): string => {
    const niveau = niveaux?.find(n => n.id === id);
    return niveau ? niveau.nom : `Niveau ${id}`;
  };

  // Fonction pour obtenir le nom de la filière par ID
  const getFiliereNom = (id: number): string => {
    const filiere = filieres?.find(f => f.id === id);
    return filiere ? filiere.nom : `Filière ${id}`;
  };

  // Fonction pour obtenir le nom de la spécialité par ID
  const getSpecialiteNom = (id: number): string => {
    const specialite = specialites?.find(s => s.id === id);
    return specialite ? specialite.nom : `Spécialité ${id}`;
  };

  if (niveauxLoading || filieresLoading || specialitesLoading || classesLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Structure Académique</h2>
            <p className="text-muted-foreground">Gérez les niveaux, spécialités et classes de votre établissement</p>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (niveauxError || filieresError || specialitesError || classesError) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Structure Académique</h2>
            <p className="text-muted-foreground">Gérez les niveaux, spécialités et classes de votre établissement</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">Erreur lors du chargement des données</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {activeTab === 'filieres' && 'Nouvelle Filière'}
          {activeTab === 'specialites' && 'Nouvelle Spécialité'}
          {activeTab === 'classes' && 'Nouvelle Classe'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="niveaux" className="flex items-center gap-2">
            <Layers size={16} />
            <span className="hidden sm:inline">Niveaux</span>
            <span className="sm:hidden">Niv.</span>
          </TabsTrigger>
          <TabsTrigger value="filieres" className="flex items-center gap-2">
            <Grid size={16} />
            <span className="hidden sm:inline">Filières</span>
            <span className="sm:hidden">Fil.</span>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {niveaux?.map((niveau) => (
                      <TableRow key={niveau.id}>
                        <TableCell>{niveau.id}</TableCell>
                        <TableCell className="font-medium">{niveau.nom}</TableCell>
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
        
        <TabsContent value="filieres">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid size={18} />
                Filières
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filieres?.map((filiere) => (
                      <TableRow key={filiere.id}>
                        <TableCell>{filiere.id}</TableCell>
                        <TableCell className="font-medium">{filiere.nom}</TableCell>
                        <TableCell>{getNiveauNom(filiere.niveau)}</TableCell>
                        <TableCell className="hidden md:table-cell">{filiere.description}</TableCell>
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
                      <TableHead>Filière</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialites?.map((specialite) => (
                      <TableRow key={specialite.id}>
                        <TableCell>{specialite.id}</TableCell>
                        <TableCell className="font-medium">{specialite.nom}</TableCell>
                        <TableCell>{getFiliereNom(specialite.filiere)}</TableCell>
                        <TableCell className="hidden md:table-cell">{specialite.description}</TableCell>
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
                      <TableHead>Spécialité</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes?.map((classe) => (
                      <TableRow key={classe.id}>
                        <TableCell>{classe.id}</TableCell>
                        <TableCell className="font-medium">{classe.nom}</TableCell>
                        <TableCell>{getSpecialiteNom(classe.specialite)}</TableCell>
                        <TableCell className="hidden md:table-cell">{classe.description}</TableCell>
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
