
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Filter, Edit, Trash2, CalendarDays } from 'lucide-react';
import { parse } from 'date-fns';

// Import des composants refactorisés
import FilterSessions from '@/components/sessions/FilterSessions';
import FilterPaliers from '@/components/sessions/FilterPaliers';
import FilterClasses from '@/components/sessions/FilterClasses';
import SessionForm from '@/components/sessions/SessionForm';
import PalierForm from '@/components/sessions/PalierForm';
import ClasseForm from '@/components/sessions/ClasseForm';
import DeleteConfirmation from '@/components/sessions/DeleteConfirmation';

// Données fictives pour démonstration
const sessionsData = [
  { 
    id: 1, 
    nom: 'Année scolaire 2024-2025', 
    dateDebut: '15/09/2024', 
    dateFin: '30/06/2025',
    statut: 'Actif',
    paliers: 5
  },
  { 
    id: 2, 
    nom: 'Année scolaire 2023-2024', 
    dateDebut: '18/09/2023', 
    dateFin: '28/06/2024',
    statut: 'Terminé',
    paliers: 5
  },
  { 
    id: 3, 
    nom: 'Année scolaire 2022-2023', 
    dateDebut: '19/09/2022', 
    dateFin: '30/06/2023',
    statut: 'Terminé',
    paliers: 5
  }
];

// Nouvelle définition des paliers comme subdivisions d'une session
const paliersData = [
  { 
    id: 1, 
    nom: 'Trimestre 1', 
    session: 'Année scolaire 2024-2025', 
    dateDebut: '15/09/2024',
    dateFin: '15/12/2024',
    statut: 'Actif'
  },
  { 
    id: 2, 
    nom: 'Trimestre 2', 
    session: 'Année scolaire 2024-2025', 
    dateDebut: '16/12/2024',
    dateFin: '15/03/2025',
    statut: 'Planifié'
  },
  { 
    id: 3, 
    nom: 'Trimestre 3', 
    session: 'Année scolaire 2024-2025', 
    dateDebut: '16/03/2025',
    dateFin: '30/06/2025',
    statut: 'Planifié'
  },
  { 
    id: 4, 
    nom: 'Trimestre 1', 
    session: 'Année scolaire 2023-2024', 
    dateDebut: '18/09/2023',
    dateFin: '15/12/2023',
    statut: 'Terminé'
  },
  { 
    id: 5, 
    nom: 'Trimestre 2', 
    session: 'Année scolaire 2023-2024', 
    dateDebut: '16/12/2023',
    dateFin: '15/03/2024',
    statut: 'Terminé'
  }
];

// Données pour les classes académiques
const classesAcademiquesData = [
  { 
    id: 1, 
    classe: 'CP', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'Mme Ntoutoume',
    eleves: 25,
    capacite: 30,
    statut: 'Actif'
  },
  { 
    id: 2, 
    classe: 'CE1', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'M. Ekomi',
    eleves: 23,
    capacite: 28,
    statut: 'Actif'
  },
  { 
    id: 3, 
    classe: 'CE2', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'Mme Abessolo',
    eleves: 22,
    capacite: 25,
    statut: 'Actif'
  },
  { 
    id: 4, 
    classe: 'CM1', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'M. Mboumba',
    eleves: 20,
    capacite: 24,
    statut: 'Actif'
  },
  { 
    id: 5, 
    classe: 'CM2', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'Mme Ovono',
    eleves: 24,
    capacite: 26,
    statut: 'Actif'
  }
];

const Sessions: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sessions');
  
  // États pour la gestion des filtres
  const [showSessionsFilters, setShowSessionsFilters] = useState(false);
  const [showPaliersFilters, setShowPaliersFilters] = useState(false);
  const [showClassesFilters, setShowClassesFilters] = useState(false);
  
  // États pour les données filtrées
  const [filteredSessions, setFilteredSessions] = useState(sessionsData);
  const [filteredPaliers, setFilteredPaliers] = useState(paliersData);
  const [filteredClasses, setFilteredClasses] = useState(classesAcademiquesData);
  
  // États pour les modales
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isPalierModalOpen, setIsPalierModalOpen] = useState(false);
  const [isClasseModalOpen, setIsClasseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // État pour l'élément sélectionné (session, palier ou classe)
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Gestion des filtres pour les sessions
  const [sessionSearchTerm, setSessionSearchTerm] = useState('');
  const [sessionStatut, setSessionStatut] = useState('all');
  
  // Gestion des filtres pour les paliers
  const [palierSearchTerm, setPalierSearchTerm] = useState('');
  const [palierSession, setPalierSession] = useState('all');
  const [palierStatut, setPalierStatut] = useState('all');
  
  // Gestion des filtres pour les classes académiques
  const [classeSearchTerm, setClasseSearchTerm] = useState('');
  const [classeSessionFilter, setClasseSessionFilter] = useState('all');
  const [classeType, setClasseType] = useState('all');
  const [classeStatut, setClasseStatut] = useState('all');

  // Fonction pour filtrer les sessions
  const filterSessions = () => {
    let result = [...sessionsData];
    
    if (sessionSearchTerm) {
      result = result.filter(session => 
        session.nom.toLowerCase().includes(sessionSearchTerm.toLowerCase())
      );
    }
    
    if (sessionStatut !== 'all') {
      result = result.filter(session => session.statut === sessionStatut);
    }
    
    setFilteredSessions(result);
  };
  
  // Fonction pour filtrer les paliers
  const filterPaliers = () => {
    let result = [...paliersData];
    
    if (palierSearchTerm) {
      result = result.filter(palier => 
        palier.nom.toLowerCase().includes(palierSearchTerm.toLowerCase())
      );
    }
    
    if (palierSession !== 'all') {
      result = result.filter(palier => palier.session === palierSession);
    }
    
    if (palierStatut !== 'all') {
      result = result.filter(palier => palier.statut === palierStatut);
    }
    
    setFilteredPaliers(result);
  };
  
  // Fonction pour filtrer les classes académiques
  const filterClasses = () => {
    let result = [...classesAcademiquesData];
    
    if (classeSearchTerm) {
      result = result.filter(classe => 
        classe.classe.toLowerCase().includes(classeSearchTerm.toLowerCase()) ||
        classe.enseignant.toLowerCase().includes(classeSearchTerm.toLowerCase())
      );
    }
    
    if (classeSessionFilter !== 'all') {
      result = result.filter(classe => classe.session === classeSessionFilter);
    }
    
    if (classeType !== 'all') {
      result = result.filter(classe => classe.classe === classeType);
    }
    
    if (classeStatut !== 'all') {
      result = result.filter(classe => classe.statut === classeStatut);
    }
    
    setFilteredClasses(result);
  };
  
  // Réinitialiser les filtres
  const resetSessionsFilters = () => {
    setSessionSearchTerm('');
    setSessionStatut('all');
    setFilteredSessions(sessionsData);
  };
  
  const resetPaliersFilters = () => {
    setPalierSearchTerm('');
    setPalierSession('all');
    setPalierStatut('all');
    setFilteredPaliers(paliersData);
  };
  
  const resetClassesFilters = () => {
    setClasseSearchTerm('');
    setClasseSessionFilter('all');
    setClasseType('all');
    setClasseStatut('all');
    setFilteredClasses(classesAcademiquesData);
  };
  
  // Handlers pour les modales
  const handleCreateSession = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsSessionModalOpen(true);
  };
  
  const handleEditSession = (session: any) => {
    setSelectedItem(session);
    setIsEditing(true);
    setIsSessionModalOpen(true);
  };
  
  const handleCreatePalier = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsPalierModalOpen(true);
  };
  
  const handleEditPalier = (palier: any) => {
    setSelectedItem(palier);
    setIsEditing(true);
    setIsPalierModalOpen(true);
  };
  
  const handleCreateClasse = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setIsClasseModalOpen(true);
  };
  
  const handleEditClasse = (classe: any) => {
    setSelectedItem(classe);
    setIsEditing(true);
    setIsClasseModalOpen(true);
  };
  
  const handleDelete = (item: any, type: 'session' | 'palier' | 'classe') => {
    setSelectedItem({ ...item, type });
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (!selectedItem) return;
    
    switch (selectedItem.type) {
      case 'session':
        setFilteredSessions(filteredSessions.filter(s => s.id !== selectedItem.id));
        break;
      case 'palier':
        setFilteredPaliers(filteredPaliers.filter(p => p.id !== selectedItem.id));
        break;
      case 'classe':
        setFilteredClasses(filteredClasses.filter(c => c.id !== selectedItem.id));
        break;
    }
    
    toast({
      title: "Suppression réussie",
      description: `L'élément a été supprimé avec succès.`,
    });
    
    setIsDeleteModalOpen(false);
  };
  
  const onSubmitSession = (data: any) => {
    if (isEditing && selectedItem) {
      // Mise à jour d'une session existante
      const updatedSessions = filteredSessions.map(session => 
        session.id === selectedItem.id ? 
        { ...session, nom: data.nom, dateDebut: data.dateDebut, dateFin: data.dateFin, statut: data.statut } : 
        session
      );
      setFilteredSessions(updatedSessions);
      
      toast({
        title: "Session mise à jour",
        description: "La session a été mise à jour avec succès.",
      });
    } else {
      // Création d'une nouvelle session
      const newSession = {
        id: Math.max(...filteredSessions.map(s => s.id)) + 1,
        nom: data.nom,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
        statut: data.statut,
        paliers: 0
      };
      
      setFilteredSessions([...filteredSessions, newSession]);
      
      toast({
        title: "Session créée",
        description: "La nouvelle session a été créée avec succès.",
      });
    }
    
    setIsSessionModalOpen(false);
  };
  
  const onSubmitPalier = (data: any) => {
    if (isEditing && selectedItem) {
      // Mise à jour d'un palier existant
      const updatedPaliers = filteredPaliers.map(palier => 
        palier.id === selectedItem.id ? 
        { ...palier, nom: data.nom, session: data.session, dateDebut: data.dateDebut, dateFin: data.dateFin, statut: data.statut } : 
        palier
      );
      setFilteredPaliers(updatedPaliers);
      
      toast({
        title: "Palier mis à jour",
        description: "Le palier a été mis à jour avec succès.",
      });
    } else {
      // Création d'un nouveau palier
      const newPalier = {
        id: Math.max(...filteredPaliers.map(p => p.id)) + 1,
        nom: data.nom,
        session: data.session,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
        statut: data.statut
      };
      
      setFilteredPaliers([...filteredPaliers, newPalier]);
      
      // Mettre à jour le compteur de paliers pour la session concernée
      const updatedSessions = filteredSessions.map(session => 
        session.nom === data.session ? 
        { ...session, paliers: session.paliers + 1 } : 
        session
      );
      setFilteredSessions(updatedSessions);
      
      toast({
        title: "Palier créé",
        description: "Le nouveau palier a été créé avec succès.",
      });
    }
    
    setIsPalierModalOpen(false);
  };
  
  const onSubmitClasse = (data: any) => {
    if (isEditing && selectedItem) {
      // Mise à jour d'une classe existante
      const updatedClasses = filteredClasses.map(classe => 
        classe.id === selectedItem.id ? 
        { 
          ...classe, 
          classe: data.classe, 
          session: data.session, 
          enseignant: data.enseignant, 
          capacite: data.capacite,
          statut: data.statut,
          eleves: classe.eleves // Conserver le nombre d'élèves actuels
        } : 
        classe
      );
      setFilteredClasses(updatedClasses);
      
      toast({
        title: "Classe mise à jour",
        description: "La classe académique a été mise à jour avec succès.",
      });
    } else {
      // Création d'une nouvelle classe
      const newClasse = {
        id: Math.max(...filteredClasses.map(c => c.id)) + 1,
        classe: data.classe,
        session: data.session,
        enseignant: data.enseignant,
        eleves: 0, // Pas d'élèves au départ
        capacite: data.capacite,
        statut: data.statut
      };
      
      setFilteredClasses([...filteredClasses, newClasse]);
      
      toast({
        title: "Classe créée",
        description: "La nouvelle classe académique a été créée avec succès.",
      });
    }
    
    setIsClasseModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Sessions et Paliers</h2>
        <p className="text-muted-foreground">Gérez les sessions scolaires, les paliers et les classes académiques</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="paliers">Paliers</TabsTrigger>
            <TabsTrigger value="classes">Classes académiques</TabsTrigger>
          </TabsList>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              if (activeTab === 'sessions') handleCreateSession();
              else if (activeTab === 'paliers') handleCreatePalier();
              else handleCreateClasse();
            }}
          >
            <Plus size={18} />
            {activeTab === 'sessions' ? 'Nouvelle session' : 
             activeTab === 'paliers' ? 'Nouveau palier' : 'Nouvelle classe'}
          </Button>
        </div>
        
        {/* Onglet Sessions */}
        <TabsContent value="sessions">
          {/* Bouton de filtres */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowSessionsFilters(!showSessionsFilters)}
            >
              <Filter size={16} />
              Filtres
            </Button>
          </div>
          
          {/* Filtres pour sessions */}
          {showSessionsFilters && (
            <FilterSessions 
              searchTerm={sessionSearchTerm}
              setSearchTerm={setSessionSearchTerm}
              sessionStatut={sessionStatut}
              setSessionStatut={setSessionStatut}
              applyFilter={filterSessions}
              resetFilter={resetSessionsFilters}
              onClose={() => setShowSessionsFilters(false)}
            />
          )}
          
          {/* Table des sessions */}
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom de la session</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paliers</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.id}</TableCell>
                      <TableCell className="font-medium">{session.nom}</TableCell>
                      <TableCell>{session.dateDebut}</TableCell>
                      <TableCell>{session.dateFin}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.statut === 'Actif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.statut}
                        </span>
                      </TableCell>
                      <TableCell>{session.paliers}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(session, 'session')}
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
        
        {/* Onglet Paliers */}
        <TabsContent value="paliers">
          {/* Bouton de filtres */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowPaliersFilters(!showPaliersFilters)}
            >
              <Filter size={16} />
              Filtres
            </Button>
          </div>
          
          {/* Filtres pour paliers */}
          {showPaliersFilters && (
            <FilterPaliers 
              searchTerm={palierSearchTerm}
              setSearchTerm={setPalierSearchTerm}
              sessionFilter={palierSession}
              setSessionFilter={setPalierSession}
              statutFilter={palierStatut}
              setStatutFilter={setPalierStatut}
              sessions={sessionsData}
              applyFilter={filterPaliers}
              resetFilter={resetPaliersFilters}
              onClose={() => setShowPaliersFilters(false)}
            />
          )}
          
          {/* Table des paliers */}
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom du palier</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaliers.map((palier) => (
                    <TableRow key={palier.id}>
                      <TableCell>{palier.id}</TableCell>
                      <TableCell className="font-medium">{palier.nom}</TableCell>
                      <TableCell>{palier.session}</TableCell>
                      <TableCell>{palier.dateDebut}</TableCell>
                      <TableCell>{palier.dateFin}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          palier.statut === 'Actif' 
                            ? 'bg-green-100 text-green-800' 
                            : palier.statut === 'Planifié'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {palier.statut}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditPalier(palier)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(palier, 'palier')}
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
        
        {/* Onglet Classes académiques */}
        <TabsContent value="classes">
          {/* Bouton de filtres */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowClassesFilters(!showClassesFilters)}
            >
              <Filter size={16} />
              Filtres
            </Button>
          </div>
          
          {/* Filtres pour classes académiques */}
          {showClassesFilters && (
            <FilterClasses 
              searchTerm={classeSearchTerm}
              setSearchTerm={setClasseSearchTerm}
              sessionFilter={classeSessionFilter}
              setSessionFilter={setClasseSessionFilter}
              classeType={classeType}
              setClasseType={setClasseType}
              statutFilter={classeStatut}
              setStatutFilter={setClasseStatut}
              sessions={sessionsData}
              applyFilter={filterClasses}
              resetFilter={resetClassesFilters}
              onClose={() => setShowClassesFilters(false)}
            />
          )}
          
          {/* Table des classes académiques */}
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Enseignant principal</TableHead>
                    <TableHead>Élèves/Capacité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((classe) => (
                    <TableRow key={classe.id}>
                      <TableCell>{classe.id}</TableCell>
                      <TableCell className="font-medium">{classe.classe}</TableCell>
                      <TableCell>{classe.session}</TableCell>
                      <TableCell>{classe.enseignant}</TableCell>
                      <TableCell>{classe.eleves}/{classe.capacite}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          classe.statut === 'Actif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {classe.statut}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditClasse(classe)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(classe, 'classe')}
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
      
      {/* Modale pour créer/modifier une session */}
      <Dialog open={isSessionModalOpen} onOpenChange={setIsSessionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier la session' : 'Créer une nouvelle session'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifiez les détails de la session' : 'Remplissez les informations pour créer une nouvelle session scolaire'}
            </DialogDescription>
          </DialogHeader>
          
          <SessionForm
            isEditing={isEditing}
            selectedItem={selectedItem}
            onSubmit={onSubmitSession}
            onCancel={() => setIsSessionModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modale pour créer/modifier un palier */}
      <Dialog open={isPalierModalOpen} onOpenChange={setIsPalierModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier le palier' : 'Créer un nouveau palier'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifiez les détails du palier' : 'Remplissez les informations pour créer un nouveau palier'}
            </DialogDescription>
          </DialogHeader>
          
          <PalierForm
            isEditing={isEditing}
            selectedItem={selectedItem}
            sessions={sessionsData}
            existingPaliers={paliersData}
            onSubmit={onSubmitPalier}
            onCancel={() => setIsPalierModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modale pour créer/modifier une classe académique */}
      <Dialog open={isClasseModalOpen} onOpenChange={setIsClasseModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier la classe académique' : 'Créer une nouvelle classe académique'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifiez les détails de la classe académique' : 'Remplissez les informations pour créer une nouvelle classe académique'}
            </DialogDescription>
          </DialogHeader>
          
          <ClasseForm
            isEditing={isEditing}
            selectedItem={selectedItem}
            sessions={sessionsData}
            onSubmit={onSubmitClasse}
            onCancel={() => setIsClasseModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modale de confirmation pour la suppression */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemType={selectedItem?.type || ''}
        itemName={selectedItem?.nom || selectedItem?.classe || ''}
        itemDetails={selectedItem?.session}
      />
    </div>
  );
};

export default Sessions;
