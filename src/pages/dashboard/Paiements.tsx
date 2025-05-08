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
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, FileText, FileCheck, AlertTriangle, Search, Plus, Edit, Trash2, Printer, Calendar, Euro } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Interfaces
interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classe: string;
}

interface Frais {
  id: string;
  nom: string;
  montant: number;
  sessionId: string;
  palierId?: string;
}

interface Session {
  id: string;
  nom: string;
}

interface Palier {
  id: string;
  nom: string;
  sessionId: string;
}

interface Tuteur {
  id: string;
  nom: string;
  prenom: string;
}

interface Inscription {
  id: string;
  eleveId: string;
  sessionId: string;
  classeId: string;
  classeNom: string;
}

interface Paiement {
  id: string;
  inscriptionId: string;
  eleve: string;
  classe: string;
  fraisId: string;
  fraisNom: string;
  montant: number;
  montantPaye: number;
  tuteurId?: string;
  autreTuteur?: string;
  moyenPaiement: 'Espèces' | 'Chèque' | 'Virement' | 'Mobile Money';
  date: Date;
  statut: 'Payé' | 'Partiellement payé' | 'En attente';
}

interface Depense {
  id: string;
  description: string;
  montant: number;
  date: Date;
  categorie: string;
  responsable: string;
  succursale: string;
}

const Paiements: React.FC = () => {
  const { toast } = useToast();
  
  // États pour les données
  const [paiements, setPaiements] = useState<Paiement[]>([
    { 
      id: '1', 
      inscriptionId: '1',
      eleve: 'Marie Ndong',
      classe: 'CM1',
      fraisId: '1',
      fraisNom: 'Frais de scolarité',
      montant: 150000,
      montantPaye: 150000,
      tuteurId: '1',
      moyenPaiement: 'Espèces',
      date: new Date('2024-09-05'),
      statut: 'Payé'
    },
    { 
      id: '2', 
      inscriptionId: '2',
      eleve: 'Paul Obiang',
      classe: 'CE2',
      fraisId: '2',
      fraisNom: 'Frais de scolarité (Acompte)',
      montant: 150000,
      montantPaye: 75000,
      tuteurId: '2',
      moyenPaiement: 'Chèque',
      date: new Date('2024-09-10'),
      statut: 'Partiellement payé'
    },
    { 
      id: '3', 
      inscriptionId: '3',
      eleve: 'Sophie Mba',
      classe: 'CM2',
      fraisId: '3',
      fraisNom: 'Fournitures scolaires',
      montant: 25000,
      montantPaye: 25000,
      tuteurId: '3',
      moyenPaiement: 'Mobile Money',
      date: new Date('2024-09-15'),
      statut: 'Payé'
    },
    { 
      id: '4', 
      inscriptionId: '4',
      eleve: 'Jean Ondo',
      classe: '6ème',
      fraisId: '4',
      fraisNom: 'Frais de scolarité',
      montant: 200000,
      montantPaye: 200000,
      tuteurId: '4',
      moyenPaiement: 'Virement',
      date: new Date('2024-09-01'),
      statut: 'Payé'
    },
    { 
      id: '5', 
      inscriptionId: '5',
      eleve: 'Lucie Mintsa',
      classe: '5ème',
      fraisId: '5',
      fraisNom: 'Frais de scolarité',
      montant: 150000,
      montantPaye: 0,
      autreTuteur: 'Oncle',
      moyenPaiement: 'Espèces',
      date: new Date('2024-09-08'),
      statut: 'En attente'
    }
  ]);

  const [depenses, setDepenses] = useState<Depense[]>([
    {
      id: '1',
      description: 'Achat de fournitures de bureau',
      montant: 45000,
      date: new Date('2024-09-02'),
      categorie: 'Fournitures',
      responsable: 'Marie Ongone',
      succursale: 'Principal'
    },
    {
      id: '2',
      description: 'Réparation climatisation salle 5',
      montant: 120000,
      date: new Date('2024-09-07'),
      categorie: 'Maintenance',
      responsable: 'Jean Ntoutoume',
      succursale: 'Principal'
    },
    {
      id: '3',
      description: 'Carburant bus scolaire - Septembre',
      montant: 85000,
      date: new Date('2024-09-10'),
      categorie: 'Transport',
      responsable: 'Paul Mba',
      succursale: 'Annexe'
    }
  ]);

  // Données de référence
  const [inscriptions, setInscriptions] = useState<Inscription[]>([
    { id: '1', eleveId: '1', sessionId: '1', classeId: '1', classeNom: 'CM1' },
    { id: '2', eleveId: '2', sessionId: '1', classeId: '2', classeNom: 'CE2' },
    { id: '3', eleveId: '3', sessionId: '1', classeId: '3', classeNom: 'CM2' },
    { id: '4', eleveId: '4', sessionId: '1', classeId: '4', classeNom: '6ème' },
    { id: '5', eleveId: '5', sessionId: '1', classeId: '5', classeNom: '5ème' }
  ]);

  const [eleves, setEleves] = useState<Eleve[]>([
    { id: '1', nom: 'Ndong', prenom: 'Marie', classe: 'CM1' },
    { id: '2', nom: 'Obiang', prenom: 'Paul', classe: 'CE2' },
    { id: '3', nom: 'Mba', prenom: 'Sophie', classe: 'CM2' },
    { id: '4', nom: 'Ondo', prenom: 'Jean', classe: '6ème' },
    { id: '5', nom: 'Mintsa', prenom: 'Lucie', classe: '5ème' }
  ]);

  const [frais, setFrais] = useState<Frais[]>([
    { id: '1', nom: 'Frais de scolarité', montant: 150000, sessionId: '1' },
    { id: '2', nom: 'Frais de scolarité (Acompte)', montant: 75000, sessionId: '1' },
    { id: '3', nom: 'Fournitures scolaires', montant: 25000, sessionId: '1' },
    { id: '4', nom: 'Frais de scolarité', montant: 200000, sessionId: '1' },
    { id: '5', nom: 'Frais de scolarité', montant: 150000, sessionId: '1' }
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', nom: 'Année scolaire 2024-2025' },
    { id: '2', nom: 'Année scolaire 2023-2024' }
  ]);

  const [paliers, setPaliers] = useState<Palier[]>([
    { id: '1', nom: 'Trimestre 1', sessionId: '1' },
    { id: '2', nom: 'Trimestre 2', sessionId: '1' },
    { id: '3', nom: 'Trimestre 3', sessionId: '1' }
  ]);

  const [tuteurs, setTuteurs] = useState<Tuteur[]>([
    { id: '1', nom: 'Ndong', prenom: 'Pierre' },
    { id: '2', nom: 'Obiang', prenom: 'Jeanne' },
    { id: '3', nom: 'Mba', prenom: 'Albert' },
    { id: '4', nom: 'Ondo', prenom: 'Marie' }
  ]);

  // États pour le filtrage
  const [searchQuery, setSearchQuery] = useState('');
  const [filtreSession, setFiltreSession] = useState('');
  const [filtrePalier, setFiltrePalier] = useState('');
  const [filtreFrais, setFiltreFrais] = useState('');
  const [filtreSuccursale, setFiltreSuccursale] = useState('');
  const [dateDebut, setDateDebut] = useState<Date | null>(null);
  const [dateFin, setDateFin] = useState<Date | null>(null);

  // États pour les formulaires
  const [isPaiementDialogOpen, setIsPaiementDialogOpen] = useState(false);
  const [isDepenseDialogOpen, setIsDepenseDialogOpen] = useState(false);
  const [isImprimerDialogOpen, setIsImprimerDialogOpen] = useState(false);
  const [currentPaiement, setCurrentPaiement] = useState<Paiement | null>(null);
  const [currentDepense, setCurrentDepense] = useState<Depense | null>(null);
  
  // État pour le formulaire de paiement
  const [formPaiement, setFormPaiement] = useState<Partial<Paiement>>({
    inscriptionId: '',
    fraisId: '',
    montant: 0,
    montantPaye: 0,
    moyenPaiement: 'Espèces',
    date: new Date(),
    statut: 'Payé'
  });
  
  // État pour le formulaire de dépense
  const [formDepense, setFormDepense] = useState<Partial<Depense>>({
    description: '',
    montant: 0,
    date: new Date(),
    categorie: '',
    responsable: '',
    succursale: 'Principal'
  });

  // Liste des succursales
  const succursales = ['Principal', 'Annexe'];
  
  // Liste des catégories de dépenses
  const categoriesDepenses = [
    'Fournitures',
    'Maintenance',
    'Transport',
    'Salaires',
    'Loyer',
    'Électricité',
    'Eau',
    'Internet',
    'Téléphone',
    'Assurances',
    'Taxes',
    'Autre'
  ];

  // Calculer les totaux pour la section bilan
  const totalEntrees = paiements.reduce((sum, p) => sum + p.montantPaye, 0);
  const totalSorties = depenses.reduce((sum, d) => sum + d.montant, 0);
  const solde = totalEntrees - totalSorties;

  // Filtrer les paiements
  const filteredPaiements = paiements.filter(paiement => {
    const matchesSearch = 
      paiement.eleve.toLowerCase().includes(searchQuery.toLowerCase()) || 
      paiement.fraisNom.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Ajoutez d'autres conditions de filtrage au besoin
    // Pour l'instant, simplifié pour l'exemple
    return matchesSearch;
  });
  
  // Filtrer les dépenses
  const filteredDepenses = depenses.filter(depense => {
    const matchesSearch = 
      depense.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      depense.categorie.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSuccursale = !filtreSuccursale || depense.succursale === filtreSuccursale;
    
    // Filtrage par date à implémenter si nécessaire
    
    return matchesSearch && matchesSuccursale;
  });

  // Helper function pour obtenir le statut du paiement
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-orange-100 text-orange-800';
      case 'Partiellement payé':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Gérer la soumission du formulaire de paiement
  const handlePaiementSubmit = () => {
    if (!formPaiement.inscriptionId || !formPaiement.fraisId || formPaiement.montantPaye === undefined || formPaiement.montantPaye < 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Récupérer les informations de l'inscription
    const inscription = inscriptions.find(i => i.id === formPaiement.inscriptionId);
    if (!inscription) return;
    
    const eleve = eleves.find(e => e.id === inscription.eleveId);
    if (!eleve) return;
    
    const fraisToPay = frais.find(f => f.id === formPaiement.fraisId);
    if (!fraisToPay) return;
    
    // Déterminer le statut
    let statut: 'Payé' | 'Partiellement payé' | 'En attente' = 'En attente';
    if (formPaiement.montantPaye && fraisToPay.montant) {
      if (formPaiement.montantPaye >= fraisToPay.montant) {
        statut = 'Payé';
      } else if (formPaiement.montantPaye > 0) {
        statut = 'Partiellement payé';
      }
    }

    if (currentPaiement) {
      // Mise à jour
      setPaiements(prev => prev.map(p => p.id === currentPaiement.id ? {
        ...p,
        inscriptionId: formPaiement.inscriptionId || p.inscriptionId,
        eleve: `${eleve.prenom} ${eleve.nom}`,
        classe: inscription.classeNom,
        fraisId: formPaiement.fraisId || p.fraisId,
        fraisNom: fraisToPay.nom,
        montant: fraisToPay.montant,
        montantPaye: formPaiement.montantPaye || 0,
        tuteurId: formPaiement.tuteurId,
        autreTuteur: formPaiement.autreTuteur,
        moyenPaiement: formPaiement.moyenPaiement as any || p.moyenPaiement,
        date: formPaiement.date || p.date,
        statut
      } : p));
      
      toast({
        title: "Paiement mis à jour",
        description: "Le paiement a été mis à jour avec succès"
      });
    } else {
      // Création
      const newPaiement: Paiement = {
        id: uuidv4(),
        inscriptionId: formPaiement.inscriptionId,
        eleve: `${eleve.prenom} ${eleve.nom}`,
        classe: inscription.classeNom,
        fraisId: formPaiement.fraisId,
        fraisNom: fraisToPay.nom,
        montant: fraisToPay.montant,
        montantPaye: formPaiement.montantPaye || 0,
        tuteurId: formPaiement.tuteurId,
        autreTuteur: formPaiement.autreTuteur,
        moyenPaiement: formPaiement.moyenPaiement as 'Espèces' | 'Chèque' | 'Virement' | 'Mobile Money',
        date: formPaiement.date || new Date(),
        statut
      };
      
      setPaiements(prev => [...prev, newPaiement]);
      
      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès"
      });
    }
    
    // Reset and close
    resetPaiementForm();
    setIsPaiementDialogOpen(false);
  };

  // Gérer la soumission du formulaire de dépense
  const handleDepenseSubmit = () => {
    if (!formDepense.description || !formDepense.montant || formDepense.montant <= 0 || !formDepense.categorie || !formDepense.responsable) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (currentDepense) {
      // Mise à jour
      setDepenses(prev => prev.map(d => d.id === currentDepense.id ? {
        ...d,
        description: formDepense.description || d.description,
        montant: formDepense.montant || d.montant,
        date: formDepense.date || d.date,
        categorie: formDepense.categorie || d.categorie,
        responsable: formDepense.responsable || d.responsable,
        succursale: formDepense.succursale || d.succursale
      } : d));
      
      toast({
        title: "Dépense mise à jour",
        description: "La dépense a été mise à jour avec succès"
      });
    } else {
      // Création
      const newDepense: Depense = {
        id: uuidv4(),
        description: formDepense.description || '',
        montant: formDepense.montant || 0,
        date: formDepense.date || new Date(),
        categorie: formDepense.categorie || '',
        responsable: formDepense.responsable || '',
        succursale: formDepense.succursale || 'Principal'
      };
      
      setDepenses(prev => [...prev, newDepense]);
      
      toast({
        title: "Dépense enregistrée",
        description: "La dépense a été enregistrée avec succès"
      });
    }
    
    // Reset and close
    resetDepenseForm();
    setIsDepenseDialogOpen(false);
  };

  // Réinitialiser le formulaire de paiement
  const resetPaiementForm = () => {
    setFormPaiement({
      inscriptionId: '',
      fraisId: '',
      montant: 0,
      montantPaye: 0,
      moyenPaiement: 'Espèces',
      date: new Date(),
      statut: 'Payé'
    });
    setCurrentPaiement(null);
  };

  // Réinitialiser le formulaire de dépense
  const resetDepenseForm = () => {
    setFormDepense({
      description: '',
      montant: 0,
      date: new Date(),
      categorie: '',
      responsable: '',
      succursale: 'Principal'
    });
    setCurrentDepense(null);
  };

  // Fonction pour obtenir les frais d'une session
  const getFraisBySessionId = (sessionId: string) => {
    return frais.filter(f => f.sessionId === sessionId);
  };

  // Fonction pour obtenir les paliers d'une session
  const getPaliersBySessionId = (sessionId: string) => {
    return paliers.filter(p => p.sessionId === sessionId);
  };

  // Gérer l'édition d'un paiement
  const handleEditPaiement = (paiement: Paiement) => {
    setCurrentPaiement(paiement);
    setFormPaiement({
      inscriptionId: paiement.inscriptionId,
      fraisId: paiement.fraisId,
      montantPaye: paiement.montantPaye,
      tuteurId: paiement.tuteurId,
      autreTuteur: paiement.autreTuteur,
      moyenPaiement: paiement.moyenPaiement,
      date: paiement.date
    });
    setIsPaiementDialogOpen(true);
  };

  // Gérer la suppression d'un paiement
  const handleDeletePaiement = (id: string) => {
    setPaiements(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Paiement supprimé",
      description: "Le paiement a été supprimé avec succès"
    });
  };

  // Gérer l'édition d'une dépense
  const handleEditDepense = (depense: Depense) => {
    setCurrentDepense(depense);
    setFormDepense({
      description: depense.description,
      montant: depense.montant,
      date: depense.date,
      categorie: depense.categorie,
      responsable: depense.responsable,
      succursale: depense.succursale
    });
    setIsDepenseDialogOpen(true);
  };

  // Gérer la suppression d'une dépense
  const handleDeleteDepense = (id: string) => {
    setDepenses(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Dépense supprimée",
      description: "La dépense a été supprimée avec succès"
    });
  };

  // Formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR');
  };

  // Handle inscription selection in payment form
  const handleInscriptionSelection = (inscriptionId: string) => {
    const inscription = inscriptions.find(i => i.id === inscriptionId);
    if (!inscription) return;
    
    setFormPaiement(prev => ({
      ...prev,
      inscriptionId
    }));
  };

  // Handle frais selection in payment form
  const handleFraisSelection = (fraisId: string) => {
    const selectedFrais = frais.find(f => f.id === fraisId);
    if (!selectedFrais) return;
    
    setFormPaiement(prev => ({
      ...prev,
      fraisId,
      montant: selectedFrais.montant,
      montantPaye: selectedFrais.montant // Par défaut, on paie tout
    }));
  };

  // Get full name for eleve by ID
  const getEleveName = (eleveId: string) => {
    const eleve = eleves.find(e => e.id === eleveId);
    return eleve ? `${eleve.prenom} ${eleve.nom}` : '';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Paiements</h2>
          <p className="text-muted-foreground">Gestion des paiements et de la comptabilité</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <h3 className="text-green-800 text-sm font-medium mb-1">Total perçu</h3>
          <p className="text-2xl font-bold text-green-700">{totalEntrees.toLocaleString()} FCFA</p>
          <p className="text-xs text-green-600 mt-1">+12% par rapport au mois précédent</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-blue-800 text-sm font-medium mb-1">Dépenses</h3>
          <p className="text-2xl font-bold text-blue-700">{totalSorties.toLocaleString()} FCFA</p>
          <p className="text-xs text-blue-600 mt-1">{depenses.length} dépenses enregistrées</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <h3 className="text-purple-800 text-sm font-medium mb-1">Solde</h3>
          <p className="text-2xl font-bold text-purple-700">{solde.toLocaleString()} FCFA</p>
          <p className="text-xs text-purple-600 mt-1">Balance des entrées et sorties</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="paiements">
            <TabsList className="mb-4">
              <TabsTrigger value="paiements">Paiements</TabsTrigger>
              <TabsTrigger value="sorties">Dépenses</TabsTrigger>
              <TabsTrigger value="bilan">Bilan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paiements" className="pt-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Rechercher un paiement..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-10"
                  />
                </div>
                <Dialog open={isPaiementDialogOpen} onOpenChange={setIsPaiementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        resetPaiementForm();
                        setIsPaiementDialogOpen(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <CreditCard size={18} />
                      Enregistrer un paiement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>{currentPaiement ? "Modifier un paiement" : "Enregistrer un paiement"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="inscription" className="text-right">
                          Inscription*
                        </Label>
                        <Select
                          value={formPaiement.inscriptionId}
                          onValueChange={handleInscriptionSelection}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner une inscription" />
                          </SelectTrigger>
                          <SelectContent>
                            {inscriptions.map(inscription => (
                              <SelectItem key={inscription.id} value={inscription.id}>
                                {getEleveName(inscription.eleveId)} - {inscription.classeNom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="frais" className="text-right">
                          Frais*
                        </Label>
                        <Select
                          value={formPaiement.fraisId}
                          onValueChange={handleFraisSelection}
                          disabled={!formPaiement.inscriptionId}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner un frais" />
                          </SelectTrigger>
                          <SelectContent>
                            {formPaiement.inscriptionId && 
                              frais.map(f => (
                                <SelectItem key={f.id} value={f.id}>
                                  {f.nom} - {f.montant.toLocaleString()} FCFA
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="montantPaye" className="text-right">
                          Montant payé*
                        </Label>
                        <Input
                          id="montantPaye"
                          type="number"
                          value={formPaiement.montantPaye}
                          onChange={(e) => setFormPaiement({...formPaiement, montantPaye: Number(e.target.value)})}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tuteur" className="text-right">
                          Payé par
                        </Label>
                        <Select
                          value={formPaiement.tuteurId}
                          onValueChange={(value) => {
                            if (value === "autre") {
                              setFormPaiement({...formPaiement, tuteurId: undefined, autreTuteur: ""});
                            } else {
                              setFormPaiement({...formPaiement, tuteurId: value, autreTuteur: undefined});
                            }
                          }}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner un tuteur" />
                          </SelectTrigger>
                          <SelectContent>
                            {tuteurs.map(tuteur => (
                              <SelectItem key={tuteur.id} value={tuteur.id}>
                                {tuteur.prenom} {tuteur.nom}
                              </SelectItem>
                            ))}
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formPaiement.tuteurId === undefined && (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="autreTuteur" className="text-right">
                            Préciser
                          </Label>
                          <Input
                            id="autreTuteur"
                            value={formPaiement.autreTuteur || ''}
                            onChange={(e) => setFormPaiement({...formPaiement, autreTuteur: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: Oncle, Tante, etc."
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="moyenPaiement" className="text-right">
                          Moyen de paiement*
                        </Label>
                        <Select
                          value={formPaiement.moyenPaiement}
                          onValueChange={(value) => setFormPaiement({
                            ...formPaiement, 
                            moyenPaiement: value as 'Espèces' | 'Chèque' | 'Virement' | 'Mobile Money'
                          })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner un moyen de paiement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Espèces">Espèces</SelectItem>
                            <SelectItem value="Chèque">Chèque</SelectItem>
                            <SelectItem value="Virement">Virement</SelectItem>
                            <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date de paiement*
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formPaiement.date ? formPaiement.date.toISOString().split('T')[0] : ''}
                          onChange={(e) => setFormPaiement({...formPaiement, date: new Date(e.target.value)})}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPaiementDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handlePaiementSubmit}>
                        {currentPaiement ? "Mettre à jour" : "Enregistrer"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type de frais</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaiements.length > 0 ? (
                    filteredPaiements.map(paiement => (
                      <TableRow key={paiement.id}>
                        <TableCell>{paiement.eleve}</TableCell>
                        <TableCell>{paiement.classe}</TableCell>
                        <TableCell>{paiement.fraisNom}</TableCell>
                        <TableCell>{paiement.montant.toLocaleString()} FCFA</TableCell>
                        <TableCell>{paiement.montantPaye.toLocaleString()} FCFA</TableCell>
                        <TableCell>{formatDate(paiement.date)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(paiement.statut)}`}>
                            {paiement.statut}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditPaiement(paiement)}
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeletePaiement(paiement.id)}
                              title="Supprimer"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        Aucun paiement trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="sorties" className="pt-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Rechercher une dépense..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={filtreSuccursale}
                    onValueChange={setFiltreSuccursale}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Toutes les succursales" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-succursales">Toutes les succursales</SelectItem>
                      {succursales.map((succursale, index) => (
                        <SelectItem key={index} value={succursale}>
                          {succursale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isDepenseDialogOpen} onOpenChange={setIsDepenseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          resetDepenseForm();
                          setIsDepenseDialogOpen(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Nouvelle dépense
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>{currentDepense ? "Modifier une dépense" : "Enregistrer une dépense"}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description*
                          </Label>
                          <Input
                            id="description"
                            value={formDepense.description}
                            onChange={(e) => setFormDepense({...formDepense, description: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="montant" className="text-right">
                            Montant*
                          </Label>
                          <Input
                            id="montant"
                            type="number"
                            value={formDepense.montant}
                            onChange={(e) => setFormDepense({...formDepense, montant: Number(e.target.value)})}
                            className="col-span-3"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="categorie" className="text-right">
                            Catégorie*
                          </Label>
                          <Select
                            value={formDepense.categorie}
                            onValueChange={(value) => setFormDepense({...formDepense, categorie: value})}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoriesDepenses.map((categorie, index) => (
                                <SelectItem key={index} value={categorie}>
                                  {categorie}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="responsable" className="text-right">
                            Responsable*
                          </Label>
                          <Input
                            id="responsable"
                            value={formDepense.responsable}
                            onChange={(e) => setFormDepense({...formDepense, responsable: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="succursale" className="text-right">
                            Succursale*
                          </Label>
                          <Select
                            value={formDepense.succursale}
                            onValueChange={(value) => setFormDepense({...formDepense, succursale: value})}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Sélectionner une succursale" />
                            </SelectTrigger>
                            <SelectContent>
                              {succursales.map((succursale, index) => (
                                <SelectItem key={index} value={succursale}>
                                  {succursale}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date*
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={formDepense.date ? formDepense.date.toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormDepense({...formDepense, date: new Date(e.target.value)})}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDepenseDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleDepenseSubmit}>
                          {currentDepense ? "Mettre à jour" : "Enregistrer"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Succursale</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepenses.length > 0 ? (
                    filteredDepenses.map(depense => (
                      <TableRow key={depense.id}>
                        <TableCell>{depense.description}</TableCell>
                        <TableCell>{depense.categorie}</TableCell>
                        <TableCell>{depense.montant.toLocaleString()} FCFA</TableCell>
                        <TableCell>{formatDate(depense.date)}</TableCell>
                        <TableCell>{depense.responsable}</TableCell>
                        <TableCell>{depense.succursale}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditDepense(depense)}
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteDepense(depense.id)}
                              title="Supprimer"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Aucune dépense trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="bilan" className="pt-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-2 flex-1">
                  <Select
                    value={filtreSession}
                    onValueChange={setFiltreSession}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Toutes les sessions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sessions">Toutes les sessions</SelectItem>
                      {sessions.map(session => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filtreSuccursale}
                    onValueChange={setFiltreSuccursale}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Toutes les succursales" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-succursales">Toutes les succursales</SelectItem>
                      {succursales.map((succursale, index) => (
                        <SelectItem key={index} value={succursale}>
                          {succursale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => setIsImprimerDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Printer size={18} />
                  Imprimer le bilan
                </Button>
              </div>
              
              <Dialog open={isImprimerDialogOpen} onOpenChange={setIsImprimerDialogOpen}>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Aperçu du bilan</DialogTitle>
                  </DialogHeader>
                  
                  <div className="print-content py-8">
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-bold">Bilan Financier</h1>
                      <p className="text-gray-600">
                        {filtreSession 
                          ? sessions.find(s => s.id === filtreSession)?.nom 
                          : "Toutes les sessions"}
                      </p>
                      <p className="text-gray-600">
                        {filtreSuccursale || "Toutes les succursales"}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Total des entrées</h3>
                        <p className="text-xl font-bold text-green-600">{totalEntrees.toLocaleString()} FCFA</p>
                      </div>
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Total des dépenses</h3>
                        <p className="text-xl font-bold text-red-600">{totalSorties.toLocaleString()} FCFA</p>
                      </div>
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Solde</h3>
                        <p className={`text-xl font-bold ${solde >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {solde.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold mb-4">Détail des entrées</h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Élève</TableHead>
                            <TableHead>Type de frais</TableHead>
                            <TableHead>Montant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paiements.length > 0 ? (
                            paiements.map(paiement => (
                              <TableRow key={paiement.id}>
                                <TableCell>{formatDate(paiement.date)}</TableCell>
                                <TableCell>{paiement.eleve}</TableCell>
                                <TableCell>{paiement.fraisNom}</TableCell>
                                <TableCell>{paiement.montantPaye.toLocaleString()} FCFA</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                Aucun paiement enregistré
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Détail des dépenses</h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Montant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {depenses.length > 0 ? (
                            depenses.map(depense => (
                              <TableRow key={depense.id}>
                                <TableCell>{formatDate(depense.date)}</TableCell>
                                <TableCell>{depense.description}</TableCell>
                                <TableCell>{depense.categorie}</TableCell>
                                <TableCell>{depense.montant.toLocaleString()} FCFA</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                Aucune dépense enregistrée
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsImprimerDialogOpen(false)}>
                      Fermer
                    </Button>
                    <Button onClick={() => window.print()}>
                      <Printer className="mr-2" size={16} />
                      Imprimer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Résumé des entrées</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type de frais</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Montant total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Grouper les paiements par type de frais et calculer les totaux */}
                      {(() => {
                        const resume = paiements.reduce((acc, paiement) => {
                          if (!acc[paiement.fraisNom]) {
                            acc[paiement.fraisNom] = {
                              count: 0,
                              total: 0
                            };
                          }
                          acc[paiement.fraisNom].count += 1;
                          acc[paiement.fraisNom].total += paiement.montantPaye;
                          return acc;
                        }, {} as Record<string, {count: number, total: number}>);
                        
                        return Object.entries(resume).length > 0 ? (
                          Object.entries(resume).map(([fraisNom, data], index) => (
                            <TableRow key={index}>
                              <TableCell>{fraisNom}</TableCell>
                              <TableCell>{data.count}</TableCell>
                              <TableCell>{data.total.toLocaleString()} FCFA</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              Aucune donnée disponible
                            </TableCell>
                          </TableRow>
                        );
                      })()}
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Résumé des dépenses</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Montant total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Grouper les dépenses par catégorie et calculer les totaux */}
                      {(() => {
                        const resume = depenses.reduce((acc, depense) => {
                          if (!acc[depense.categorie]) {
                            acc[depense.categorie] = {
                              count: 0,
                              total: 0
                            };
                          }
                          acc[depense.categorie].count += 1;
                          acc[depense.categorie].total += depense.montant;
                          return acc;
                        }, {} as Record<string, {count: number, total: number}>);
                        
                        return Object.entries(resume).length > 0 ? (
                          Object.entries(resume).map(([categorie, data], index) => (
                            <TableRow key={index}>
                              <TableCell>{categorie}</TableCell>
                              <TableCell>{data.count}</TableCell>
                              <TableCell>{data.total.toLocaleString()} FCFA</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              Aucune donnée disponible
                            </TableCell>
                          </TableRow>
                        );
                      })()}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Paiements;
