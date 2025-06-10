
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { BookOpen, Book, FileText, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Domaine, UniteEnseignement, Matiere } from '@/types/teaching';
import DomaineForm from '@/components/forms/DomaineForm';
import UniteForm from '@/components/forms/UniteForm';
import MatiereForm from '@/components/forms/MatiereForm';
import { useTeachingData } from '@/hooks/useTeachingData';

// Données fictives basées sur les vrais types
// const domainesData: Domaine[] = [
//   { id: 1, nom: 'Sciences Exactes', description: 'Mathématiques, Physique, Chimie' },
//   { id: 2, nom: 'Sciences Humaines', description: 'Histoire, Géographie, Philosophie' },
//   { id: 3, nom: 'Langues et Littérature', description: 'Français, Anglais, Littérature' },
//   { id: 4, nom: 'Sciences Naturelles', description: 'Biologie, Sciences de la Terre' },
// ];

// const unitesData: UniteEnseignement[] = [
//   { id: 1, nom: 'Mathématiques', description: 'Unité d\'enseignement en mathématiques', domaines: [1] },
//   { id: 2, nom: 'Sciences Physiques', description: 'Physique et Chimie', domaines: [1] },
//   { id: 3, nom: 'Français', description: 'Langue française et littérature', domaines: [3] },
//   { id: 4, nom: 'Histoire-Géographie', description: 'Sciences humaines et sociales', domaines: [2] },
//   { id: 5, nom: 'Sciences de la Vie et de la Terre', description: 'Biologie et géologie', domaines: [4] },
// ];

// const matieresData: Matiere[] = [
//   { id: 1, nom: 'Algèbre', unite: 1, coefficient: 4, description: 'Mathématiques algébriques' },
//   { id: 2, nom: 'Géométrie', unite: 1, coefficient: 3, description: 'Mathématiques géométriques' },
//   { id: 3, nom: 'Physique', unite: 2, coefficient: 3, description: 'Physique générale' },
//   { id: 4, nom: 'Chimie', unite: 2, coefficient: 3, description: 'Chimie générale' },
//   { id: 5, nom: 'Littérature', unite: 3, coefficient: 4, description: 'Littérature française' },
//   { id: 6, nom: 'Grammaire', unite: 3, coefficient: 2, description: 'Grammaire française' },
//   { id: 7, nom: 'Histoire', unite: 4, coefficient: 3, description: 'Histoire générale' },
//   { id: 8, nom: 'Géographie', unite: 4, coefficient: 3, description: 'Géographie générale' },
//   { id: 9, nom: 'Biologie', unite: 5, coefficient: 4, description: 'Sciences biologiques' },
// ];

const Education: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('domaines');
  
  // États pour les filtres et recherche
  const [searchTerms, setSearchTerms] = useState({domaines: '', unites: '', matieres: ''});
  const [selectedFilters, setSelectedFilters] = useState({uniteDomaine: 'all', matiereUnite: 'all', matiereCoefficient: 'all'});

  // États pour les données filtrées
  const [filteredDomaines, setFilteredDomaines] = useState<Domaine[]>([]);
  const [filteredUnites, setFilteredUnites] = useState<UniteEnseignement[]>([]);
  const [filteredMatieres, setFilteredMatieres] = useState<Matiere[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const {
    domaines, createDomaine, updateDomaine, deleteDomaine,
    unites, createUnite, updateUnite, deleteUnite,
    matieres, createMatiere, updateMatiere, deleteMatiere,
    // matGroupes, createMatGroupe, updateMatGroupe, deleteMatGroupe,
    // evenements, createEvenement, updateEvenement, deleteEvenement,
    // fichiersEvenements, createFichierEvenement, updateFichierEvenement, deleteFichierEvenement,
    // exercices, createExercice, updateExercice, deleteExercice,
    // fichiersExercices, createFichierExercice, updateFichierExercice, deleteFichierExercice,
    // presences, createPresence, updatePresence, deletePresence,
    // notes, createNote, updateNote, deleteNote,
    // noteConfigs, createNoteConfig, updateNoteConfig, deleteNoteConfig
  } = useTeachingData();

  useEffect(() => {
      setFilteredDomaines(domaines);
    }, [domaines]);
  
    useEffect(() => {
      setFilteredUnites(unites);
    }, [unites]);
  
    useEffect(() => {
      setFilteredMatieres(matieres);
    }, [matieres]);

  // Fonctions utilitaires
  const getDomaineName = (id: number) => {return domaines.find(d => d.id === id)?.nom || 'Inconnu';};
  const getUniteName = (id: number) => {return unites.find(u => u.id === id)?.nom || 'Inconnue';};
  const getDomainesForUnite = (domaines: number[]) => {return domaines.map(id => getDomaineName(id)).join(', ');};

  // Fonctions de filtrage
  const applyDomainesFilter = () => {
    let result = [...domaines];
    if (searchTerms.domaines) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.domaines.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerms.domaines.toLowerCase())
      );
    }
    setFilteredDomaines(result);
  };

  const applyUnitesFilter = () => {
    let result = [...unites];
    
    if (searchTerms.unites) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.unites.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerms.unites.toLowerCase())
      );
    }
    
    if (selectedFilters.uniteDomaine !== 'all') {
      const domaineId = parseInt(selectedFilters.uniteDomaine);
      result = result.filter(item => item.domaines.includes(domaineId));
    }
    
    setFilteredUnites(result);
  };

  const applyMatieresFilter = () => {
    let result = [...matieres];
    
    if (searchTerms.matieres) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.matieres.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerms.matieres.toLowerCase())
      );
    }
    
    if (selectedFilters.matiereUnite !== 'all') {
      const uniteId = parseInt(selectedFilters.matiereUnite);
      result = result.filter(item => item.unite === uniteId);
    }
    
    if (selectedFilters.matiereCoefficient !== 'all') {
      const coefficientRange = selectedFilters.matiereCoefficient;
      result = result.filter(item => {
        switch (coefficientRange) {
          case 'low': return item.coefficient <= 2;
          case 'medium': return item.coefficient === 3;
          case 'high': return item.coefficient >= 4;
          default: return true;
        }
      });
    }
    
    setFilteredMatieres(result);
  };

  // Gestionnaires d'événements
  const handleSearchChange = (tab: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [tab]: value }));
  };

  const resetFilters = (tab: string) => {
    switch (tab) {
      case 'domaines':
        setSearchTerms(prev => ({ ...prev, domaines: '' }));
        setFilteredDomaines(domaines);
        break;
      case 'unites':
        setSearchTerms(prev => ({ ...prev, unites: '' }));
        setSelectedFilters(prev => ({ ...prev, uniteDomaine: 'all' }));
        setFilteredUnites(unites);
        break;
      case 'matieres':
        setSearchTerms(prev => ({ ...prev, matieres: '' }));
        setSelectedFilters(prev => ({ ...prev, matiereUnite: 'all', matiereCoefficient: 'all' }));
        setFilteredMatieres(matieres);
        break;
    }
  };

  const handleAction = (action: string, type: string, item?: any) => {
    toast({
      title: `${action} ${type}`,
      description: `Action "${action}" pour ${type} ${item ? `ID ${item.id}` : ''}`,
    });
  };

  const getCoefficientColor = (coefficient: number) => {
    if (coefficient <= 2) return 'bg-orange-100 text-orange-800';
    if (coefficient === 3) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  
  const handleCreateClick = () => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDetailsClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    let itemType = '';
    try {
      switch (activeTab) {
        case 'domaines':
          await deleteDomaine(selectedItem.id);
          itemType = 'Domaine';
          break;
        case 'unites':
          await deleteUnite(selectedItem.id);
          itemType = 'Unité';
          break;
        case 'matieres':
          await deleteMatiere(selectedItem.id);
          itemType = 'Matière';
          break;
      }
      toast({ title: 'Suppression réussie', description: `L'élément a été supprimé avec succès.` });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Échec de la suppression.', variant: 'destructive' });
    }

    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    
    toast({
      title: `${itemType} supprimé${itemType === 'Domaine' ? '' : 'e'}`,
      description: `${itemType === 'Domaine' ? 'Le ' : itemType === 'Matière' ? 'La ' : "L'" }${itemType} a été supprimé${itemType === 'Domaine' ? '' : 'e'} avec succès.`,
    });
  };
  
  const handleFormSubmit = async (data: any) => {
    const isEdit = !!selectedItem;
    let response;
    try {
      switch (activeTab) {
        case 'domaines':
          isEdit ? await updateDomaine(selectedItem.id, data) : await createDomaine(data);
          break;
        case 'unites':
          isEdit ? await updateUnite(selectedItem.id, data) : await createUnite(data);
          break;
        case 'matieres':
          isEdit ? await updateMatiere(selectedItem.id, data) : await createMatiere(data);
          break;
      }
      toast({ title: `Élément ${isEdit ? 'mis à jour' : 'créé'}`, description: `L'élément a été ${isEdit ? 'modifié' : 'créé'} avec succès.` });
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Échec de la soumission.', variant: 'destructive' });
    }
  };

  const handleFormCancel = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const getModalTitle = () => {
    const action = selectedItem ? 'Modifier' : 'Créer';
    switch (activeTab) {
      case 'domaines': return `${action} un domaine d'enseignement`;
      case 'unites': return `${action} une unité d'enseignement`;
      case 'matieres': return `${action} une matière`;
      default: return action;
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'domaines':
        return <DomaineForm isEditing={!!selectedItem} selectedDomaine={selectedItem} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />;
      case 'unites':
        return <UniteForm isEditing={!!selectedItem} selectedUnite={selectedItem} domaines={domaines} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />;
      case 'matieres':
        return <MatiereForm isEditing={!!selectedItem} selectedMatiere={selectedItem} unites={unites} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />;
      default:
        return null;
    }
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Unités d'Enseignement</h2>
          <p className="text-muted-foreground">Gérez les domaines, unités d'enseignement et matières</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleCreateClick()}>
          <Plus size={16} />
          {activeTab === 'domaines' && 'Nouveau Domaine'}
          {activeTab === 'unites' && 'Nouvelle Unité'}
          {activeTab === 'matieres' && 'Nouvelle Matière'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="domaines" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Domaines</span>
            <span className="sm:hidden">Dom.</span>
          </TabsTrigger>
          <TabsTrigger value="unites" className="flex items-center gap-2">
            <Book size={16} />
            <span className="hidden sm:inline">Unités</span>
            <span className="sm:hidden">Unités</span>
          </TabsTrigger>
          <TabsTrigger value="matieres" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline">Matières</span>
            <span className="sm:hidden">Mat.</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="domaines">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={18} />
                  Domaines d'Enseignement
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un domaine..."
                      value={searchTerms.domaines}
                      onChange={(e) => handleSearchChange('domaines', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" onClick={applyDomainesFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('domaines')}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDomaines.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleDetailsClick(item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unites">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Book size={18} />
                  Unités d'Enseignement
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une unité..."
                      value={searchTerms.unites}
                      onChange={(e) => handleSearchChange('unites', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilters.uniteDomaine} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, uniteDomaine: value }))
                  }>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Domaine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous domaines</SelectItem>
                      {domaines.map(domaine => (
                        <SelectItem key={domaine.id} value={domaine.id.toString()}>
                          {domaine.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={applyUnitesFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('unites')}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Domaines</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnites.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{getDomainesForUnite(item.domaines)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleDetailsClick(item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} />
                  Matières
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-40">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une matière..."
                      value={searchTerms.matieres}
                      onChange={(e) => handleSearchChange('matieres', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilters.matiereUnite} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, matiereUnite: value }))
                  }>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes unités</SelectItem>
                      {unites.map(unite => (
                        <SelectItem key={unite.id} value={unite.id.toString()}>
                          {unite.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedFilters.matiereCoefficient} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, matiereCoefficient: value }))
                  }>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Coefficient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="low">≤ 2</SelectItem>
                      <SelectItem value="medium">3</SelectItem>
                      <SelectItem value="high">≥ 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={applyMatieresFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('matieres')}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Unité</TableHead>
                      <TableHead>Coefficient</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatieres.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{getUniteName(item.unite)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCoefficientColor(item.coefficient)}`}>
                            {item.coefficient}
                          </span>
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleDetailsClick(item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
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

      {/* Modales */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={() => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedItem(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{getModalTitle()}</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>

      {/* Modale de détails */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p>{selectedItem.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p>{selectedItem.nom}</p>
              </div>
              {/* Affichage conditionnel selon le type */}
              {selectedItem.adresse && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                  <p>{selectedItem.adresse}</p>
                </div>
              )}
              {selectedItem.capacite && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Capacité</p>
                  <p>{selectedItem.capacite} places</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Fermer</Button>
            <Button onClick={() => {
              setIsDetailsModalOpen(false);
              handleEditClick(selectedItem);
            }}>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer l'élément</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Education;
