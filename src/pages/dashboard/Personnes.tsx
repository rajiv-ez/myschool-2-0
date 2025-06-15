
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
import { User, EleveDetail, TuteurDetail, StaffDetail } from '@/types/users';

const Personnes: React.FC = () => {
  const { toast } = useToast();
  const { 
    users, 
    elevesDetails, 
    tuteursDetails, 
    staffsDetails,
    loading, 
    createEleveDetail, 
    updateEleveDetail, 
    deleteEleveDetail,
    createTuteurDetail, 
    updateTuteurDetail, 
    deleteTuteurDetail,
    createStaffDetail, 
    updateStaffDetail, 
    deleteStaffDetail,
    createUser, 
    updateUser, 
    deleteUser 
  } = useUsersData();
  
  const [activeTab, setActiveTab] = useState('eleves');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EleveDetail | TuteurDetail | StaffDetail | null>(null);
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
    setSelectedEntity(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setSelectedEntity(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditEleve = (eleve: EleveDetail) => {
    setSelectedUser(typeof eleve.user === 'object' ? eleve.user : null);
    setSelectedEntity(eleve);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditTuteur = (tuteur: TuteurDetail) => {
    setSelectedUser(typeof tuteur.user === 'object' ? tuteur.user : null);
    setSelectedEntity(tuteur);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff: StaffDetail) => {
    setSelectedUser(typeof staff.user === 'object' ? staff.user : null);
    setSelectedEntity(staff);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
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

  const handleDeleteEleve = async (eleve: EleveDetail) => {
    const userName = typeof eleve.user === 'object' ? `${eleve.user.prenom} ${eleve.user.nom}` : 'cet élève';
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) {
      try {
        await deleteEleveDetail(eleve.id);
        toast({
          title: "Suppression réussie",
          description: "L'élève a été supprimé avec succès.",
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

  const handleDeleteTuteur = async (tuteur: TuteurDetail) => {
    const userName = typeof tuteur.user === 'object' ? `${tuteur.user.prenom} ${tuteur.user.nom}` : 'ce tuteur';
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) {
      try {
        await deleteTuteurDetail(tuteur.id);
        toast({
          title: "Suppression réussie",
          description: "Le tuteur a été supprimé avec succès.",
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

  const handleDeleteStaff = async (staff: StaffDetail) => {
    const userName = typeof staff.user === 'object' ? `${staff.user.prenom} ${staff.user.nom}` : 'ce membre du personnel';
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) {
      try {
        await deleteStaffDetail(staff.id);
        toast({
          title: "Suppression réussie",
          description: "Le membre du personnel a été supprimé avec succès.",
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
      if (isEditing) {
        if (selectedEntity) {
          // Update using *Detail methods
          if ('matricule' in selectedEntity) {
            // It's an EleveDetail
            await updateEleveDetail(selectedEntity.id, data);
          } else if ('profession' in selectedEntity) {
            // It's a TuteurDetail
            await updateTuteurDetail(selectedEntity.id, data);
          } else {
            // It's a StaffDetail
            await updateStaffDetail(selectedEntity.id, data);
          }
        } else if (selectedUser) {
          // Update user only
          await updateUser(selectedUser.id, data);
        }
        toast({
          title: "Modification réussie",
          description: "Les informations ont été modifiées avec succès.",
        });
      } else {
        // Create new entity based on active tab
        if (activeTab === 'eleves') {
          await createEleveDetail(data);
        } else if (activeTab === 'tuteurs') {
          await createTuteurDetail(data);
        } else if (activeTab === 'staff') {
          await createStaffDetail(data);
        } else {
          await createUser(data);
        }
        toast({
          title: "Création réussie",
          description: "La personne a été créée avec succès.",
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
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="eleves">Élèves ({elevesDetails.length})</TabsTrigger>
            <TabsTrigger value="tuteurs">Tuteurs ({tuteursDetails.length})</TabsTrigger>
            <TabsTrigger value="staff">Personnel ({staffsDetails.length})</TabsTrigger>
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
                  {elevesDetails.map((eleve) => {
                    const userData = typeof eleve.user === 'object' ? eleve.user : null;
                    return (
                      <TableRow key={eleve.id}>
                        <TableCell className="font-medium">{eleve.matricule}</TableCell>
                        <TableCell>{userData?.nom}</TableCell>
                        <TableCell>{userData?.prenom}</TableCell>
                        <TableCell>{userData?.email}</TableCell>
                        <TableCell>{userData?.tel1}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userData?.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userData?.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditEleve(eleve)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteEleve(eleve)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                  {tuteursDetails.map((tuteur) => {
                    const userData = typeof tuteur.user === 'object' ? tuteur.user : null;
                    return (
                      <TableRow key={tuteur.id}>
                        <TableCell className="font-medium">{userData?.nom}</TableCell>
                        <TableCell>{userData?.prenom}</TableCell>
                        <TableCell>{userData?.email}</TableCell>
                        <TableCell>{userData?.tel1}</TableCell>
                        <TableCell>{tuteur.profession}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userData?.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userData?.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditTuteur(tuteur)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteTuteur(tuteur)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="staff">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date embauche</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffsDetails.map((staff) => {
                    const userData = typeof staff.user === 'object' ? staff.user : null;
                    return (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{userData?.nom}</TableCell>
                        <TableCell>{userData?.prenom}</TableCell>
                        <TableCell>{userData?.email}</TableCell>
                        <TableCell>{userData?.tel1}</TableCell>
                        <TableCell>{new Date(staff.date_embauche).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            staff.statut === 'ACTIF' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {staff.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditStaff(staff)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteStaff(staff)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDeleteUser(user)}
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
            entity={selectedEntity || undefined}
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
