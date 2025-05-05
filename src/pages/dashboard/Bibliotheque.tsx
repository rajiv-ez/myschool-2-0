
import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Données fictives pour les livres
const livresData = [
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

// Données fictives pour les emprunts
const empruntsData = [
  {
    id: 101,
    livre_id: 3,
    titre: "Harry Potter à l'école des sorciers",
    emprunteur: "Sophie Mba",
    classe: "CM2",
    date_emprunt: "15/09/2023",
    date_retour_prevue: "15/10/2023",
    date_retour_reelle: null,
    statut: "En cours"
  },
  {
    id: 102,
    livre_id: 2,
    titre: "Le Petit Prince",
    emprunteur: "Jean Ondo",
    classe: "6ème",
    date_emprunt: "10/09/2023",
    date_retour_prevue: "10/10/2023",
    date_retour_reelle: "20/09/2023",
    statut: "Rendu"
  },
  {
    id: 103,
    livre_id: 5,
    titre: "Le Petit Nicolas",
    emprunteur: "Marie Ndong",
    classe: "CM1",
    date_emprunt: "05/09/2023",
    date_retour_prevue: "05/10/2023",
    date_retour_reelle: null,
    statut: "En retard"
  }
];

const Bibliotheque: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('livres');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLivres, setFilteredLivres] = useState(livresData);
  const [filteredEmprunts, setFilteredEmprunts] = useState(empruntsData);
  
  const [isAddLivreModalOpen, setIsAddLivreModalOpen] = useState(false);
  const [isAddEmpruntModalOpen, setIsAddEmpruntModalOpen] = useState(false);
  const [isLivreDetailsModalOpen, setIsLivreDetailsModalOpen] = useState(false);
  const [isEmpruntDetailsModalOpen, setIsEmpruntDetailsModalOpen] = useState(false);
  const [selectedLivre, setSelectedLivre] = useState<typeof livresData[0] | null>(null);
  const [selectedEmprunt, setSelectedEmprunt] = useState<typeof empruntsData[0] | null>(null);
  
  // Filtrer les livres
  const filterLivres = () => {
    if (searchTerm === '') {
      setFilteredLivres(livresData);
    } else {
      setFilteredLivres(livresData.filter(livre => 
        livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livre.categorie.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };
  
  // Filtrer les emprunts
  const filterEmprunts = () => {
    if (searchTerm === '') {
      setFilteredEmprunts(empruntsData);
    } else {
      setFilteredEmprunts(empruntsData.filter(emprunt => 
        emprunt.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emprunt.emprunteur.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };
  
  React.useEffect(() => {
    if (activeTab === 'livres') {
      filterLivres();
    } else {
      filterEmprunts();
    }
  }, [searchTerm, activeTab]);
  
  // Ouvrir la modale de détails du livre
  const handleLivreDetailsClick = (livre: typeof livresData[0]) => {
    setSelectedLivre(livre);
    setIsLivreDetailsModalOpen(true);
  };
  
  // Ouvrir la modale de détails de l'emprunt
  const handleEmpruntDetailsClick = (emprunt: typeof empruntsData[0]) => {
    setSelectedEmprunt(emprunt);
    setIsEmpruntDetailsModalOpen(true);
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
          <Button 
            className="flex items-center gap-2"
            onClick={() => activeTab === 'livres' ? setIsAddLivreModalOpen(true) : setIsAddEmpruntModalOpen(true)}
          >
            <Plus size={16} />
            <span>
              {activeTab === 'livres' ? 'Ajouter un livre' : 'Nouvel emprunt'}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="livres" className="flex items-center gap-2">
              <BookOpenText size={16} />
              <span>Livres</span>
            </TabsTrigger>
            <TabsTrigger value="emprunts" className="flex items-center gap-2">
              <BookCopy size={16} />
              <span>Emprunts</span>
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
                        {filteredLivres.map((livre) => (
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
                                <Button variant="outline" size="icon">
                                  <Pencil size={16} />
                                </Button>
                                <Button variant="outline" size="icon">
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
                        {filteredEmprunts.map((emprunt) => (
                          <TableRow key={emprunt.id}>
                            <TableCell>{emprunt.id}</TableCell>
                            <TableCell className="font-medium">{emprunt.titre}</TableCell>
                            <TableCell>{emprunt.emprunteur}</TableCell>
                            <TableCell>{emprunt.classe}</TableCell>
                            <TableCell>{emprunt.date_emprunt}</TableCell>
                            <TableCell>{emprunt.date_retour_prevue}</TableCell>
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
                                <Button variant="outline" size="icon">
                                  <Pencil size={16} />
                                </Button>
                                <Button 
                                  variant={emprunt.statut !== 'Rendu' ? 'default' : 'outline'} 
                                  size="sm"
                                  disabled={emprunt.statut === 'Rendu'}
                                >
                                  {emprunt.statut === 'Rendu' ? 'Rendu' : 'Marquer comme rendu'}
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
        </Tabs>
      </div>
      
      {/* Modale d'ajout de livre */}
      <Dialog open={isAddLivreModalOpen} onOpenChange={setIsAddLivreModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau livre</DialogTitle>
            <DialogDescription>
              Renseignez les informations du livre à ajouter au catalogue
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="titre">Titre du livre</label>
              <Input id="titre" placeholder="Titre du livre" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="auteur">Auteur</label>
                <Input id="auteur" placeholder="Nom de l'auteur" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="categorie">Catégorie</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roman">Roman</SelectItem>
                    <SelectItem value="conte">Conte</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="jeunesse">Jeunesse</SelectItem>
                    <SelectItem value="reference">Référence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="isbn">ISBN</label>
                <Input id="isbn" placeholder="Numéro ISBN" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="etat">État</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neuf">Neuf</SelectItem>
                    <SelectItem value="bon">Bon état</SelectItem>
                    <SelectItem value="use">Usé</SelectItem>
                    <SelectItem value="abime">Abîmé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={() => {
              setIsAddLivreModalOpen(false);
              toast({
                title: "Livre ajouté",
                description: "Le livre a été ajouté au catalogue avec succès."
              });
            }}>Ajouter le livre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale d'ajout d'emprunt */}
      <Dialog open={isAddEmpruntModalOpen} onOpenChange={setIsAddEmpruntModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un nouvel emprunt</DialogTitle>
            <DialogDescription>
              Renseignez les informations de l'emprunt
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="livre">Livre</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent>
                  {livresData
                    .filter(livre => livre.disponible)
                    .map(livre => (
                      <SelectItem key={livre.id} value={livre.id.toString()}>
                        {livre.titre}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="emprunteur">Nom de l'emprunteur</label>
                <Input id="emprunteur" placeholder="Nom et prénom" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="classe">Classe</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CP">CP</SelectItem>
                    <SelectItem value="CE1">CE1</SelectItem>
                    <SelectItem value="CE2">CE2</SelectItem>
                    <SelectItem value="CM1">CM1</SelectItem>
                    <SelectItem value="CM2">CM2</SelectItem>
                    <SelectItem value="6eme">6ème</SelectItem>
                    <SelectItem value="5eme">5ème</SelectItem>
                    <SelectItem value="4eme">4ème</SelectItem>
                    <SelectItem value="3eme">3ème</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date_emprunt">Date d'emprunt</label>
                <Input id="date_emprunt" type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date_retour">Date de retour prévue</label>
                <Input id="date_retour" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={() => {
              setIsAddEmpruntModalOpen(false);
              toast({
                title: "Emprunt enregistré",
                description: "Le nouvel emprunt a été enregistré avec succès."
              });
            }}>Enregistrer l'emprunt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale de détails du livre */}
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
                      <p className="text-sm">
                        Actuellement emprunté par <span className="font-medium">
                          {empruntsData.find(e => e.livre_id === selectedLivre.id)?.emprunteur}
                        </span>
                      </p>
                      <p className="text-sm">
                        Retour prévu le{' '}
                        {empruntsData.find(e => e.livre_id === selectedLivre.id)?.date_retour_prevue}
                      </p>
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
            <Button>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale de détails de l'emprunt */}
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
                    <p>{selectedEmprunt.date_emprunt}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date de retour prévue</p>
                    <p>{selectedEmprunt.date_retour_prevue}</p>
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
                      <p>{selectedEmprunt.date_retour_reelle}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
            {selectedEmprunt?.statut !== 'Rendu' && (
              <Button onClick={() => {
                setIsEmpruntDetailsModalOpen(false);
                toast({
                  title: "Livre rendu",
                  description: "L'emprunt a été marqué comme rendu avec succès."
                });
              }}>Marquer comme rendu</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bibliotheque;
