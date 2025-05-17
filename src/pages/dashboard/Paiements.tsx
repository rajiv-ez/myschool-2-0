
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Plus, 
  CreditCard, 
  FileText, 
  ArrowDownRight,
  ArrowUpRight,
  Printer,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DateRangeFilter from '@/components/payments/DateRangeFilter';
import TotalsSummary from '@/components/payments/TotalsSummary';
import TransactionModal from '@/components/payments/TransactionModal';
import { Transaction } from '@/components/notes/types';
import { v4 as uuidv4 } from 'uuid';

// Catégories de dépenses
const categoriesDepenses = [
  { id: '1', name: 'Matériel' },
  { id: '2', name: 'Maintenance' },
  { id: '3', name: 'Salaires' },
  { id: '4', name: 'Charges' },
  { id: '5', name: 'Transport' },
  { id: '6', name: 'Alimentation' },
];

// Classes pour les paiements
const classes = [
  { id: '1', name: 'CP' },
  { id: '2', name: 'CE1' },
  { id: '3', name: 'CE2' },
  { id: '4', name: 'CM1' },
  { id: '5', name: 'CM2' },
];

// Types de paiement
const typesPaiement = [
  { id: '1', name: 'Frais de scolarité' },
  { id: '2', name: 'Fournitures scolaires' },
  { id: '3', name: 'Cantine' },
  { id: '4', name: 'Transport' },
  { id: '5', name: 'Activités parascolaires' },
];

// Données fictives pour démonstration
const paiementsData = [
  {
    id: 1,
    nom: 'Jean Assoumou',
    classe: 'CM2',
    montant: '150000',
    montantValue: 150000,
    type: 'Frais de scolarité',
    date: '2024-05-10',
    statut: 'Payé'
  },
  {
    id: 2,
    nom: 'Marie Ndong',
    classe: 'CE1',
    montant: '120000',
    montantValue: 120000,
    type: 'Frais de scolarité',
    date: '2024-05-09',
    statut: 'Payé'
  },
  {
    id: 3,
    nom: 'Pierre Obiang',
    classe: 'CP',
    montant: '100000',
    montantValue: 100000,
    type: 'Frais de scolarité',
    date: '2024-05-12',
    statut: 'En attente'
  },
  {
    id: 4,
    nom: 'Sophie Mba',
    classe: 'CM1',
    montant: '135000',
    montantValue: 135000,
    type: 'Frais de scolarité',
    date: '2024-05-15',
    statut: 'En attente'
  }
];

// Données fictives pour les dépenses
const depensesData = [
  {
    id: 1,
    description: 'Achat de fournitures scolaires',
    montant: '350000',
    montantValue: 350000,
    date: '2024-05-05',
    categorie: 'Matériel',
    beneficiaire: 'Papeterie Centrale'
  },
  {
    id: 2,
    description: 'Réparation climatisation',
    montant: '120000',
    montantValue: 120000,
    date: '2024-05-03',
    categorie: 'Maintenance',
    beneficiaire: 'Technicien Clim'
  },
  {
    id: 3,
    description: 'Salaires personnel enseignant',
    montant: '2500000',
    montantValue: 2500000,
    date: '2024-05-01',
    categorie: 'Salaires',
    beneficiaire: 'Personnel'
  },
  {
    id: 4,
    description: 'Facture électricité',
    montant: '180000',
    montantValue: 180000,
    date: '2024-05-02',
    categorie: 'Charges',
    beneficiaire: 'SEEG'
  }
];

// Transactions bilancielles
const initialTransactions: Transaction[] = [
  { 
    id: 1, 
    date: '2024-09-05', 
    description: 'Paiement frais de scolarité - Marie Ndong', 
    amount: 150000, 
    type: "income" 
  },
  { 
    id: 2, 
    date: '2024-09-05', 
    description: 'Paiement fournitures - Marie Ndong', 
    amount: 50000, 
    type: "income" 
  },
  { 
    id: 3, 
    date: '2024-09-10', 
    description: 'Paiement acompte - Paul Obiang', 
    amount: 75000, 
    type: "income" 
  },
  { 
    id: 4, 
    date: '2024-09-15', 
    description: 'Achat de fournitures scolaires', 
    amount: 120000, 
    type: "expense" 
  },
  { 
    id: 5, 
    date: '2024-09-20', 
    description: 'Paiement salaires enseignants', 
    amount: 500000, 
    type: "expense" 
  },
  { 
    id: 6, 
    date: '2024-09-25', 
    description: 'Paiement électricité', 
    amount: 45000, 
    type: "expense" 
  },
  { 
    id: 7, 
    date: '2024-10-05', 
    description: 'Paiement mensualité - Marie Ndong', 
    amount: 25000, 
    type: "income" 
  }
];

const Paiements: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('recettes');
  const [isAddPaiementModalOpen, setIsAddPaiementModalOpen] = useState(false);
  const [isAddDepenseModalOpen, setIsAddDepenseModalOpen] = useState(false);
  const [isEditPaiementModalOpen, setIsEditPaiementModalOpen] = useState(false);
  const [isEditDepenseModalOpen, setIsEditDepenseModalOpen] = useState(false);
  const [isDeletePaiementModalOpen, setIsDeletePaiementModalOpen] = useState(false);
  const [isDeleteDepenseModalOpen, setIsDeleteDepenseModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [paiements, setPaiements] = useState([...paiementsData]);
  const [depenses, setDepenses] = useState([...depensesData]);
  const [filteredPaiements, setFilteredPaiements] = useState(paiements);
  const [filteredDepenses, setFilteredDepenses] = useState(depenses);
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-10-31");
  const [transactions, setTransactions] = useState([...initialTransactions]);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Formulaire d'ajout/édition de paiement
  const [paiementForm, setPaiementForm] = useState({
    nom: '',
    classe: '',
    montant: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    statut: 'En attente'
  });
  
  // Formulaire d'ajout/édition de dépense
  const [depenseForm, setDepenseForm] = useState({
    description: '',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    categorie: '',
    beneficiaire: ''
  });
  
  // Filtrer les paiements
  useEffect(() => {
    // Filtrer les paiements en fonction du terme de recherche
    let filtered = [...paiements];
    
    if (searchTerm) {
      filtered = filtered.filter(paiement =>
        paiement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paiement.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paiement.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPaiements(filtered);
  }, [searchTerm, paiements]);
  
  // Filtrer les dépenses
  useEffect(() => {
    // Filtrer les dépenses en fonction du terme de recherche
    let filtered = [...depenses];
    
    if (searchTerm) {
      filtered = filtered.filter(depense =>
        depense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        depense.beneficiaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        depense.categorie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDepenses(filtered);
  }, [searchTerm, depenses]);
  
  // Synchroniser les transactions
  useEffect(() => {
    // Cette fonction met à jour les transactions en fonction des paiements et dépenses
    const newTransactions: Transaction[] = [
      ...paiements.map(p => ({
        id: p.id,
        date: p.date,
        description: `Paiement ${p.type} - ${p.nom}`,
        amount: parseInt(p.montant),
        type: 'income' as const
      })),
      ...depenses.map(d => ({
        id: d.id + 1000, // Pour éviter les conflits d'ID
        date: d.date,
        description: d.description,
        amount: parseInt(d.montant),
        type: 'expense' as const
      }))
    ];
    
    setTransactions(newTransactions);
    
    // Appliquer le filtre de date aux transactions
    filterTransactionsByDate(newTransactions);
  }, [paiements, depenses]);
  
  // Filtrer les transactions par date
  const filterTransactionsByDate = (transactionsToFilter = transactions) => {
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    
    const filtered = transactionsToFilter.filter(transaction => {
      const transactionDate = new Date(transaction.date).getTime();
      return transactionDate >= startTimestamp && transactionDate <= endTimestamp;
    });
    
    setFilteredTransactions(filtered);
  };
  
  // Gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
  };
  
  // Calculer les totaux
  const totalIn = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalOut = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setStartDate("2024-09-01");
    setEndDate("2024-10-31");
    setSearchTerm('');
    filterTransactionsByDate();
    toast({
      title: "Filtres réinitialisés",
      description: "Les filtres ont été réinitialisés avec succès"
    });
  };

  // Gérer l'impression du bilan
  const handlePrintStatement = () => {
    window.print();
    toast({
      title: "Impression",
      description: "L'état financier a été envoyé à l'impression."
    });
  };
  
  // Ajouter un nouveau paiement
  const handleAddPaiement = () => {
    // Validation des champs obligatoires
    if (!paiementForm.nom || !paiementForm.classe || !paiementForm.montant || !paiementForm.type) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    // Créer le nouveau paiement
    const newPaiement = {
      id: paiements.length > 0 ? Math.max(...paiements.map(p => p.id)) + 1 : 1,
      nom: paiementForm.nom,
      classe: paiementForm.classe,
      montant: paiementForm.montant,
      montantValue: parseInt(paiementForm.montant),
      type: paiementForm.type,
      date: paiementForm.date,
      statut: paiementForm.statut
    };
    
    // Ajouter le paiement à la liste
    setPaiements([...paiements, newPaiement]);
    
    // Réinitialiser le formulaire et fermer la modal
    setPaiementForm({
      nom: '',
      classe: '',
      montant: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      statut: 'En attente'
    });
    
    setIsAddPaiementModalOpen(false);
    
    toast({
      title: "Paiement ajouté",
      description: `Le paiement de ${newPaiement.nom} a été ajouté avec succès`
    });
  };
  
  // Ajouter une nouvelle dépense
  const handleAddDepense = () => {
    // Validation des champs obligatoires
    if (!depenseForm.description || !depenseForm.montant || !depenseForm.categorie || !depenseForm.beneficiaire) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    // Créer la nouvelle dépense
    const newDepense = {
      id: depenses.length > 0 ? Math.max(...depenses.map(d => d.id)) + 1 : 1,
      description: depenseForm.description,
      montant: depenseForm.montant,
      montantValue: parseInt(depenseForm.montant),
      date: depenseForm.date,
      categorie: depenseForm.categorie,
      beneficiaire: depenseForm.beneficiaire
    };
    
    // Ajouter la dépense à la liste
    setDepenses([...depenses, newDepense]);
    
    // Réinitialiser le formulaire et fermer la modal
    setDepenseForm({
      description: '',
      montant: '',
      date: new Date().toISOString().split('T')[0],
      categorie: '',
      beneficiaire: ''
    });
    
    setIsAddDepenseModalOpen(false);
    
    toast({
      title: "Dépense ajoutée",
      description: `La dépense "${newDepense.description}" a été ajoutée avec succès`
    });
  };
  
  // Éditer un paiement existant
  const handleEditPaiement = () => {
    if (!selectedItemId) return;
    
    // Validation des champs obligatoires
    if (!paiementForm.nom || !paiementForm.classe || !paiementForm.montant || !paiementForm.type) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    // Mettre à jour le paiement dans la liste
    const updatedPaiements = paiements.map(p => 
      p.id === selectedItemId 
        ? {
            ...p,
            nom: paiementForm.nom,
            classe: paiementForm.classe,
            montant: paiementForm.montant,
            montantValue: parseInt(paiementForm.montant),
            type: paiementForm.type,
            date: paiementForm.date,
            statut: paiementForm.statut
          }
        : p
    );
    
    setPaiements(updatedPaiements);
    setIsEditPaiementModalOpen(false);
    
    toast({
      title: "Paiement mis à jour",
      description: "Le paiement a été mis à jour avec succès"
    });
  };
  
  // Éditer une dépense existante
  const handleEditDepense = () => {
    if (!selectedItemId) return;
    
    // Validation des champs obligatoires
    if (!depenseForm.description || !depenseForm.montant || !depenseForm.categorie || !depenseForm.beneficiaire) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    // Mettre à jour la dépense dans la liste
    const updatedDepenses = depenses.map(d => 
      d.id === selectedItemId 
        ? {
            ...d,
            description: depenseForm.description,
            montant: depenseForm.montant,
            montantValue: parseInt(depenseForm.montant),
            date: depenseForm.date,
            categorie: depenseForm.categorie,
            beneficiaire: depenseForm.beneficiaire
          }
        : d
    );
    
    setDepenses(updatedDepenses);
    setIsEditDepenseModalOpen(false);
    
    toast({
      title: "Dépense mise à jour",
      description: "La dépense a été mise à jour avec succès"
    });
  };
  
  // Supprimer un paiement
  const handleDeletePaiement = () => {
    if (!selectedItemId) return;
    
    const updatedPaiements = paiements.filter(p => p.id !== selectedItemId);
    setPaiements(updatedPaiements);
    setIsDeletePaiementModalOpen(false);
    
    toast({
      title: "Paiement supprimé",
      description: "Le paiement a été supprimé avec succès"
    });
  };
  
  // Supprimer une dépense
  const handleDeleteDepense = () => {
    if (!selectedItemId) return;
    
    const updatedDepenses = depenses.filter(d => d.id !== selectedItemId);
    setDepenses(updatedDepenses);
    setIsDeleteDepenseModalOpen(false);
    
    toast({
      title: "Dépense supprimée",
      description: "La dépense a été supprimée avec succès"
    });
  };
  
  // Ouvrir la modal d'édition d'un paiement
  const openEditPaiementModal = (id: number) => {
    const paiement = paiements.find(p => p.id === id);
    if (paiement) {
      setPaiementForm({
        nom: paiement.nom,
        classe: paiement.classe,
        montant: paiement.montant,
        type: paiement.type,
        date: paiement.date,
        statut: paiement.statut
      });
      setSelectedItemId(id);
      setIsEditPaiementModalOpen(true);
    }
  };
  
  // Ouvrir la modal d'édition d'une dépense
  const openEditDepenseModal = (id: number) => {
    const depense = depenses.find(d => d.id === id);
    if (depense) {
      setDepenseForm({
        description: depense.description,
        montant: depense.montant,
        date: depense.date,
        categorie: depense.categorie,
        beneficiaire: depense.beneficiaire
      });
      setSelectedItemId(id);
      setIsEditDepenseModalOpen(true);
    }
  };
  
  // Ouvrir la modal de suppression d'un paiement
  const openDeletePaiementModal = (id: number) => {
    setSelectedItemId(id);
    setIsDeletePaiementModalOpen(true);
  };
  
  // Ouvrir la modal de suppression d'une dépense
  const openDeleteDepenseModal = (id: number) => {
    setSelectedItemId(id);
    setIsDeleteDepenseModalOpen(true);
  };
  
  // Calculer les statistiques des recettes
  const totalRecettes = paiements.reduce((acc, curr) => acc + curr.montantValue, 0);
  const paiementsCeMois = paiements
    .filter(p => {
      const month = new Date(p.date).getMonth();
      const year = new Date(p.date).getFullYear();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return month === currentMonth && year === currentYear;
    })
    .reduce((acc, curr) => acc + curr.montantValue, 0);
  
  const paiementsEnAttente = paiements
    .filter(p => p.statut === 'En attente')
    .reduce((acc, curr) => acc + curr.montantValue, 0);
  
  // Calculer les statistiques des dépenses
  const totalDepenses = depenses.reduce((acc, curr) => acc + curr.montantValue, 0);
  const depensesCeMois = depenses
    .filter(d => {
      const month = new Date(d.date).getMonth();
      const year = new Date(d.date).getFullYear();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return month === currentMonth && year === currentYear;
    })
    .reduce((acc, curr) => acc + curr.montantValue, 0);
  
  // Trouver la catégorie de dépense principale
  const categoriePrincipale = (() => {
    const categoriesSum: { [key: string]: number } = {};
    
    depenses.forEach(d => {
      if (categoriesSum[d.categorie]) {
        categoriesSum[d.categorie] += d.montantValue;
      } else {
        categoriesSum[d.categorie] = d.montantValue;
      }
    });
    
    let maxCategory = '';
    let maxSum = 0;
    
    Object.entries(categoriesSum).forEach(([category, sum]) => {
      if (sum > maxSum) {
        maxSum = sum;
        maxCategory = category;
      }
    });
    
    return maxCategory;
  })();
  
  // Formater la date pour l'affichage
  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des paiements</h2>
          <p className="text-muted-foreground">Suivi des recettes et dépenses de l'établissement</p>
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
            onClick={() => activeTab === 'recettes' 
              ? setIsAddPaiementModalOpen(true) 
              : activeTab === 'depenses' 
              ? setIsAddDepenseModalOpen(true)
              : null
            }
          >
            <Plus size={16} />
            <span>{activeTab === 'recettes' ? 'Ajouter paiement' : activeTab === 'depenses' ? 'Ajouter dépense' : 'Nouvelle entrée'}</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="recettes">Recettes</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          <TabsTrigger value="bilan">Bilan</TabsTrigger>
        </TabsList>
        
        {/* Onglet Recettes */}
        <TabsContent value="recettes">
          <div className="mb-4">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rechercher des paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, classe ou type..."
                      className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter size={16} />
                    <span>Filtrer</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Période</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Résumé des recettes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 font-medium">Total recettes</div>
                    <div className="text-2xl font-bold">{totalRecettes.toLocaleString()} FCFA</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium">Paiements ce mois</div>
                    <div className="text-2xl font-bold">{paiementsCeMois.toLocaleString()} FCFA</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="text-amber-600 font-medium">En attente</div>
                    <div className="text-2xl font-bold">{paiementsEnAttente.toLocaleString()} FCFA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Liste des paiements</CardTitle>
                <CardDescription>
                  {filteredPaiements.length} paiements trouvés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Classe</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPaiements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : filteredPaiements.map((paiement) => (
                        <TableRow key={paiement.id}>
                          <TableCell>{paiement.id}</TableCell>
                          <TableCell className="font-medium">{paiement.nom}</TableCell>
                          <TableCell>{paiement.classe}</TableCell>
                          <TableCell>{paiement.type}</TableCell>
                          <TableCell>{parseInt(paiement.montant).toLocaleString()} FCFA</TableCell>
                          <TableCell>{new Date(paiement.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              paiement.statut === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {paiement.statut}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditPaiementModal(paiement.id)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeletePaiementModal(paiement.id)}>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Onglet Dépenses */}
        <TabsContent value="depenses">
          <div className="mb-4">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rechercher des dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher par description, bénéficiaire..."
                      className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter size={16} />
                    <span>Filtrer</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Période</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Résumé des dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-red-600 font-medium">Total dépenses</div>
                    <div className="text-2xl font-bold">{totalDepenses.toLocaleString()} FCFA</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium">Dépenses ce mois</div>
                    <div className="text-2xl font-bold">{depensesCeMois.toLocaleString()} FCFA</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-purple-600 font-medium">Catégorie principale</div>
                    <div className="text-2xl font-bold">{categoriePrincipale}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Liste des dépenses</CardTitle>
                <CardDescription>
                  {filteredDepenses.length} dépenses trouvées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Bénéficiaire</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDepenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Aucune dépense trouvée
                          </TableCell>
                        </TableRow>
                      ) : filteredDepenses.map((depense) => (
                        <TableRow key={depense.id}>
                          <TableCell>{depense.id}</TableCell>
                          <TableCell className="font-medium">{depense.description}</TableCell>
                          <TableCell>{parseInt(depense.montant).toLocaleString()} FCFA</TableCell>
                          <TableCell>{new Date(depense.date).toLocaleDateString()}</TableCell>
                          <TableCell>{depense.categorie}</TableCell>
                          <TableCell>{depense.beneficiaire}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDepenseModal(depense.id)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteDepenseModal(depense.id)}>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Onglet Bilan */}
        <TabsContent value="bilan" className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold">Bilan Financier</h2>
              <p className="text-muted-foreground">Suivi des entrées et sorties financières</p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Printer size={16} />
              <span>Imprimer l'état</span>
            </Button>
          </div>
          
          {/* Filtre par date */}
          <DateRangeFilter 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onFilter={() => filterTransactionsByDate()}
            onReset={resetFilters}
          />
          
          {/* Totaux */}
          <div className="my-6">
            <TotalsSummary totalIn={totalIn} totalOut={totalOut} />
          </div>
          
          {/* Liste des transactions */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Entrées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownRight size={16} className="text-green-500" />
                  Entrées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions
                        .filter(t => t.type === 'income')
                        .map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className="text-right font-medium">
                              {transaction.amount.toLocaleString()} FCFA
                            </TableCell>
                          </TableRow>
                        ))}
                      {filteredTransactions.filter(t => t.type === 'income').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            Aucune entrée trouvée pour cette période
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Sorties (dépenses) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight size={16} className="text-red-500" />
                  Sorties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions
                        .filter(t => t.type === 'expense')
                        .map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className="text-right font-medium">
                              {transaction.amount.toLocaleString()} FCFA
                            </TableCell>
                          </TableRow>
                        ))}
                      {filteredTransactions.filter(t => t.type === 'expense').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            Aucune sortie trouvée pour cette période
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Modal d'aperçu d'impression */}
          <TransactionModal 
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            transactions={filteredTransactions}
            onPrint={handlePrintStatement}
            dateRange={{ start: startDate, end: endDate }}
          />
        </TabsContent>
      </Tabs>
      
      {/* Modal pour ajouter un paiement */}
      <Dialog open={isAddPaiementModalOpen} onOpenChange={setIsAddPaiementModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un paiement</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="nom" className="text-right">Nom</Label>
                <Input
                  id="nom"
                  value={paiementForm.nom}
                  onChange={(e) => setPaiementForm({...paiementForm, nom: e.target.value})}
                  className="col-span-3"
                  placeholder="Nom de l'élève"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="classe" className="text-right">Classe</Label>
                <Select 
                  value={paiementForm.classe}
                  onValueChange={(value) => setPaiementForm({...paiementForm, classe: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(classe => (
                      <SelectItem key={classe.id} value={classe.name}>
                        {classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select 
                  value={paiementForm.type}
                  onValueChange={(value) => setPaiementForm({...paiementForm, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesPaiement.map(type => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="montant" className="text-right">Montant</Label>
                <Input
                  id="montant"
                  type="text"
                  value={paiementForm.montant}
                  onChange={(e) => setPaiementForm({...paiementForm, montant: e.target.value})}
                  className="col-span-3"
                  placeholder="Ex: 150000"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={paiementForm.date}
                  onChange={(e) => setPaiementForm({...paiementForm, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="statut" className="text-right">Statut</Label>
                <Select 
                  value={paiementForm.statut}
                  onValueChange={(value) => setPaiementForm({...paiementForm, statut: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Statut du paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPaiementModalOpen(false)}>Annuler</Button>
            <Button onClick={handleAddPaiement}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal pour ajouter une dépense */}
      <Dialog open={isAddDepenseModalOpen} onOpenChange={setIsAddDepenseModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une dépense</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={depenseForm.description}
                  onChange={(e) => setDepenseForm({...depenseForm, description: e.target.value})}
                  className="col-span-3"
                  placeholder="Description de la dépense"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="categorie" className="text-right">Catégorie</Label>
                <Select 
                  value={depenseForm.categorie}
                  onValueChange={(value) => setDepenseForm({...depenseForm, categorie: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesDepenses.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="beneficiaire" className="text-right">Bénéficiaire</Label>
                <Input
                  id="beneficiaire"
                  value={depenseForm.beneficiaire}
                  onChange={(e) => setDepenseForm({...depenseForm, beneficiaire: e.target.value})}
                  className="col-span-3"
                  placeholder="Nom du bénéficiaire"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="montant" className="text-right">Montant</Label>
                <Input
                  id="montant"
                  type="text"
                  value={depenseForm.montant}
                  onChange={(e) => setDepenseForm({...depenseForm, montant: e.target.value})}
                  className="col-span-3"
                  placeholder="Ex: 150000"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={depenseForm.date}
                  onChange={(e) => setDepenseForm({...depenseForm, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDepenseModalOpen(false)}>Annuler</Button>
            <Button onClick={handleAddDepense}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal pour éditer un paiement */}
      <Dialog open={isEditPaiementModalOpen} onOpenChange={setIsEditPaiementModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier un paiement</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="nom" className="text-right">Nom</Label>
                <Input
                  id="nom"
                  value={paiementForm.nom}
                  onChange={(e) => setPaiementForm({...paiementForm, nom: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="classe" className="text-right">Classe</Label>
                <Select 
                  value={paiementForm.classe}
                  onValueChange={(value) => setPaiementForm({...paiementForm, classe: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(classe => (
                      <SelectItem key={classe.id} value={classe.name}>
                        {classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select 
                  value={paiementForm.type}
                  onValueChange={(value) => setPaiementForm({...paiementForm, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesPaiement.map(type => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="montant" className="text-right">Montant</Label>
                <Input
                  id="montant"
                  type="text"
                  value={paiementForm.montant}
                  onChange={(e) => setPaiementForm({...paiementForm, montant: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={paiementForm.date}
                  onChange={(e) => setPaiementForm({...paiementForm, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="statut" className="text-right">Statut</Label>
                <Select 
                  value={paiementForm.statut}
                  onValueChange={(value) => setPaiementForm({...paiementForm, statut: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Statut du paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPaiementModalOpen(false)}>Annuler</Button>
            <Button onClick={handleEditPaiement}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal pour éditer une dépense */}
      <Dialog open={isEditDepenseModalOpen} onOpenChange={setIsEditDepenseModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier une dépense</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={depenseForm.description}
                  onChange={(e) => setDepenseForm({...depenseForm, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="categorie" className="text-right">Catégorie</Label>
                <Select 
                  value={depenseForm.categorie}
                  onValueChange={(value) => setDepenseForm({...depenseForm, categorie: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesDepenses.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="beneficiaire" className="text-right">Bénéficiaire</Label>
                <Input
                  id="beneficiaire"
                  value={depenseForm.beneficiaire}
                  onChange={(e) => setDepenseForm({...depenseForm, beneficiaire: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="montant" className="text-right">Montant</Label>
                <Input
                  id="montant"
                  type="text"
                  value={depenseForm.montant}
                  onChange={(e) => setDepenseForm({...depenseForm, montant: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={depenseForm.date}
                  onChange={(e) => setDepenseForm({...depenseForm, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDepenseModalOpen(false)}>Annuler</Button>
            <Button onClick={handleEditDepense}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal pour confirmer la suppression d'un paiement */}
      <Dialog open={isDeletePaiementModalOpen} onOpenChange={setIsDeletePaiementModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer un paiement</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletePaiementModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeletePaiement}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal pour confirmer la suppression d'une dépense */}
      <Dialog open={isDeleteDepenseModalOpen} onOpenChange={setIsDeleteDepenseModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer une dépense</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDepenseModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteDepense}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-content, .printable-content * {
            visibility: visible;
          }
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Paiements;
