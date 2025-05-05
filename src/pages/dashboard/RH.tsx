
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
  UserCog, 
  Search, 
  Plus, 
  Pencil, 
  Eye, 
  Trash2, 
  Download, 
  UserCircle2, 
  GraduationCap, 
  Clock,
  ClipboardList,
  FileSpreadsheet
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Données fictives pour le personnel
const personnelData = [
  {
    id: 1,
    nom: "Assoumou",
    prenom: "Jean",
    poste: "Enseignant",
    matiere: "Mathématiques",
    niveau: "CM1, CM2",
    email: "j.assoumou@ecole.com",
    telephone: "074 01 23 45",
    date_embauche: "01/09/2020",
    statut: "Actif"
  },
  {
    id: 2,
    nom: "Ndong",
    prenom: "Marie",
    poste: "Enseignante",
    matiere: "Français",
    niveau: "CE1, CE2",
    email: "m.ndong@ecole.com",
    telephone: "066 12 34 56",
    date_embauche: "01/09/2018",
    statut: "Actif"
  },
  {
    id: 3,
    nom: "Obiang",
    prenom: "Paul",
    poste: "Directeur",
    matiere: "",
    niveau: "",
    email: "p.obiang@ecole.com",
    telephone: "077 98 76 54",
    date_embauche: "01/09/2015",
    statut: "Actif"
  },
  {
    id: 4,
    nom: "Mba",
    prenom: "Sophie",
    poste: "Secrétaire",
    matiere: "",
    niveau: "",
    email: "s.mba@ecole.com",
    telephone: "066 45 67 89",
    date_embauche: "15/10/2021",
    statut: "Actif"
  },
  {
    id: 5,
    nom: "Ondo",
    prenom: "Pierre",
    poste: "Enseignant",
    matiere: "Histoire-Géographie",
    niveau: "6ème, 5ème",
    email: "p.ondo@ecole.com",
    telephone: "074 56 78 90",
    date_embauche: "01/09/2019",
    statut: "En congé"
  }
];

// Données fictives pour les contrats
const contratsData = [
  {
    id: 101,
    personnel_id: 1,
    nom_complet: "Jean Assoumou",
    type_contrat: "CDI",
    date_debut: "01/09/2020",
    date_fin: "",
    salaire: "450 000 FCFA",
    statut: "Actif"
  },
  {
    id: 102,
    personnel_id: 2,
    nom_complet: "Marie Ndong",
    type_contrat: "CDI",
    date_debut: "01/09/2018",
    date_fin: "",
    salaire: "450 000 FCFA",
    statut: "Actif"
  },
  {
    id: 103,
    personnel_id: 3,
    nom_complet: "Paul Obiang",
    type_contrat: "CDI",
    date_debut: "01/09/2015",
    date_fin: "",
    salaire: "750 000 FCFA",
    statut: "Actif"
  },
  {
    id: 104,
    personnel_id: 4,
    nom_complet: "Sophie Mba",
    type_contrat: "CDD",
    date_debut: "15/10/2021",
    date_fin: "15/10/2023",
    salaire: "350 000 FCFA",
    statut: "Actif"
  },
  {
    id: 105,
    personnel_id: 5,
    nom_complet: "Pierre Ondo",
    type_contrat: "CDI",
    date_debut: "01/09/2019",
    date_fin: "",
    salaire: "450 000 FCFA",
    statut: "Actif"
  }
];

const RH: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personnel');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPersonnel, setFilteredPersonnel] = useState(personnelData);
  const [filteredContrats, setFilteredContrats] = useState(contratsData);
  
  const [isAddPersonnelModalOpen, setIsAddPersonnelModalOpen] = useState(false);
  const [isAddContratModalOpen, setIsAddContratModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState<typeof personnelData[0] | null>(null);
  
  // Filtrer le personnel
  const filterPersonnel = () => {
    if (searchTerm === '') {
      setFilteredPersonnel(personnelData);
    } else {
      setFilteredPersonnel(personnelData.filter(personne => 
        personne.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personne.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personne.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personne.matiere.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };
  
  // Filtrer les contrats
  const filterContrats = () => {
    if (searchTerm === '') {
      setFilteredContrats(contratsData);
    } else {
      setFilteredContrats(contratsData.filter(contrat => 
        contrat.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contrat.type_contrat.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };
  
  // Appliquer les filtres en fonction de l'onglet actif
  React.useEffect(() => {
    if (activeTab === 'personnel') {
      filterPersonnel();
    } else if (activeTab === 'contrats') {
      filterContrats();
    }
  }, [searchTerm, activeTab]);
  
  // Ouvrir la modale de détails d'un membre du personnel
  const handleDetailsClick = (personne: typeof personnelData[0]) => {
    setSelectedPersonne(personne);
    setIsDetailsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Ressources Humaines</h2>
          <p className="text-muted-foreground">Gestion du personnel et des contrats</p>
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
            onClick={() => activeTab === 'personnel' 
              ? setIsAddPersonnelModalOpen(true) 
              : setIsAddContratModalOpen(true)
            }
          >
            <Plus size={16} />
            <span>
              {activeTab === 'personnel' ? 'Ajouter membre' : 'Nouveau contrat'}
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
                placeholder={activeTab === 'personnel' 
                  ? "Rechercher par nom, prénom, poste..." 
                  : "Rechercher un contrat..."
                }
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="personnel" className="flex items-center gap-2">
              <UserCog size={16} />
              <span>Personnel</span>
            </TabsTrigger>
            <TabsTrigger value="contrats" className="flex items-center gap-2">
              <ClipboardList size={16} />
              <span>Contrats</span>
            </TabsTrigger>
            <TabsTrigger value="absences" className="flex items-center gap-2">
              <Clock size={16} />
              <span>Absences</span>
            </TabsTrigger>
            <TabsTrigger value="paie" className="flex items-center gap-2">
              <FileSpreadsheet size={16} />
              <span>Paie</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personnel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog size={18} />
                  Personnel de l'école
                </CardTitle>
                <CardDescription>
                  {filteredPersonnel.length} membres du personnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-35rem)] w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Prénom</TableHead>
                          <TableHead>Poste</TableHead>
                          <TableHead>Matière</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPersonnel.map((personne) => (
                          <TableRow key={personne.id}>
                            <TableCell>{personne.id}</TableCell>
                            <TableCell className="font-medium">{personne.nom}</TableCell>
                            <TableCell>{personne.prenom}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{personne.poste}</Badge>
                            </TableCell>
                            <TableCell>{personne.matiere || '-'}</TableCell>
                            <TableCell>{personne.email}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                personne.statut === 'Actif' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {personne.statut}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleDetailsClick(personne)}
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
          
          <TabsContent value="contrats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList size={18} />
                  Contrats
                </CardTitle>
                <CardDescription>
                  Gestion des contrats du personnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-35rem)] w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nom complet</TableHead>
                          <TableHead>Type de contrat</TableHead>
                          <TableHead>Date de début</TableHead>
                          <TableHead>Date de fin</TableHead>
                          <TableHead>Salaire</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContrats.map((contrat) => (
                          <TableRow key={contrat.id}>
                            <TableCell>{contrat.id}</TableCell>
                            <TableCell className="font-medium">{contrat.nom_complet}</TableCell>
                            <TableCell>{contrat.type_contrat}</TableCell>
                            <TableCell>{contrat.date_debut}</TableCell>
                            <TableCell>{contrat.date_fin || 'Indéterminé'}</TableCell>
                            <TableCell>{contrat.salaire}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                contrat.statut === 'Actif' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {contrat.statut}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon">
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
          
          <TabsContent value="absences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={18} />
                  Gestion des absences
                </CardTitle>
                <CardDescription>
                  Suivi des absences, congés et remplacements
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-60">
                <div className="text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Module en développement</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Le module de gestion des absences sera bientôt disponible.
                  </p>
                  <Button className="mt-4" onClick={() => {
                    toast({
                      title: "Fonctionnalité à venir",
                      description: "Ce module est actuellement en développement."
                    });
                  }}>
                    Me notifier quand c'est prêt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="paie">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet size={18} />
                  Gestion de la paie
                </CardTitle>
                <CardDescription>
                  Préparation des fiches de paie et des salaires
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-60">
                <div className="text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Module en développement</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Le module de gestion de la paie sera bientôt disponible.
                  </p>
                  <Button className="mt-4" onClick={() => {
                    toast({
                      title: "Fonctionnalité à venir",
                      description: "Ce module est actuellement en développement."
                    });
                  }}>
                    Me notifier quand c'est prêt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modale d'ajout de personnel */}
      <Dialog open={isAddPersonnelModalOpen} onOpenChange={setIsAddPersonnelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un membre du personnel</DialogTitle>
            <DialogDescription>
              Renseignez les informations du nouveau membre du personnel
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="nom">Nom</label>
                <Input id="nom" placeholder="Nom" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="prenom">Prénom</label>
                <Input id="prenom" placeholder="Prénom" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="poste">Poste</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enseignant">Enseignant</SelectItem>
                    <SelectItem value="directeur">Directeur</SelectItem>
                    <SelectItem value="secretaire">Secrétaire</SelectItem>
                    <SelectItem value="comptable">Comptable</SelectItem>
                    <SelectItem value="surveillant">Surveillant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="matiere">Matière</label>
                <Input id="matiere" placeholder="Si enseignant" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="example@ecole.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="telephone">Téléphone</label>
                <Input id="telephone" placeholder="074 XX XX XX" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date_embauche">Date d'embauche</label>
                <Input id="date_embauche" type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="niveau">Niveau enseigné</label>
                <Input id="niveau" placeholder="Si enseignant" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={() => {
              setIsAddPersonnelModalOpen(false);
              toast({
                title: "Personnel ajouté",
                description: "Le nouveau membre du personnel a été ajouté avec succès."
              });
            }}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale d'ajout de contrat */}
      <Dialog open={isAddContratModalOpen} onOpenChange={setIsAddContratModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau contrat</DialogTitle>
            <DialogDescription>
              Renseignez les informations du nouveau contrat
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="personnel">Personnel</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une personne" />
                </SelectTrigger>
                <SelectContent>
                  {personnelData.map(personne => (
                    <SelectItem key={personne.id} value={personne.id.toString()}>
                      {personne.prenom} {personne.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="type_contrat">Type de contrat</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdi">CDI</SelectItem>
                    <SelectItem value="cdd">CDD</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="salaire">Salaire</label>
                <Input id="salaire" placeholder="Montant en FCFA" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date_debut">Date de début</label>
                <Input id="date_debut" type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date_fin">Date de fin</label>
                <Input id="date_fin" type="date" placeholder="Si CDD" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={() => {
              setIsAddContratModalOpen(false);
              toast({
                title: "Contrat ajouté",
                description: "Le nouveau contrat a été ajouté avec succès."
              });
            }}>Ajouter le contrat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale de détails du personnel */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du personnel</DialogTitle>
          </DialogHeader>
          {selectedPersonne && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted">
                  <UserCircle2 className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedPersonne.prenom} {selectedPersonne.nom}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedPersonne.poste}</Badge>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPersonne.statut === 'Actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedPersonne.statut}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedPersonne.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                  <p>{selectedPersonne.telephone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date d'embauche</p>
                  <p>{selectedPersonne.date_embauche}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Ancienneté</p>
                  <p>4 ans</p>
                </div>
              </div>
              
              {selectedPersonne.poste === 'Enseignant' && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">Enseignements</p>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <GraduationCap size={16} className="text-muted-foreground" />
                      <span>Matière : {selectedPersonne.matiere}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <UserCircle2 size={16} className="text-muted-foreground" />
                      <span>Niveaux : {selectedPersonne.niveau}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-3 rounded-md bg-muted">
                <h4 className="text-sm font-semibold mb-2">Contrat actuel</h4>
                {contratsData.find(c => c.personnel_id === selectedPersonne.id) ? (
                  <div className="text-sm">
                    <p>Type : {contratsData.find(c => c.personnel_id === selectedPersonne.id)?.type_contrat}</p>
                    <p>Salaire : {contratsData.find(c => c.personnel_id === selectedPersonne.id)?.salaire}</p>
                  </div>
                ) : (
                  <p className="text-sm">Aucun contrat associé</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
            <Button onClick={() => {
              setIsDetailsModalOpen(false);
              // Rediriger vers la page d'édition ou ouvrir la modale d'édition
              toast({
                title: "Modification",
                description: "Vous pouvez maintenant modifier les informations du personnel."
              });
            }}>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RH;
