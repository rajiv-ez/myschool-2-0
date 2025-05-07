
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import FraisTable from './FraisTable';
import FraisForm from './FraisForm';
import FraisSearch from './FraisSearch';
import { FraisScolaire, Session, Palier } from './FraisScolaireTypes';

const FraisScolaires: React.FC = () => {
  const { toast } = useToast();
  const [fraisList, setFraisList] = useState<FraisScolaire[]>([
    { 
      id: '1', 
      nom: 'Frais d\'inscription', 
      description: 'Frais d\'inscription pour l\'année scolaire', 
      sessionId: '1',
      montant: 50000 
    },
    { 
      id: '2', 
      nom: 'Mensualité Octobre', 
      description: 'Mensualité pour le mois d\'octobre', 
      sessionId: '1',
      palierId: '1',
      montant: 25000 
    },
    { 
      id: '3', 
      nom: 'Tenue scolaire', 
      description: 'Uniforme obligatoire', 
      sessionId: '1',
      quantite: 50,
      montant: 15000 
    },
  ]);

  // Sample data for sessions and paliers
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', name: 'Année scolaire 2023-2024', paliers: [
      { id: '1', name: 'Trimestre 1', sessionId: '1' },
      { id: '2', name: 'Trimestre 2', sessionId: '1' },
      { id: '3', name: 'Trimestre 3', sessionId: '1' },
    ]},
    { id: '2', name: 'Année scolaire 2024-2025', paliers: [
      { id: '4', name: 'Trimestre 1', sessionId: '2' },
      { id: '5', name: 'Trimestre 2', sessionId: '2' },
    ]},
  ]);

  // State for the form dialog
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFrais, setCurrentFrais] = useState<FraisScolaire | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  // Form values
  const [formValues, setFormValues] = useState<Omit<FraisScolaire, 'id'>>({
    nom: '',
    description: '',
    sessionId: '',
    montant: 0
  });

  // Filter paliers based on selected session
  const filteredPaliers = selectedSessionId 
    ? sessions.find(s => s.id === selectedSessionId)?.paliers || []
    : [];

  // Reset form values
  const resetForm = () => {
    setFormValues({
      nom: '',
      description: '',
      sessionId: '',
      montant: 0
    });
    setSelectedSessionId('');
    setCurrentFrais(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.nom || !formValues.description || !formValues.sessionId || formValues.montant <= 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (currentFrais) {
      // Update existing
      setFraisList(prev => prev.map(f => 
        f.id === currentFrais.id ? { ...formValues, id: currentFrais.id } : f
      ));
      toast({
        title: "Frais mis à jour",
        description: `${formValues.nom} a été mis à jour avec succès`
      });
    } else {
      // Create new
      const newFrais: FraisScolaire = {
        ...formValues,
        id: uuidv4()
      };
      setFraisList(prev => [...prev, newFrais]);
      toast({
        title: "Frais ajouté",
        description: `${formValues.nom} a été ajouté avec succès`
      });
    }

    setIsOpen(false);
    resetForm();
  };

  // Handle edit action
  const handleEdit = (frais: FraisScolaire) => {
    setCurrentFrais(frais);
    setFormValues({
      nom: frais.nom,
      description: frais.description,
      sessionId: frais.sessionId,
      palierId: frais.palierId,
      quantite: frais.quantite,
      montant: frais.montant
    });
    setSelectedSessionId(frais.sessionId);
    setIsOpen(true);
  };

  // Handle delete action
  const handleDelete = (id: string) => {
    const fraisToDelete = fraisList.find(f => f.id === id);
    if (fraisToDelete) {
      setFraisList(prev => prev.filter(f => f.id !== id));
      toast({
        title: "Frais supprimé",
        description: `${fraisToDelete.nom} a été supprimé`
      });
    }
  };

  // Filter frais based on search query
  const filteredFrais = fraisList.filter(frais => 
    frais.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frais.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get session and palier names for display
  const getSessionName = (id: string) => {
    return sessions.find(s => s.id === id)?.name || '';
  };

  const getPalierName = (sessionId: string, palierId?: string) => {
    if (!palierId) return '-';
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return '-';
    return session.paliers.find(p => p.id === palierId)?.name || '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <FraisSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsOpen(true);
            }}>
              <Plus size={16} />
              <span>Ajouter un frais</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{currentFrais ? "Modifier un frais" : "Ajouter un frais"}</DialogTitle>
            </DialogHeader>
            <FraisForm 
              formValues={formValues}
              setFormValues={setFormValues}
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              setSelectedSessionId={setSelectedSessionId}
              filteredPaliers={filteredPaliers}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
              isEditing={!!currentFrais}
            />
          </DialogContent>
        </Dialog>
      </div>

      <FraisTable 
        fraisList={filteredFrais}
        getSessionName={getSessionName}
        getPalierName={getPalierName}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default FraisScolaires;
