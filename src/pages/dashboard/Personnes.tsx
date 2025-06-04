
import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiWithFallback } from '@/hooks/useApiWithFallback';
import { usersService } from '@/services/usersService';
import { User, Eleve, Tuteur, RelationEleveTuteur } from '@/types/users';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Personnes: React.FC = () => {
  const [activeTab, setActiveTab] = useState('eleves');

  // Chargement des données avec les nouveaux services
  const { data: users, loading: usersLoading, error: usersError } = useApiWithFallback(
    () => usersService.getUsers(),
    []
  );

  const { data: eleves, loading: elevesLoading, error: elevesError } = useApiWithFallback(
    () => usersService.getEleves(),
    []
  );

  const { data: tuteurs, loading: tuteursLoading, error: tuteursError } = useApiWithFallback(
    () => usersService.getTuteurs(),
    []
  );

  const { data: relations, loading: relationsLoading, error: relationsError } = useApiWithFallback(
    () => usersService.getRelations(),
    []
  );

  // Fonction pour obtenir les données utilisateur par ID
  const getUserById = (id: number): User | undefined => {
    return users?.find(user => user.id === id);
  };

  // Fonction pour obtenir le nombre de tuteurs d'un élève
  const getTuteursCount = (eleveUserId: number): number => {
    if (!relations) return 0;
    return relations.filter(relation => relation.eleve === eleveUserId).length;
  };

  // Fonction pour obtenir le nombre d'élèves d'un tuteur
  const getElevesCount = (tuteurUserId: number): number => {
    if (!relations) return 0;
    return relations.filter(relation => relation.tuteur === tuteurUserId).length;
  };

  // Formatage de la date de naissance
  const formatDateNaissance = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR');
    } catch {
      return dateStr;
    }
  };

  if (usersLoading || elevesLoading || tuteursLoading || relationsLoading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Élèves & Tuteurs</h2>
          <p className="text-muted-foreground">Gérez les informations des élèves et de leurs tuteurs</p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (usersError || elevesError || tuteursError || relationsError) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Élèves & Tuteurs</h2>
          <p className="text-muted-foreground">Gérez les informations des élèves et de leurs tuteurs</p>
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
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Tuteurs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eleves?.map((eleve) => {
                  const user = getUserById(eleve.user);
                  if (!user) return null;
                  
                  return (
                    <TableRow key={eleve.id}>
                      <TableCell className="font-medium">{eleve.matricule}</TableCell>
                      <TableCell>{user.nom}</TableCell>
                      <TableCell>{user.prenom}</TableCell>
                      <TableCell>{formatDateNaissance(user.date_naissance)}</TableCell>
                      <TableCell>{user.genre}</TableCell>
                      <TableCell>{user.tel1}</TableCell>
                      <TableCell>{getTuteursCount(user.id)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Voir détails</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="tuteurs">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Profession</TableHead>
                  <TableHead>Élèves</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tuteurs?.map((tuteur) => {
                  const user = getUserById(tuteur.user);
                  if (!user) return null;
                  
                  return (
                    <TableRow key={tuteur.id}>
                      <TableCell className="font-medium">{user.nom}</TableCell>
                      <TableCell>{user.prenom}</TableCell>
                      <TableCell>{user.tel1}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.whatsapp || '-'}</TableCell>
                      <TableCell>{tuteur.profession}</TableCell>
                      <TableCell>{getElevesCount(user.id)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Voir détails</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Personnes;
