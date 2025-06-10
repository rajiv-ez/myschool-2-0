
import React, { useState, useMemo } from 'react';
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Filter, Edit, Trash2, Users } from 'lucide-react';
import { useUsersData } from '@/hooks/useUsersData';
import UserForm from '@/components/forms/UserForm';
import UserFilters from '@/components/users/UserFilters';
import { User } from '@/types/users';

const Personnes: React.FC = () => {
  const { toast } = useToast();
  const { users, eleves, tuteurs, loading, createUser, updateUser, deleteUser } = useUsersData();
  
  const [activeTab, setActiveTab] = useState('eleves');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États des filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Données filtrées
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genreFilter !== 'all') {
      result = result.filter(user => user.genre === genreFilter);
    }

    if (statutFilter !== 'all') {
      result = result.filter(user => 
        statutFilter === 'active' ? user.is_active : !user.is_active
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(user => 
        typeFilter === 'staff' ? user.is_staff : !user.is_staff
      );
    }

    return result;
  }, [users, searchTerm, genreFilter, statutFilter, typeFilter]);

  const elevesWithUserData = useMemo(() => {
    return eleves.map(eleve => {
      const userData = users.find(user => user.id === eleve.user);
      return {
        ...eleve,
        userData
      };
    }).filter(eleve => eleve.userData);
  }, [eleves, users]);

  const tuteursWithUserData = useMemo(() => {
    return tuteurs.map(tuteur => {
      const userData = users.find(user => user.id === tuteur.user);
      return {
        ...tuteur,
        userData
      };
    }).filter(tuteur => tuteur.userData);
  }, [tuteurs, users]);

  const applyFilter = () => {
    // Les filtres sont appliqués automatiquement via useMemo
  };

  const resetFilter = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setStatutFilter('all');
    setTypeFilter('all');
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.prenom} ${user.nom} ?`)) {
      try {
        await deleteUser(user.id);
        toast({
          title: "Suppression réussie",
          description: "L'utilisateur a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedUser) {
        await updateUser(selectedUser.id, data);
        toast({
          title: "Modification réussie",
          description: "L'utilisateur a été modifié avec succès.",
        });
      } else {
        await createUser(data);
        toast({
          title: "Création réussie",
          description: "L'utilisateur a été créé avec succès.",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des Personnes
        </h2>
        <p className="text-muted-foreground">Gérez les informations des élèves, tuteurs et personnel</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="eleves">Élèves ({elevesWithUserData.length})</TabsTrigger>
            <TabsTrigger value="tuteurs">Tuteurs ({tuteursWithUserData.length})</TabsTrigger>
            <TabsTrigger value="tous">Tous ({filteredUsers.length})</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filtres
            </Button>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus size={18} />
              Nouvelle personne
            </Button>
          </div>
        </div>

        {showFilters && (
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            statutFilter={statutFilter}
            setStatutFilter={setStatutFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
            onClose={() => setShowFilters(false)}
          />
        )}
        
        <TabsContent value="eleves">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elevesWithUserData.map((eleve) => (
                    <TableRow key={eleve.id}>
                      <TableCell className="font-medium">{eleve.matricule}</TableCell>
                      <TableCell>{eleve.userData?.nom}</TableCell>
                      <TableCell>{eleve.userData?.prenom}</TableCell>
                      <TableCell>{eleve.userData?.email}</TableCell>
                      <TableCell>{eleve.userData?.tel1}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          eleve.userData?.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {eleve.userData?.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEdit(eleve.userData!)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(eleve.userData!)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="tuteurs">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Profession</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tuteursWithUserData.map((tuteur) => (
                    <TableRow key={tuteur.id}>
                      <TableCell className="font-medium">{tuteur.userData?.nom}</TableCell>
                      <TableCell>{tuteur.userData?.prenom}</TableCell>
                      <TableCell>{tuteur.userData?.email}</TableCell>
                      <TableCell>{tuteur.userData?.tel1}</TableCell>
                      <TableCell>{tuteur.profession}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tuteur.userData?.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tuteur.userData?.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEdit(tuteur.userData!)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(tuteur.userData!)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tous">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nom}</TableCell>
                      <TableCell>{user.prenom}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.genre === 'M' ? 'Masculin' : user.genre === 'F' ? 'Féminin' : 'Autre'}</TableCell>
                      <TableCell>{user.tel1}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_staff 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.is_staff ? 'Personnel' : 'Étudiant'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Modifier la personne' : 'Créer une nouvelle personne'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifiez les informations de la personne' : 'Remplissez les informations pour créer une nouvelle personne'}
            </DialogDescription>
          </DialogHeader>
          
          <UserForm
            user={selectedUser || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Personnes;
