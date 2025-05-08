
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpenText, 
  Search, 
  Plus, 
  BookCopy, 
  Calendar, 
  User2, 
  CircleCheck, 
  CircleAlert,
  Pencil,
  Eye,
  Trash2,
  Download,
  Filter,
  Library
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Livre, Emprunt } from '@/components/bibliotheque/types';
import LivreForm from '@/components/bibliotheque/livres/LivreForm';
import EmpruntForm from '@/components/bibliotheque/emprunts/EmpruntForm';
import MesEmpruntsSection from '@/components/bibliotheque/mes-emprunts/MesEmpruntsSection';

// Generate initial data for the application
const generateInitialLivres = (): Livre[] => [
  {
    id: 1,
    titre: "Les Misérables",
    auteur: "Victor Hugo",
    categorie: "Roman",
    isbn: "9783161484100",
    etat: "Bon état",
    date_ajout: "15/09/2023",
    disponible: true
  },
  {
    id: 2,
    titre: "Le Petit Prince",
    auteur: "Antoine de Saint-Exupéry",
    categorie: "Conte",
    isbn: "9783161484101",
    etat: "Neuf",
    date_ajout: "20/08/2023",
    disponible: true
  },
  {
    id: 3,
    titre: "Harry Potter à l'école des sorciers",
    auteur: "J.K. Rowling",
    categorie: "Fantasy",
    isbn: "9783161484102",
    etat: "Usé",
    date_ajout: "10/09/2023",
    disponible: false
  },
  {
    id: 4,
    titre: "L'Étranger",
    auteur: "Albert Camus",
    categorie: "Roman",
    isbn: "9783161484103",
    etat: "Bon état",
    date_ajout: "05/09/2023",
    disponible: true
  },
  {
    id: 5,
    titre: "Le Petit Nicolas",
    auteur: "René Goscinny",
    categorie: "Jeunesse",
    isbn: "9783161484104",
    etat: "Usé",
    date_ajout: "12/09/2023",
    disponible: true
  },
  {
    id: 6,
    titre: "Dictionnaire Larousse",
    auteur: "Larousse",
    categorie: "Référence",
    isbn: "9783161484105",
    etat: "Bon état",
    date_ajout: "01/09/2023",
    disponible: true
  }
];

const generateInitialEmprunts = (livres: Livre[]): Emprunt[] => [
  {
    id: 101,
    livre_id: 3,
    titre: "Harry Potter à l'école des sorciers",
    emprunteur: "Sophie Mba",
    classe: "CM2",
    date_emprunt: "2023-09-15",
    date_retour_prevue: "2023-10-15",
    date_retour_reelle: null,
    statut: "En cours"
  },
  {
    id: 102,
    livre_id: 2,
    titre: "Le Petit Prince",
    emprunteur: "Jean Ondo",
    classe: "6ème",
    date_emprunt: "2023-09-10",
    date_retour_prevue: "2023-10-10",
    date_retour_reelle: "2023-09-20",
    statut: "Rendu"
  },
  {
    id: 103,
    livre_id: 5,
    titre: "Le Petit Nicolas",
    emprunteur: "Marie Ndong",
    classe: "CM1",
    date_emprunt: "2023-09-05",
    date_retour_prevue: "2023-10-05",
    date_retour_reelle: null,
    statut: "En retard"
  }
];

const Bibliotheque: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('livres');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data state
  const [livres, setLivres] = useState<Livre[]>(generateInitialLivres());
  const [emprunts, setEmprunts] = useState<Emprunt[]>(generateInitialEmprunts(livres));
  
  // Filtered data
  const [filteredLivres, setFilteredLivres] = useState<Livre[]>(livres);
  const [filteredEmprunts, setFilteredEmprunts] = useState<Emprunt[]>(emprunts);
  
  // Modal states
  const [isAddLivreModalOpen, setIsAddLivreModalOpen] = useState(false);
  const [isEditLivreModalOpen, setIsEditLivreModalOpen] = useState(false);
  const [isLivreDetailsModalOpen, setIsLivreDetailsModalOpen] = useState(false);
  const [selectedLivre, setSelectedLivre] = useState<Livre | null>(null);
  
  const [isAddEmpruntModalOpen, setIsAddEmpruntModalOpen] = useState(false);
  const [isEditEmpruntModalOpen, setIsEditEmpruntModalOpen] = useState(false);
  const [isEmpruntDetailsModalOpen, setIsEmpruntDetailsModalOpen] = useState(false);
  const [selectedEmprunt, setSelectedEmprunt] = useState<Emprunt | null>(null);
  
  // Filter data when search term changes
  useEffect(() => {
    filterData();
  }, [searchTerm, livres, emprunts, activeTab]);
  
  const filterData = () => {
    if (activeTab === 'livres') {
      filterLivres();
    } else if (activeTab === 'emprunts') {
      filterEmprunts();
    }
  };
  
  // Filtrer les livres
  const filterLivres = () => {
    if (searchTerm === '') {
      setFilteredLivres(livres);
    } else {
      setFilteredLivres(livres.filter(livre => 
        livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livre.categorie.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };
  
  // Filtrer les emprunts
  const filterEmprunts = () => {
    if (searchTerm === '') {
      setFilteredEmprunts(emprunts);
    } else {
      setFilteredEmprunts(emprunts.filter(emprunt => 
        emprunt.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emprunt.emprunteur.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };
  
  // Livre CRUD operations
  const handleAddLivre = (newLivre: Livre) => {
    setLivres([...livres, newLivre]);
    setIsAddLivreModalOpen(false);
    toast({
      title: "Livre ajouté",
      description: "Le livre a été ajouté au catalogue avec succès."
    });
  };
  
  const handleEditLivre = (updatedLivre: Livre) => {
    setLivres(livres.map(livre => livre.id === updatedLivre.id ? updatedLivre : livre));
    setIsEditLivreModalOpen(false);
    toast({
      title: "Livre mis à jour",
      description: "Le livre a été mis à jour avec succès."
    });
  };
  
  const handleDeleteLivre = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      // Check if the book is currently borrowed
      const isEmprunte = emprunts.some(e => e.livre_id === id && (e.statut === "En cours" || e.statut === "En retard"));
      
      if (isEmprunte) {
        toast({
          title: "Action impossible",
          description: "Ce livre est actuellement emprunté et ne peut pas être supprimé.",
          variant: "destructive"
        });
        return;
      }
      
      setLivres(livres.filter(livre => livre.id !== id));
      // Also remove any emprunts related to this book
      setEmprunts(emprunts.filter(emprunt => emprunt.livre_id !== id));
      
      toast({
        title: "Livre supprimé",
        description: "Le livre a été supprimé du catalogue avec succès."
      });
    }
  };
  
  const handleEditLivreClick = (livre: Livre) => {
    setSelectedLivre(livre);
    setIsEditLivreModalOpen(true);
  };
  
  const handleLivreDetailsClick = (livre: Livre) => {
    setSelectedLivre(livre);
    setIsLivreDetailsModalOpen(true);
  };
  
  // Emprunt CRUD operations
  const handleAddEmprunt = (newEmprunt: Emprunt) => {
    setEmprunts([...emprunts, newEmprunt]);
    
    // Update livre disponible status
    setLivres(livres.map(livre => 
      livre.id === newEmprunt.livre_id 
        ? { ...livre, disponible: false }
        : livre
    ));
    
    setIsAddEmpruntModalOpen(false);
    toast({
      title: "Emprunt enregistré",
      description: "Le nouvel emprunt a été enregistré avec succès."
    });
  };
  
  const handleEditEmprunt = (updatedEmprunt: Emprunt) => {
    setEmprunts(emprunts.map(emprunt => 
      emprunt.id === updatedEmprunt.id ? updatedEmprunt : emprunt
    ));
    setIsEditEmpruntModalOpen(false);
    toast({
      title: "Emprunt mis à jour",
      description: "L'emprunt a été mis à jour avec succès."
    });
  };
  
  const handleDeleteEmprunt = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet emprunt ?")) {
      const empruntToDelete = emprunts.find(e => e.id === id);
      
      if (empruntToDelete && (empruntToDelete.statut === "En cours" || empruntToDelete.statut === "En retard")) {
        // Make the book available again
        setLivres(livres.map(livre => 
          livre.id === empruntToDelete.livre_id 
            ? { ...livre, disponible: true }
            : livre
        ));
      }
      
      setEmprunts(emprunts.filter(emprunt => emprunt.id !== id));
      toast({
        title: "Emprunt supprimé",
        description: "L'emprunt a été supprimé avec succès."
      });
    }
  };
  
  const handleEmpruntDetailsClick = (emprunt: Emprunt) => {
    setSelectedEmprunt(emprunt);
    setIsEmpruntDetailsModalOpen(true);
  };
  
  const handleEditEmpruntClick = (emprunt: Emprunt) => {
    setSelectedEmprunt(emprunt);
    setIsEditEmpruntModalOpen(true);
  };
  
  const handleMarkAsReturned = (id: number) => {
    const emprunt = emprunts.find(e => e.id === id);
    if (!emprunt) return;
    
    const updatedEmprunt = {
      ...emprunt,
      date_retour_reelle: new Date().toISOString().split('T')[0],
      statut: "Rendu" as const
    };
    
    // Update the emprunt
    setEmprunts(emprunts.map(e => e.id === id ? updatedEmprunt : e));
    
    // Make the livre available again
    setLivres(livres.map(livre => 
      livre.id === emprunt.livre_id 
        ? { ...livre, disponible: true }
        : livre
    ));
    
    toast({
      title: "Livre rendu",
      description: "L'emprunt a été marqué comme rendu avec succès."
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Bibliothèque</h2>
          <p className="text-muted-foreground">Gestion des livres et des emprunts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2" 
          >
            <Download size={16} />
            <span className="hidden md:inline">Exporter</span>
          </Button>
          {(activeTab === 'livres' || activeTab === 'emprunts') && (
            <Button 
              className="flex items-center gap-2"
              onClick={() => activeTab === 'livres' ? setIsAddLivreModalOpen(true) : setIsAddEmpruntModalOpen(true)}
            >
              <Plus size={16} />
              <span>
                {activeTab === 'livres' ? 'Ajouter un livre' : 'Nouvel emprunt'}
              </span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {(activeTab === 'livres' || activeTab === 'emprunts') && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={activeTab === 'livres' 
                    ? "Rechercher par titre, auteur ou catégorie..." 
                    : "Rechercher par titre ou emprunteur..."
                  }
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="livres" className="flex items-center gap-2">
              <BookOpenText size={16} />
              <span>Livres</span>
            </TabsTrigger>
            <TabsTrigger value="emprunts" className="flex items-center gap-2">
              <BookCopy size={16} />
              <span>Emprunts</span>
            </TabsTrigger>
            <TabsTrigger value="mes-emprunts" className="flex items-center gap-2">
              <Library size={16} />
              <span>Mes Emprunts</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="livres">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenText size={18} />
                  Catalogue de livres
                </CardTitle>
                <CardDescription>
                  {filteredLivres.length} livres disponibles dans la bibliothèque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-35rem)] w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Titre</TableHead>
                          <TableHead>Auteur</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>État</TableHead>
                          <TableHead>Disponibilité</TableHead>
                          <TableHead>Date d'ajout</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLivres.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Aucun livre trouvé
                            </TableCell>
                          </TableRow>
                        ) : filteredLivres.map((livre) => (
                          <TableRow key={livre.id}>
                            <TableCell>{livre.id}</TableCell>
                            <TableCell className="font-medium">{livre.titre}</TableCell>
                            <TableCell>{livre.auteur}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{livre.categorie}</Badge>
                            </TableCell>
                            <TableCell>{livre.etat}</TableCell>
                            <TableCell>
                              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                livre.disponible
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {livre.disponible
                                  ? <CircleCheck size={14} />
                                  : <CircleAlert size={14} />
                                }
                                {livre.disponible ? 'Disponible' : 'Emprunté'}
                              </span>
                            </TableCell>
                            <TableCell>{livre.date_ajout}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleLivreDetailsClick(livre)}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleEditLivreClick(livre)}
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleDeleteLivre(livre.id)}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emprunts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookCopy size={18} />
                  Gestion des emprunts
                </CardTitle>
                <CardDescription>
                  {filteredEmprunts.length} emprunts enregistrés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-35rem)] w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Titre du livre</TableHead>
                          <TableHead>Emprunteur</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead>Date d'emprunt</TableHead>
                          <TableHead>Date de retour prévue</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmprunts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Aucun emprunt trouvé
                            </TableCell>
                          </TableRow>
                        ) : filteredEmprunts.map((emprunt) => (
                          <TableRow key={emprunt.id}>
                            <TableCell>{emprunt.id}</TableCell>
                            <TableCell className="font-medium">{emprunt.titre}</TableCell>
                            <TableCell>{emprunt.emprunteur}</TableCell>
                            <TableCell>{emprunt.classe}</TableCell>
                            <TableCell>{formatDate(emprunt.date_emprunt)}</TableCell>
                            <TableCell>{formatDate(emprunt.date_retour_prevue)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                emprunt.statut === 'Rendu' 
                                  ? 'bg-green-100 text-green-800'
                                  : emprunt.statut === 'En retard'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {emprunt.statut}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleEmpruntDetailsClick(emprunt)}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleEditEmpruntClick(emprunt)}
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleDeleteEmprunt(emprunt.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                                {emprunt.statut !== 'Rendu' && (
                                  <Button 
                                    variant={emprunt.statut !== 'Rendu' ? 'default' : 'outline'} 
                                    size="sm"
                                    onClick={() => handleMarkAsReturned(emprunt.id)}
                                  >
                                    Marquer comme rendu
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mes-emprunts">
            <MesEmpruntsSection livres={livres} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Livres Modals */}
      <Dialog open={isAddLivreModalOpen} onOpenChange={setIsAddLivreModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau livre</DialogTitle>
            <DialogDescription>
              Renseignez les informations du livre à ajouter au catalogue
            </DialogDescription>
          </DialogHeader>
          <LivreForm 
            onSubmit={handleAddLivre}
            onCancel={() => setIsAddLivreModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditLivreModalOpen} onOpenChange={setIsEditLivreModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier un livre</DialogTitle>
            <DialogDescription>
              Modifiez les informations du livre
            </DialogDescription>
          </DialogHeader>
          {selectedLivre && (
            <LivreForm 
              livre={selectedLivre}
              onSubmit={handleEditLivre}
              onCancel={() => setIsEditLivreModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLivreDetailsModalOpen} onOpenChange={setIsLivreDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du livre</DialogTitle>
          </DialogHeader>
          {selectedLivre && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedLivre.titre}</h3>
                  <p className="text-muted-foreground">par {selectedLivre.auteur}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                    <Badge variant="outline">{selectedLivre.categorie}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">État</p>
                    <p>{selectedLivre.etat}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">ISBN</p>
                    <p>{selectedLivre.isbn}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date d'ajout</p>
                    <p>{selectedLivre.date_ajout}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Disponibilité</p>
                  <p className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLivre.disponible
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedLivre.disponible
                      ? <CircleCheck size={14} />
                      : <CircleAlert size={14} />
                    }
                    {selectedLivre.disponible ? 'Disponible' : 'Emprunté'}
                  </p>
                </div>
                
                {!selectedLivre.disponible && (
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">Informations d'emprunt</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      {emprunts
                        .filter(e => e.livre_id === selectedLivre.id && e.statut !== 'Rendu')
                        .map(emprunt => (
                          <div key={emprunt.id}>
                            <p className="text-sm">
                              Actuellement emprunté par <span className="font-medium">
                                {emprunt.emprunteur}
                              </span>
                            </p>
                            <p className="text-sm">
                              Retour prévu le {formatDate(emprunt.date_retour_prevue)}
                            </p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
            <Button onClick={() => {
              setIsLivreDetailsModalOpen(false);
              handleEditLivreClick(selectedLivre!);
            }}>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Emprunts Modals */}
      <Dialog open={isAddEmpruntModalOpen} onOpenChange={setIsAddEmpruntModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un nouvel emprunt</DialogTitle>
            <DialogDescription>
              Renseignez les informations de l'emprunt
            </DialogDescription>
          </DialogHeader>
          <EmpruntForm 
            livres={livres}
            onSubmit={handleAddEmprunt}
            onCancel={() => setIsAddEmpruntModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditEmpruntModalOpen} onOpenChange={setIsEditEmpruntModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier un emprunt</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'emprunt
            </DialogDescription>
          </DialogHeader>
          {selectedEmprunt && (
            <EmpruntForm 
              emprunt={selectedEmprunt}
              livres={livres}
              onSubmit={handleEditEmprunt}
              onCancel={() => setIsEditEmpruntModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEmpruntDetailsModalOpen} onOpenChange={setIsEmpruntDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'emprunt</DialogTitle>
          </DialogHeader>
          {selectedEmprunt && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedEmprunt.titre}</h3>
                  <p className="text-muted-foreground">
                    emprunté par {selectedEmprunt.emprunteur} ({selectedEmprunt.classe})
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date d'emprunt</p>
                    <p>{formatDate(selectedEmprunt.date_emprunt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date de retour prévue</p>
                    <p>{formatDate(selectedEmprunt.date_retour_prevue)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Statut</p>
                    <p className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedEmprunt.statut === 'Rendu' 
                        ? 'bg-green-100 text-green-800'
                        : selectedEmprunt.statut === 'En retard'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedEmprunt.statut}
                    </p>
                  </div>
                  {selectedEmprunt.date_retour_reelle && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date de retour réelle</p>
                      <p>{formatDate(selectedEmprunt.date_retour_reelle)}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Informations du livre</p>
                  <Card>
                    <CardContent className="p-3">
                      {livres
                        .filter(l => l.id === selectedEmprunt.livre_id)
                        .map(livre => (
                          <div key={livre.id} className="text-sm">
                            <p><span className="font-medium">Titre:</span> {livre.titre}</p>
                            <p><span className="font-medium">Auteur:</span> {livre.auteur}</p>
                            <p><span className="font-medium">Catégorie:</span> {livre.categorie}</p>
                            <p><span className="font-medium">État:</span> {livre.etat}</p>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
            {selectedEmprunt?.statut !== 'Rendu' && (
              <>
                <Button onClick={() => {
                  setIsEmpruntDetailsModalOpen(false);
                  handleEditEmpruntClick(selectedEmprunt);
                }} variant="outline">Modifier</Button>
                <Button onClick={() => {
                  handleMarkAsReturned(selectedEmprunt.id);
                  setIsEmpruntDetailsModalOpen(false);
                }}>Marquer comme rendu</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

export default Bibliotheque;
