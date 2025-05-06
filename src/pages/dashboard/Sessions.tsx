
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
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Filter, Search, Edit, Trash2, Eye, X, CalendarDays } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  
  // Formulaire de session
  const sessionForm = useForm({
    defaultValues: {
      nom: '',
      dateDebut: '',
      dateFin: '',
      statut: 'Actif'
    }
  });
  
  // Formulaire de palier
  const palierForm = useForm({
    defaultValues: {
      nom: '',
      session: '',
      dateDebut: '',
      dateFin: '',
      statut: 'Planifié'
    }
  });
  
  // Formulaire de classe académique
  const classeForm = useForm({
    defaultValues: {
      classe: '',
      session: '',
      enseignant: '',
      capacite: 30,
      statut: 'Actif'
    }
  });
  
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
    sessionForm.reset({
      nom: '',
      dateDebut: '',
      dateFin: '',
      statut: 'Actif'
    });
    setIsSessionModalOpen(true);
  };
  
  const handleEditSession = (session: any) => {
    setSelectedItem(session);
    setIsEditing(true);
    
    // Convertir les dates au format YYYY-MM-DD pour l'input date
    const dateDebut = session.dateDebut.split('/').reverse().join('-');
    const dateFin = session.dateFin.split('/').reverse().join('-');
    
    sessionForm.reset({
      nom: session.nom,
      dateDebut: dateDebut,
      dateFin: dateFin,
      statut: session.statut
    });
    
    setIsSessionModalOpen(true);
  };
  
  const handleCreatePalier = () => {
    setSelectedItem(null);
    setIsEditing(false);
    palierForm.reset({
      nom: '',
      session: sessionsData.find(s => s.statut === 'Actif')?.nom || '',
      dateDebut: '',
      dateFin: '',
      statut: 'Planifié'
    });
    setIsPalierModalOpen(true);
  };
  
  const handleEditPalier = (palier: any) => {
    setSelectedItem(palier);
    setIsEditing(true);
    
    // Convertir les dates au format YYYY-MM-DD pour l'input date
    const dateDebut = palier.dateDebut.split('/').reverse().join('-');
    const dateFin = palier.dateFin.split('/').reverse().join('-');
    
    palierForm.reset({
      nom: palier.nom,
      session: palier.session,
      dateDebut: dateDebut,
      dateFin: dateFin,
      statut: palier.statut
    });
    
    setIsPalierModalOpen(true);
  };
  
  const handleCreateClasse = () => {
    setSelectedItem(null);
    setIsEditing(false);
    classeForm.reset({
      classe: '',
      session: sessionsData.find(s => s.statut === 'Actif')?.nom || '',
      enseignant: '',
      capacite: 30,
      statut: 'Actif'
    });
    setIsClasseModalOpen(true);
  };
  
  const handleEditClasse = (classe: any) => {
    setSelectedItem(classe);
    setIsEditing(true);
    
    classeForm.reset({
      classe: classe.classe,
      session: classe.session,
      enseignant: classe.enseignant,
      capacite: classe.capacite,
      statut: classe.statut
    });
    
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
    // Convertir les dates au format DD/MM/YYYY pour l'affichage
    const dateDebut = data.dateDebut.split('-').reverse().join('/');
    const dateFin = data.dateFin.split('-').reverse().join('/');
    
    if (isEditing && selectedItem) {
      // Mise à jour d'une session existante
      const updatedSessions = filteredSessions.map(session => 
        session.id === selectedItem.id ? 
        { ...session, nom: data.nom, dateDebut, dateFin, statut: data.statut } : 
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
        dateDebut,
        dateFin,
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
    // Convertir les dates au format DD/MM/YYYY pour l'affichage
    const dateDebut = data.dateDebut.split('-').reverse().join('/');
    const dateFin = data.dateFin.split('-').reverse().join('/');
    
    if (isEditing && selectedItem) {
      // Mise à jour d'un palier existant
      const updatedPaliers = filteredPaliers.map(palier => 
        palier.id === selectedItem.id ? 
        { ...palier, nom: data.nom, session: data.session, dateDebut, dateFin, statut: data.statut } : 
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
        dateDebut,
        dateFin,
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
          {/* Filtres pour sessions */}
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
          
          {showSessionsFilters && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Filtres</CardTitle>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setShowSessionsFilters(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher une session..."
                        className="pl-8"
                        value={sessionSearchTerm}
                        onChange={(e) => setSessionSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Select value={sessionStatut} onValueChange={setSessionStatut}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
                    <Button variant="outline" onClick={resetSessionsFilters}>Réinitialiser</Button>
                    <Button onClick={filterSessions}>Appliquer les filtres</Button>
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
          {/* Filtres pour paliers */}
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
          
          {showPaliersFilters && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Filtres</CardTitle>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setShowPaliersFilters(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher un palier..."
                        className="pl-8"
                        value={palierSearchTerm}
                        onChange={(e) => setPalierSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Select value={palierSession} onValueChange={setPalierSession}>
                      <SelectTrigger>
                        <SelectValue placeholder="Session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les sessions</SelectItem>
                        {sessionsData.map(session => (
                          <SelectItem key={session.id} value={session.nom}>{session.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={palierStatut} onValueChange={setPalierStatut}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Planifié">Planifié</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-3 flex justify-end gap-2">
                    <Button variant="outline" onClick={resetPaliersFilters}>Réinitialiser</Button>
                    <Button onClick={filterPaliers}>Appliquer les filtres</Button>
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
          {/* Filtres pour classes académiques */}
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
          
          {showClassesFilters && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Filtres</CardTitle>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setShowClassesFilters(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="pl-8"
                        value={classeSearchTerm}
                        onChange={(e) => setClasseSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Select value={classeSessionFilter} onValueChange={setClasseSessionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les sessions</SelectItem>
                        {sessionsData.map(session => (
                          <SelectItem key={session.id} value={session.nom}>{session.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={classeType} onValueChange={setClasseType}>
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
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Select value={classeStatut} onValueChange={setClasseStatut}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={resetClassesFilters}>Réinitialiser</Button>
                    <Button onClick={filterClasses}>Appliquer les filtres</Button>
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
          
          <Form {...sessionForm}>
            <form onSubmit={sessionForm.handleSubmit(onSubmitSession)} className="space-y-4">
              <FormField
                control={sessionForm.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la session</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Année scolaire 2024-2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={sessionForm.control}
                  name="dateDebut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={sessionForm.control}
                  name="dateFin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={sessionForm.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
              </DialogFooter>
            </form>
          </Form>
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
          
          <Form {...palierForm}>
            <form onSubmit={palierForm.handleSubmit(onSubmitPalier)} className="space-y-4">
              <FormField
                control={palierForm.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du palier</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Trimestre 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={palierForm.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionsData.map(session => (
                          <SelectItem key={session.id} value={session.nom}>{session.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={palierForm.control}
                  name="dateDebut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={palierForm.control}
                  name="dateFin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={palierForm.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Planifié">Planifié</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
              </DialogFooter>
            </form>
          </Form>
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
          
          <Form {...classeForm}>
            <form onSubmit={classeForm.handleSubmit(onSubmitClasse)} className="space-y-4">
              <FormField
                control={classeForm.control}
                name="classe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CP">CP</SelectItem>
                        <SelectItem value="CE1">CE1</SelectItem>
                        <SelectItem value="CE2">CE2</SelectItem>
                        <SelectItem value="CM1">CM1</SelectItem>
                        <SelectItem value="CM2">CM2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={classeForm.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionsData.map(session => (
                          <SelectItem key={session.id} value={session.nom}>{session.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={classeForm.control}
                name="enseignant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enseignant principal</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'enseignant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={classeForm.control}
                name="capacite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité d'accueil</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="100" 
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={classeForm.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Modale de confirmation pour la suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedItem && (
              <p>
                Vous êtes sur le point de supprimer{' '}
                {selectedItem.type === 'session' && `la session "${selectedItem.nom}"`}
                {selectedItem.type === 'palier' && `le palier "${selectedItem.nom}" de la session "${selectedItem.session}"`}
                {selectedItem.type === 'classe' && `la classe ${selectedItem.classe} de la session "${selectedItem.session}"`}
                .
              </p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sessions;

