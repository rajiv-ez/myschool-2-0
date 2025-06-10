
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
import { Plus, Filter, Edit, Trash2, CalendarDays } from 'lucide-react';
import { useAcademicData } from '@/hooks/useAcademicData';
import SessionForm from '@/components/forms/SessionForm';
import PalierForm from '@/components/forms/PalierForm';
import SessionFilters from '@/components/academic/SessionFilters';
import { Session, Palier } from '@/types/academic';

const Sessions: React.FC = () => {
  const { toast } = useToast();
  const { 
    sessions, 
    paliers, 
    classes,
    classeSessions,
    loading, 
    createSession, 
    updateSession, 
    deleteSession,
    createPalier,
    updatePalier,
    deletePalier,
    createClasseSession,
    updateClasseSession,
    deleteClasseSession
  } = useAcademicData();
  
  const [activeTab, setActiveTab] = useState('sessions');
  const [showFilters, setShowFilters] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isPalierModalOpen, setIsPalierModalOpen] = useState(false);
  const [isClasseModalOpen, setIsClasseModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedPalier, setSelectedPalier] = useState<Palier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États des filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('all');
  const [anneeFilter, setAnneeFilter] = useState('all');

  // Données filtrées
  const filteredSessions = useMemo(() => {
    let result = [...sessions];

    if (searchTerm) {
      result = result.filter(session =>
        session.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statutFilter !== 'all') {
      result = result.filter(session => 
        statutFilter === 'en_cours' ? session.en_cours : !session.en_cours
      );
    }

    if (anneeFilter !== 'all') {
      result = result.filter(session => 
        session.debut.includes(anneeFilter) || session.fin.includes(anneeFilter)
      );
    }

    return result;
  }, [sessions, searchTerm, statutFilter, anneeFilter]);

  const filteredPaliers = useMemo(() => {
    return paliers.filter(palier => {
      if (searchTerm) {
        const session = sessions.find(s => s.id === palier.session);
        return palier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
               session?.nom.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [paliers, sessions, searchTerm]);

  const classesWithSession = useMemo(() => {
    return classeSessions.map(cs => {
      const classe = classes.find(c => c.id === cs.classe);
      const session = sessions.find(s => s.id === cs.session);
      return {
        ...cs,
        classeData: classe,
        sessionData: session
      };
    }).filter(cs => cs.classeData && cs.sessionData);
  }, [classeSessions, classes, sessions]);

  const applyFilter = () => {
    // Les filtres sont appliqués automatiquement via useMemo
  };

  const resetFilter = () => {
    setSearchTerm('');
    setStatutFilter('all');
    setAnneeFilter('all');
  };

  const handleCreateSession = () => {
    setSelectedSession(null);
    setIsEditing(false);
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setIsEditing(true);
    setIsSessionModalOpen(true);
  };

  const handleDeleteSession = async (session: Session) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la session "${session.nom}" ?`)) {
      try {
        await deleteSession(session.id);
        toast({
          title: "Suppression réussie",
          description: "La session a été supprimée avec succès.",
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

  const handleCreatePalier = () => {
    setSelectedPalier(null);
    setIsEditing(false);
    setIsPalierModalOpen(true);
  };

  const handleEditPalier = (palier: Palier) => {
    setSelectedPalier(palier);
    setIsEditing(true);
    setIsPalierModalOpen(true);
  };

  const handleDeletePalier = async (palier: Palier) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le palier "${palier.nom}" ?`)) {
      try {
        await deletePalier(palier.id);
        toast({
          title: "Suppression réussie",
          description: "Le palier a été supprimé avec succès.",
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

  const handleSubmitSession = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedSession) {
        await updateSession(selectedSession.id, data);
        toast({
          title: "Modification réussie",
          description: "La session a été modifiée avec succès.",
        });
      } else {
        await createSession(data);
        toast({
          title: "Création réussie",
          description: "La session a été créée avec succès.",
        });
      }
      setIsSessionModalOpen(false);
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

  const handleSubmitPalier = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedPalier) {
        await updatePalier(selectedPalier.id, data);
        toast({
          title: "Modification réussie",
          description: "Le palier a été modifié avec succès.",
        });
      } else {
        await createPalier(data);
        toast({
          title: "Création réussie",
          description: "Le palier a été créé avec succès.",
        });
      }
      setIsPalierModalOpen(false);
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
          <CalendarDays className="h-5 w-5" />
          Sessions et Paliers
        </h2>
        <p className="text-muted-foreground">Gérez les sessions scolaires, les paliers et les classes académiques</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="sessions">Sessions ({filteredSessions.length})</TabsTrigger>
            <TabsTrigger value="paliers">Paliers ({filteredPaliers.length})</TabsTrigger>
            <TabsTrigger value="classes">Classes ({classesWithSession.length})</TabsTrigger>
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
            <Button 
              onClick={() => {
                if (activeTab === 'sessions') handleCreateSession();
                else if (activeTab === 'paliers') handleCreatePalier();
              }}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              {activeTab === 'sessions' ? 'Nouvelle session' : 
               activeTab === 'paliers' ? 'Nouveau palier' : 'Nouvelle classe'}
            </Button>
          </div>
        </div>

        {showFilters && (
          <SessionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statutFilter={statutFilter}
            setStatutFilter={setStatutFilter}
            anneeFilter={anneeFilter}
            setAnneeFilter={setAnneeFilter}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
            onClose={() => setShowFilters(false)}
          />
        )}
        
        <TabsContent value="sessions">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de la session</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Auto-activation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.nom}</TableCell>
                      <TableCell>{new Date(session.debut).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(session.fin).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.en_cours 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.en_cours ? 'En cours' : 'Terminé'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.auto_activer_palier 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.auto_activer_palier ? 'Activé' : 'Désactivé'}
                        </span>
                      </TableCell>
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
                            onClick={() => handleDeleteSession(session)}
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
        
        <TabsContent value="paliers">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du palier</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaliers.map((palier) => {
                    const session = sessions.find(s => s.id === palier.session);
                    return (
                      <TableRow key={palier.id}>
                        <TableCell className="font-medium">{palier.nom}</TableCell>
                        <TableCell>{session?.nom}</TableCell>
                        <TableCell>{new Date(palier.debut).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(palier.fin).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            palier.en_cours 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {palier.en_cours ? 'En cours' : 'Terminé'}
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
                              onClick={() => handleDeletePalier(palier)}
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

        <TabsContent value="classes">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classesWithSession.map((cs) => (
                    <TableRow key={cs.id}>
                      <TableCell className="font-medium">{cs.classeData?.nom}</TableCell>
                      <TableCell>{cs.sessionData?.nom}</TableCell>
                      <TableCell>{cs.capacite}</TableCell>
                      <TableCell>{cs.classeData?.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit size={16} />
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
        </TabsContent>
      </Tabs>

      <Dialog open={isSessionModalOpen} onOpenChange={setIsSessionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Modifier la session' : 'Créer une nouvelle session'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifiez les informations de la session' : 'Remplissez les informations pour créer une nouvelle session'}
            </DialogDescription>
          </DialogHeader>
          
          <SessionForm
            session={selectedSession || undefined}
            onSubmit={handleSubmitSession}
            onCancel={() => setIsSessionModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPalierModalOpen} onOpenChange={setIsPalierModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Modifier le palier' : 'Créer un nouveau palier'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifiez les informations du palier' : 'Remplissez les informations pour créer un nouveau palier'}
            </DialogDescription>
          </DialogHeader>
          
          <PalierForm
            palier={selectedPalier || undefined}
            sessions={sessions}
            onSubmit={handleSubmitPalier}
            onCancel={() => setIsPalierModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sessions;
