
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Download, UserCog, ClipboardList, Clock, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import components and types
import { PersonnelMember, Contrat } from '@/components/rh/types';
import PersonnelTable from '@/components/rh/personnel/PersonnelTable';
import PersonnelForm from '@/components/rh/personnel/PersonnelForm';
import PersonnelDetails from '@/components/rh/personnel/PersonnelDetails';
import ContratsTable from '@/components/rh/contrats/ContratsTable';
import ContratForm from '@/components/rh/contrats/ContratForm';
import ContratPreview from '@/components/rh/contrats/ContratPreview';
import AbsencesStaticContent from '@/components/rh/absences/AbsencesStaticContent';
import PaieStaticContent from '@/components/rh/paie/PaieStaticContent';
import { generateMockPersonnel, generateMockContrats } from '@/components/rh/utils';

const RH: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personnel');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for data
  const [personnel, setPersonnel] = useState<PersonnelMember[]>([]);
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState<PersonnelMember[]>([]);
  const [filteredContrats, setFilteredContrats] = useState<Contrat[]>([]);
  
  // State for dialogs
  const [isAddPersonnelModalOpen, setIsAddPersonnelModalOpen] = useState(false);
  const [isEditPersonnelModalOpen, setIsEditPersonnelModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPersonne, setSelectedPersonne] = useState<PersonnelMember | null>(null);
  
  const [isAddContratModalOpen, setIsAddContratModalOpen] = useState(false);
  const [isEditContratModalOpen, setIsEditContratModalOpen] = useState(false);
  const [isPreviewContratModalOpen, setIsPreviewContratModalOpen] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);
  
  // Load initial data
  useEffect(() => {
    setPersonnel(generateMockPersonnel());
    setContrats(generateMockContrats());
  }, []);
  
  // Update filtered data when main data or search term changes
  useEffect(() => {
    filterPersonnel();
    filterContrats();
  }, [personnel, contrats, searchTerm, activeTab]);
  
  // Filtrer le personnel
  const filterPersonnel = () => {
    if (searchTerm === '') {
      setFilteredPersonnel(personnel);
    } else {
      setFilteredPersonnel(personnel.filter(personne => 
        personne.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personne.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personne.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personne.matieres.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    }
  };
  
  // Filtrer les contrats
  const filterContrats = () => {
    if (searchTerm === '') {
      setFilteredContrats(contrats);
    } else {
      setFilteredContrats(contrats.filter(contrat => 
        contrat.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contrat.type_contrat.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };
  
  // Personnel handlers
  const handleAddPersonnel = (newPersonnel: PersonnelMember) => {
    setPersonnel([...personnel, newPersonnel]);
    setIsAddPersonnelModalOpen(false);
    toast({
      title: "Personnel ajouté",
      description: "Le nouveau membre du personnel a été ajouté avec succès."
    });
  };
  
  const handleEditPersonnel = (updatedPersonnel: PersonnelMember) => {
    setPersonnel(personnel.map(p => p.id === updatedPersonnel.id ? updatedPersonnel : p));
    setIsEditPersonnelModalOpen(false);
    toast({
      title: "Personnel mis à jour",
      description: "Les informations du personnel ont été mises à jour avec succès."
    });
  };
  
  const handleDeletePersonnel = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre du personnel ?")) {
      setPersonnel(personnel.filter(p => p.id !== id));
      // Also delete associated contracts
      setContrats(contrats.filter(c => c.personnel_id !== id));
      toast({
        title: "Personnel supprimé",
        description: "Le membre du personnel a été supprimé avec succès."
      });
    }
  };
  
  const handleViewPersonnelDetails = (personne: PersonnelMember) => {
    setSelectedPersonne(personne);
    setIsDetailsModalOpen(true);
  };
  
  const handleEditPersonnelClick = (personne: PersonnelMember) => {
    setSelectedPersonne(personne);
    setIsEditPersonnelModalOpen(true);
  };
  
  // Contrats handlers
  const handleAddContrat = (newContrat: Contrat) => {
    setContrats([...contrats, newContrat]);
    setIsAddContratModalOpen(false);
    toast({
      title: "Contrat ajouté",
      description: "Le nouveau contrat a été ajouté avec succès."
    });
  };
  
  const handleEditContrat = (updatedContrat: Contrat) => {
    setContrats(contrats.map(c => c.id === updatedContrat.id ? updatedContrat : c));
    setIsEditContratModalOpen(false);
    toast({
      title: "Contrat mis à jour",
      description: "Le contrat a été mis à jour avec succès."
    });
  };
  
  const handleDeleteContrat = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      setContrats(contrats.filter(c => c.id !== id));
      toast({
        title: "Contrat supprimé",
        description: "Le contrat a été supprimé avec succès."
      });
    }
  };
  
  const handleViewContrat = (contrat: Contrat) => {
    setSelectedContrat(contrat);
    setIsPreviewContratModalOpen(true);
  };
  
  const handleEditContratClick = (contrat: Contrat) => {
    setSelectedContrat(contrat);
    setIsEditContratModalOpen(true);
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
              : activeTab === 'contrats'
              ? setIsAddContratModalOpen(true)
              : null
            }
          >
            <Plus size={16} />
            <span>
              {activeTab === 'personnel' ? 'Ajouter membre' : 
               activeTab === 'contrats' ? 'Nouveau contrat' : 'Ajouter'}
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
                  <PersonnelTable 
                    personnel={filteredPersonnel}
                    onViewDetails={handleViewPersonnelDetails}
                    onEdit={handleEditPersonnelClick}
                    onDelete={handleDeletePersonnel}
                  />
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
                  <ContratsTable 
                    contrats={filteredContrats}
                    onView={handleViewContrat}
                    onEdit={handleEditContratClick}
                    onDelete={handleDeleteContrat}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="absences">
            <AbsencesStaticContent />
          </TabsContent>
          
          <TabsContent value="paie">
            <PaieStaticContent />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modales Personnel */}
      <Dialog open={isAddPersonnelModalOpen} onOpenChange={setIsAddPersonnelModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un membre du personnel</DialogTitle>
          </DialogHeader>
          <PersonnelForm 
            onSubmit={handleAddPersonnel}
            onCancel={() => setIsAddPersonnelModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditPersonnelModalOpen} onOpenChange={setIsEditPersonnelModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier un membre du personnel</DialogTitle>
          </DialogHeader>
          {selectedPersonne && (
            <PersonnelForm 
              personnel={selectedPersonne}
              onSubmit={handleEditPersonnel}
              onCancel={() => setIsEditPersonnelModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du personnel</DialogTitle>
          </DialogHeader>
          {selectedPersonne && (
            <PersonnelDetails 
              personne={selectedPersonne}
              contrats={contrats}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                setIsEditPersonnelModalOpen(true);
              }}
              onClose={() => setIsDetailsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modales Contrats */}
      <Dialog open={isAddContratModalOpen} onOpenChange={setIsAddContratModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau contrat</DialogTitle>
          </DialogHeader>
          <ContratForm 
            personnel={personnel}
            onSubmit={handleAddContrat}
            onCancel={() => setIsAddContratModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditContratModalOpen} onOpenChange={setIsEditContratModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Modifier un contrat</DialogTitle>
          </DialogHeader>
          {selectedContrat && (
            <ContratForm 
              contrat={selectedContrat}
              personnel={personnel}
              onSubmit={handleEditContrat}
              onCancel={() => setIsEditContratModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPreviewContratModalOpen} onOpenChange={setIsPreviewContratModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-screen">
          <DialogHeader>
            <DialogTitle>Aperçu du contrat</DialogTitle>
          </DialogHeader>
          {selectedContrat && (
            <ContratPreview 
              contrat={selectedContrat}
              personnel={personnel.find(p => p.id === selectedContrat.personnel_id) || null}
              onClose={() => setIsPreviewContratModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RH;
