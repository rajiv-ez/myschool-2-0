
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Filter, 
  Download, 
  Eye, 
  Pencil, 
  Trash2, 
  X,
  Search
} from 'lucide-react';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import InscriptionForm from '@/components/forms/InscriptionForm';

// Données fictives pour les classes académiques (utilisant le nouveau format)
const classesAcademiquesData = [
  { 
    id: 1, 
    classe: 'CP', 
    session: '2024-2025', 
    enseignant: 'Mme Ntoutoume',
    eleves: 25,
    capacite: 30,
    statut: 'Actif'
  },
  { 
    id: 2, 
    classe: 'CE1', 
    session: '2024-2025', 
    enseignant: 'M. Ekomi',
    eleves: 23,
    capacite: 28,
    statut: 'Actif'
  },
  { 
    id: 3, 
    classe: 'CE2', 
    session: '2024-2025', 
    enseignant: 'Mme Abessolo',
    eleves: 22,
    capacite: 25,
    statut: 'Actif'
  },
  { 
    id: 4, 
    classe: 'CM1', 
    session: '2024-2025', 
    enseignant: 'M. Mboumba',
    eleves: 20,
    capacite: 24,
    statut: 'Actif'
  },
  { 
    id: 5, 
    classe: 'CM2', 
    session: '2024-2025', 
    enseignant: 'Mme Ovono',
    eleves: 24,
    capacite: 26,
    statut: 'Actif'
  }
];

// Données fictives pour les inscriptions
const inscriptionsData = [
  { 
    id: 1, 
    nom: 'Ndong', 
    prenom: 'Marie', 
    classe: 'CM1', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '12/08/2024' 
  },
  { 
    id: 2, 
    nom: 'Obiang', 
    prenom: 'Paul', 
    classe: 'CE2', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '15/08/2024' 
  },
  { 
    id: 3, 
    nom: 'Mba', 
    prenom: 'Sophie', 
    classe: 'CM2', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '10/08/2024' 
  },
  { 
    id: 4, 
    nom: 'Ondo', 
    prenom: 'Jean', 
    classe: '6ème', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '18/08/2024' 
  },
  { 
    id: 5, 
    nom: 'Mintsa', 
    prenom: 'Lucie', 
    classe: '5ème', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '05/08/2024' 
  },
  { 
    id: 6, 
    nom: 'Mengue', 
    prenom: 'Pierre', 
    classe: 'CE1', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '20/08/2024' 
  },
  { 
    id: 7, 
    nom: 'Assoumou', 
    prenom: 'Jacques', 
    classe: 'CM1', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '22/08/2024' 
  },
  { 
    id: 8, 
    nom: 'Ekomi', 
    prenom: 'Alice', 
    classe: 'CE2', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '14/08/2024' 
  },
  { 
    id: 9, 
    nom: 'Nzoghe', 
    prenom: 'Robert', 
    classe: 'CP', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '09/08/2024' 
  },
  { 
    id: 10, 
    nom: 'Abessolo', 
    prenom: 'Christine', 
    classe: '4ème', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '17/08/2024' 
  }
];

const Inscriptions: React.FC = () => {
  const { toast } = useToast();
  const [filteredData, setFilteredData] = useState(inscriptionsData);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('all');
  const [selectedClasse, setSelectedClasse] = useState('all');
  const [selectedStatut, setSelectedStatut] = useState('all');
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState<typeof inscriptionsData[0] | null>(null);
  
  // Appliquer les filtres
  const applyFilters = () => {
    let result = [...inscriptionsData];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par session
    if (selectedSession !== 'all') {
      result = result.filter(item => item.session === selectedSession);
    }
    
    // Filtrer par classe
    if (selectedClasse !== 'all') {
      result = result.filter(item => item.classe === selectedClasse);
    }
    
    // Filtrer par statut
    if (selectedStatut !== 'all') {
      result = result.filter(item => item.statut === selectedStatut);
    }
    
    setFilteredData(result);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSession('all');
    setSelectedClasse('all');
    setSelectedStatut('all');
    setFilteredData(inscriptionsData);
  };
  
  // Ouvrir la modale de détails
  const handleDetailsClick = (inscription: typeof inscriptionsData[0]) => {
    setSelectedInscription(inscription);
    setIsDetailsModalOpen(true);
  };
  
  // Ouvrir la modale d'édition
  const handleEditClick = (inscription: typeof inscriptionsData[0]) => {
    setSelectedInscription(inscription);
    setIsEditModalOpen(true);
  };
  
  // Ouvrir la modale de création
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  
  // Ouvrir la modale de suppression
  const handleDeleteClick = (inscription: typeof inscriptionsData[0]) => {
    setSelectedInscription(inscription);
    setIsDeleteModalOpen(true);
  };
  
  // Simuler la suppression
  const handleConfirmDelete = () => {
    if (selectedInscription) {
      // Simuler la suppression en filtrant la liste
      const updatedData = filteredData.filter(item => item.id !== selectedInscription.id);
      setFilteredData(updatedData);
      setIsDeleteModalOpen(false);
      
      toast({
        title: "Inscription supprimée",
        description: `L'inscription de ${selectedInscription.prenom} ${selectedInscription.nom} a été supprimée.`,
      });
    }
  };
  
  // Gérer la soumission du formulaire de création
  const handleCreateSubmit = (data: any) => {
    // Créer une nouvelle inscription
    const newInscription = {
      id: Math.max(...filteredData.map(item => item.id)) + 1,
      nom: data.nom,
      prenom: data.prenom,
      classe: data.classe,
      session: data.session,
      statut: data.statut,
      date: data.date
    };
    
    // Ajouter à la liste
    setFilteredData([...filteredData, newInscription]);
    
    // Mettre à jour le nombre d'élèves dans la classe académique
    // (Ceci serait normalement géré par le back-end)
    
    toast({
      title: "Inscription créée",
      description: `L'inscription de ${data.prenom} ${data.nom} a été créée avec succès.`,
    });
    
    setIsCreateModalOpen(false);
  };
  
  // Gérer la soumission du formulaire d'édition
  const handleEditSubmit = (data: any) => {
    if (selectedInscription) {
      // Mettre à jour l'inscription
      const updatedData = filteredData.map(item => 
        item.id === selectedInscription.id ? 
        { 
          ...item, 
          nom: data.nom,
          prenom: data.prenom,
          classe: data.classe,
          session: data.session,
          statut: data.statut,
          date: data.date
        } : 
        item
      );
      
      setFilteredData(updatedData);
      
      toast({
        title: "Inscription mise à jour",
        description: `L'inscription de ${data.prenom} ${data.nom} a été mise à jour avec succès.`,
      });
      
      setIsEditModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inscriptions et réinscriptions</h2>
          <p className="text-muted-foreground">Gérez les inscriptions des élèves pour l'année scolaire</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtres
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Exporter
          </Button>
          <Button className="flex items-center gap-2" onClick={handleCreateClick}>
            <UserPlus size={16} />
            Nouvelle inscription
          </Button>
        </div>
      </div>
      
      {/* Section des filtres */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Filtres</CardTitle>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => setShowFilters(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un élève..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sessions</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    <SelectItem value="CP">CP</SelectItem>
                    <SelectItem value="CE1">CE1</SelectItem>
                    <SelectItem value="CE2">CE2</SelectItem>
                    <SelectItem value="CM1">CM1</SelectItem>
                    <SelectItem value="CM2">CM2</SelectItem>
                    <SelectItem value="6ème">6ème</SelectItem>
                    <SelectItem value="5ème">5ème</SelectItem>
                    <SelectItem value="4ème">4ème</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Nouvelle">Nouvelle</SelectItem>
                    <SelectItem value="Réinscription">Réinscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="lg:col-span-5 flex justify-end gap-2">
                <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
                <Button onClick={applyFilters}>Appliquer les filtres</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <ScrollArea className="h-[calc(100vh-25rem)]">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((inscription) => (
                <TableRow key={inscription.id}>
                  <TableCell>{inscription.id}</TableCell>
                  <TableCell className="font-medium">{inscription.nom}</TableCell>
                  <TableCell>{inscription.prenom}</TableCell>
                  <TableCell>{inscription.classe}</TableCell>
                  <TableCell>{inscription.session}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inscription.statut === 'Nouvelle' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {inscription.statut}
                    </span>
                  </TableCell>
                  <TableCell>{inscription.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDetailsClick(inscription)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditClick(inscription)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteClick(inscription)}
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
      
      {/* Modale des détails */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'inscription</DialogTitle>
            <DialogDescription>
              Informations complètes concernant cette inscription
            </DialogDescription>
          </DialogHeader>
          {selectedInscription && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p>{selectedInscription.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{selectedInscription.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p>{selectedInscription.nom}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Prénom</p>
                <p>{selectedInscription.prenom}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Classe</p>
                <p>{selectedInscription.classe}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Session</p>
                <p>{selectedInscription.session}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Statut</p>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedInscription.statut === 'Nouvelle' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedInscription.statut}
                  </span>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Fermer</Button>
            <Button onClick={() => {
              setIsDetailsModalOpen(false);
              handleEditClick(selectedInscription!);
            }}>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modale de création */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle inscription</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle inscription
            </DialogDescription>
          </DialogHeader>
          <InscriptionForm 
            isEditing={false}
            selectedInscription={null}
            classesAcademiques={classesAcademiquesData}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modale d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'inscription</DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette inscription
            </DialogDescription>
          </DialogHeader>
          <InscriptionForm 
            isEditing={true}
            selectedInscription={selectedInscription}
            classesAcademiques={classesAcademiquesData}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modale de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer l'inscription</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette inscription ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          {selectedInscription && (
            <div className="py-4">
              <p>
                Vous êtes sur le point de supprimer l'inscription de{' '}
                <span className="font-semibold">{selectedInscription.prenom} {selectedInscription.nom}</span>{' '}
                en classe de {selectedInscription.classe} pour la session {selectedInscription.session}.
              </p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inscriptions;
