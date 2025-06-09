
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
import { Inscription, ClasseSession, Session, Classe, Specialite, Filiere, Niveau } from '@/types/academic';

// Données fictives basées sur les vrais types
const sessionsData: Session[] = [
  { id: 1, nom: '2024-2025', debut: '2024-09-01', fin: '2025-06-30', en_cours: true, auto_activer_palier: true },
  { id: 2, nom: '2023-2024', debut: '2023-09-01', fin: '2024-06-30', en_cours: false, auto_activer_palier: false },
];

const niveauxData: Niveau[] = [
  { id: 1, nom: 'Primaire' },
  { id: 2, nom: 'Collège' },
  { id: 3, nom: 'Lycée' },
];

const filieresData: Filiere[] = [
  { id: 1, niveau: 1, nom: 'Générale', description: 'Formation générale primaire' },
  { id: 2, niveau: 2, nom: 'Générale', description: 'Formation générale collège' },
  { id: 3, niveau: 3, nom: 'Scientifique', description: 'Formation scientifique' },
  { id: 4, niveau: 3, nom: 'Littéraire', description: 'Formation littéraire' },
];

const specialitesData: Specialite[] = [
  { id: 1, filiere: 1, nom: 'Standard', description: 'Formation standard primaire' },
  { id: 2, filiere: 2, nom: 'Standard', description: 'Formation standard collège' },
  { id: 3, filiere: 3, nom: 'Mathématiques', description: 'Spécialité mathématiques' },
  { id: 4, filiere: 4, nom: 'Philosophie', description: 'Spécialité philosophie' },
];

const classesData: Classe[] = [
  { id: 1, specialite: 1, nom: 'CP', description: 'Cours Préparatoire' },
  { id: 2, specialite: 1, nom: 'CE1', description: 'Cours Élémentaire 1' },
  { id: 3, specialite: 2, nom: '6ème', description: 'Sixième' },
  { id: 4, specialite: 3, nom: 'Terminale S', description: 'Terminale Scientifique' },
];

const classeSessionsData: ClasseSession[] = [
  { id: 1, classe: 1, session: 1, capacite: 30 },
  { id: 2, classe: 2, session: 1, capacite: 28 },
  { id: 3, classe: 3, session: 1, capacite: 25 },
  { id: 4, classe: 4, session: 1, capacite: 32 },
];

const inscriptionsData: Inscription[] = [
  { 
    id: 1, 
    eleve: 1, 
    classe_session: 1, 
    date_inscription: '2024-08-12', 
    est_reinscription: false, 
    statut: 'CONFIRMEE' 
  },
  { 
    id: 2, 
    eleve: 2, 
    classe_session: 2, 
    date_inscription: '2024-08-15', 
    est_reinscription: true, 
    statut: 'CONFIRMEE' 
  },
  { 
    id: 3, 
    eleve: 3, 
    classe_session: 3, 
    date_inscription: '2024-08-10', 
    est_reinscription: false, 
    statut: 'EN_ATTENTE' 
  },
  { 
    id: 4, 
    eleve: 4, 
    classe_session: 4, 
    date_inscription: '2024-08-18', 
    est_reinscription: true, 
    statut: 'CONFIRMEE' 
  },
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
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);

  // Fonctions utilitaires pour obtenir les noms
  const getClasseSessionName = (classeSessionId: number) => {
    const classeSession = classeSessionsData.find(cs => cs.id === classeSessionId);
    if (!classeSession) return 'Inconnue';
    
    const classe = classesData.find(c => c.id === classeSession.classe);
    const session = sessionsData.find(s => s.id === classeSession.session);
    return `${classe?.nom || 'Inconnue'} (${session?.nom || 'Inconnue'})`;
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return 'Confirmée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  };
  
  // Appliquer les filtres
  const applyFilters = () => {
    let result = [...inscriptionsData];
    
    // Filtrer par terme de recherche (sur l'ID de l'élève pour l'instant)
    if (searchTerm) {
      result = result.filter(item => 
        item.id.toString().includes(searchTerm) || 
        item.eleve.toString().includes(searchTerm)
      );
    }
    
    // Filtrer par session
    if (selectedSession !== 'all') {
      const sessionId = parseInt(selectedSession);
      result = result.filter(item => {
        const classeSession = classeSessionsData.find(cs => cs.id === item.classe_session);
        return classeSession?.session === sessionId;
      });
    }
    
    // Filtrer par classe
    if (selectedClasse !== 'all') {
      const classeId = parseInt(selectedClasse);
      result = result.filter(item => {
        const classeSession = classeSessionsData.find(cs => cs.id === item.classe_session);
        return classeSession?.classe === classeId;
      });
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
  
  // Gestionnaires d'événements
  const handleDetailsClick = (inscription: Inscription) => {
    setSelectedInscription(inscription);
    setIsDetailsModalOpen(true);
  };
  
  const handleEditClick = (inscription: Inscription) => {
    setSelectedInscription(inscription);
    setIsEditModalOpen(true);
  };
  
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleDeleteClick = (inscription: Inscription) => {
    setSelectedInscription(inscription);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedInscription) {
      const updatedData = filteredData.filter(item => item.id !== selectedInscription.id);
      setFilteredData(updatedData);
      setIsDeleteModalOpen(false);
      
      toast({
        title: "Inscription supprimée",
        description: `L'inscription ID ${selectedInscription.id} a été supprimée.`,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inscriptions</h2>
          <p className="text-muted-foreground">Gérez les inscriptions des élèves pour les sessions</p>
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
                    placeholder="Rechercher par ID..."
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
                    {sessionsData.map(session => (
                      <SelectItem key={session.id} value={session.id.toString()}>
                        {session.nom}
                      </SelectItem>
                    ))}
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
                    {classesData.map(classe => (
                      <SelectItem key={classe.id} value={classe.id.toString()}>
                        {classe.nom}
                      </SelectItem>
                    ))}
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
                    <SelectItem value="CONFIRMEE">Confirmée</SelectItem>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    <SelectItem value="ANNULEE">Annulée</SelectItem>
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
                <TableHead>Élève ID</TableHead>
                <TableHead>Classe/Session</TableHead>
                <TableHead>Date inscription</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((inscription) => (
                <TableRow key={inscription.id}>
                  <TableCell>{inscription.id}</TableCell>
                  <TableCell className="font-medium">{inscription.eleve}</TableCell>
                  <TableCell>{getClasseSessionName(inscription.classe_session)}</TableCell>
                  <TableCell>{new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inscription.est_reinscription 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {inscription.est_reinscription ? 'Réinscription' : 'Nouvelle'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(inscription.statut)}`}>
                      {getStatutLabel(inscription.statut)}
                    </span>
                  </TableCell>
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
                <p className="text-sm font-medium text-muted-foreground">Élève ID</p>
                <p>{selectedInscription.eleve}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Classe/Session</p>
                <p>{getClasseSessionName(selectedInscription.classe_session)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{new Date(selectedInscription.date_inscription).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p>{selectedInscription.est_reinscription ? 'Réinscription' : 'Nouvelle'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Statut</p>
                <p>{getStatutLabel(selectedInscription.statut)}</p>
              </div>
              {selectedInscription.decision_conseil && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Décision conseil</p>
                  <p>{selectedInscription.decision_conseil}</p>
                </div>
              )}
              {selectedInscription.motif_reinscription && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Motif réinscription</p>
                  <p>{selectedInscription.motif_reinscription}</p>
                </div>
              )}
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
                Vous êtes sur le point de supprimer l'inscription ID{' '}
                <span className="font-semibold">{selectedInscription.id}</span>{' '}
                pour l'élève ID {selectedInscription.eleve}.
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
