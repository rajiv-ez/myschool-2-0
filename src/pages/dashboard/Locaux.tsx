
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building, Home, DoorClosed, Plus, AlertCircle } from 'lucide-react';
import { useApiWithFallback } from '@/hooks/useApiWithFallback';
import { infrastructureService } from '@/services/infrastructureService';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';
import { Skeleton } from '@/components/ui/skeleton';

const Locaux: React.FC = () => {
  const [activeTab, setActiveTab] = useState('succursales');

  // Chargement des données avec les nouveaux services
  const { data: succursales, loading: succursalesLoading, error: succursalesError } = useApiWithFallback(
    () => infrastructureService.getSuccursales(),
    []
  );

  const { data: batiments, loading: batimentsLoading, error: batimentsError } = useApiWithFallback(
    () => infrastructureService.getBatiments(),
    []
  );

  const { data: salles, loading: sallesLoading, error: sallesError } = useApiWithFallback(
    () => infrastructureService.getSalles(),
    []
  );

  // Fonction pour obtenir le nom de la succursale par ID
  const getSuccursaleNom = (id: number): string => {
    const succursale = succursales?.find(s => s.id === id);
    return succursale ? succursale.nom : `Succursale ${id}`;
  };

  // Fonction pour obtenir le nom du bâtiment par ID
  const getBatimentNom = (id: number): string => {
    const batiment = batiments?.find(b => b.id === id);
    return batiment ? batiment.nom : `Bâtiment ${id}`;
  };

  if (succursalesLoading || batimentsLoading || sallesLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Gestion des Locaux</h2>
            <p className="text-muted-foreground">Gérez les succursales, bâtiments et salles de votre établissement</p>
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

  if (succursalesError || batimentsError || sallesError) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Gestion des Locaux</h2>
            <p className="text-muted-foreground">Gérez les succursales, bâtiments et salles de votre établissement</p>
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
                      <TableHead className="hidden md:table-cell">Pays</TableHead>
                      <TableHead>Siège</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {succursales?.map((succursale) => (
                      <TableRow key={succursale.id}>
                        <TableCell>{succursale.id}</TableCell>
                        <TableCell className="font-medium">{succursale.nom}</TableCell>
                        <TableCell className="hidden md:table-cell">{succursale.adresse}</TableCell>
                        <TableCell className="hidden md:table-cell">{succursale.ville}</TableCell>
                        <TableCell className="hidden md:table-cell">{succursale.pays}</TableCell>
                        <TableCell>
                          {succursale.est_siege ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Siège
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Annexe
                            </span>
                          )}
                        </TableCell>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batiments?.map((batiment) => (
                      <TableRow key={batiment.id}>
                        <TableCell>{batiment.id}</TableCell>
                        <TableCell className="font-medium">{batiment.nom}</TableCell>
                        <TableCell>{getSuccursaleNom(batiment.succursale)}</TableCell>
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
                      <TableHead className="hidden md:table-cell">Capacité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salles?.map((salle) => (
                      <TableRow key={salle.id}>
                        <TableCell>{salle.id}</TableCell>
                        <TableCell className="font-medium">{salle.nom}</TableCell>
                        <TableCell>{getBatimentNom(salle.batiment)}</TableCell>
                        <TableCell className="hidden md:table-cell">{salle.capacite}</TableCell>
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
