
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableCaption
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  FileText, 
  FileCheck, 
  AlertTriangle, 
  Filter,
  Search
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DateRangeFilter from '@/components/payments/DateRangeFilter';
import TotalsSummary from '@/components/payments/TotalsSummary';
import TransactionModal from '@/components/payments/TransactionModal';
import { useToast } from '@/hooks/use-toast';

// Sessions et inscriptions
const sessions = [
  { id: '1', name: '2024-2025' },
  { id: '2', name: '2023-2024' },
];

const inscriptions = [
  { id: '1', sessionId: '1', studentName: 'Marie Ndong', class: 'CM1' },
  { id: '2', sessionId: '1', studentName: 'Paul Obiang', class: 'CE2' },
  { id: '3', sessionId: '2', studentName: 'Sophie Moussavou', class: 'CP' },
  { id: '4', sessionId: '2', studentName: 'Jean Ondo', class: 'CM2' },
];

const tuteurs = [
  { id: '1', name: 'M. Ndong', students: ['1'] },
  { id: '2', name: 'Mme Obiang', students: ['2'] },
  { id: '3', name: 'M. Moussavou', students: ['3'] },
  { id: '4', name: 'Mme Ondo', students: ['4'] },
];

// Données fictives pour démonstration
const paiementsData = [
  { 
    id: 1, 
    eleve: 'Marie Ndong',
    classe: 'CM1',
    montant: '150 000 FCFA',
    montantValue: 150000,
    type: 'Frais de scolarité',
    date: '05/09/2024',
    echeance: '01/09/2024',
    statut: 'Payé'
  },
  { 
    id: 2, 
    eleve: 'Marie Ndong',
    classe: 'CM1',
    montant: '50 000 FCFA',
    montantValue: 50000,
    type: 'Fournitures scolaires',
    date: '05/09/2024',
    echeance: '15/09/2024',
    statut: 'Payé'
  },
  { 
    id: 3, 
    eleve: 'Paul Obiang',
    classe: 'CE2',
    montant: '75 000 FCFA',
    montantValue: 75000,
    type: 'Frais de scolarité (Acompte)',
    date: '10/09/2024',
    echeance: '01/09/2024',
    statut: 'Partiellement payé'
  },
  { 
    id: 4, 
    eleve: 'Paul Obiang',
    classe: 'CE2',
    montant: '75 000 FCFA',
    montantValue: 75000,
    type: 'Frais de scolarité (Solde)',
    date: '-',
    echeance: '01/12/2024',
    statut: 'À payer'
  }
];

// Transactions bilancielles
const transactions = [
  { 
    id: 1, 
    date: '2024-09-05', 
    description: 'Paiement frais de scolarité - Marie Ndong', 
    amount: 150000, 
    type: 'income' 
  },
  { 
    id: 2, 
    date: '2024-09-05', 
    description: 'Paiement fournitures - Marie Ndong', 
    amount: 50000, 
    type: 'income' 
  },
  { 
    id: 3, 
    date: '2024-09-10', 
    description: 'Paiement acompte - Paul Obiang', 
    amount: 75000, 
    type: 'income' 
  },
  { 
    id: 4, 
    date: '2024-09-15', 
    description: 'Achat de fournitures scolaires', 
    amount: 120000, 
    type: 'expense' 
  },
  { 
    id: 5, 
    date: '2024-09-20', 
    description: 'Paiement salaires enseignants', 
    amount: 500000, 
    type: 'expense' 
  },
  { 
    id: 6, 
    date: '2024-09-25', 
    description: 'Paiement électricité', 
    amount: 45000, 
    type: 'expense' 
  },
  { 
    id: 7, 
    date: '2024-10-05', 
    description: 'Paiement mensualité - Marie Ndong', 
    amount: 25000, 
    type: 'income' 
  }
];

interface PaymentFormValues {
  sessionId: string;
  inscriptionId: string;
  tuteurId: string;
  autrePayeur: string;
  type: string;
  montant: number;
  echeance: string;
}

const MesPaiements: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("paiements");
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-10-31");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  
  const [formValues, setFormValues] = useState<PaymentFormValues>({
    sessionId: '',
    inscriptionId: '',
    tuteurId: '',
    autrePayeur: '',
    type: '',
    montant: 0,
    echeance: '',
  });
  
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'À payer':
        return 'bg-orange-100 text-orange-800';
      case 'Partiellement payé':
        return 'bg-blue-100 text-blue-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filtrer les inscriptions en fonction de la session sélectionnée
  const filteredInscriptions = inscriptions.filter(
    inscription => !formValues.sessionId || inscription.sessionId === formValues.sessionId
  );
  
  // Filtrer les tuteurs en fonction de l'inscription sélectionnée
  const filteredTuteurs = tuteurs.filter(tuteur => {
    if (!formValues.inscriptionId) return true;
    return tuteur.students.includes(formValues.inscriptionId);
  });
  
  // Gérer changement de session
  const handleSessionChange = (sessionId: string) => {
    setFormValues({
      ...formValues,
      sessionId,
      inscriptionId: '', // Réinitialiser l'inscription
      tuteurId: '', // Réinitialiser le tuteur
      autrePayeur: '', // Réinitialiser autre payeur
    });
  };
  
  // Gérer changement d'inscription
  const handleInscriptionChange = (inscriptionId: string) => {
    setFormValues({
      ...formValues,
      inscriptionId,
      tuteurId: '', // Réinitialiser le tuteur
      autrePayeur: '', // Réinitialiser autre payeur
    });
  };
  
  // Gérer changement de tuteur
  const handleTuteurChange = (tuteurId: string) => {
    setFormValues({
      ...formValues,
      tuteurId,
      autrePayeur: tuteurId === 'autre' ? '' : formValues.autrePayeur,
    });
  };
  
  // Gérer soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.sessionId || !formValues.inscriptionId || 
        (!formValues.tuteurId && !formValues.autrePayeur) || 
        !formValues.type || !formValues.montant) {
      toast({
        title: "Erreur de saisie",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    // Traitement du paiement
    toast({
      title: isEditMode ? "Paiement modifié" : "Paiement ajouté",
      description: `Le paiement a été ${isEditMode ? 'modifié' : 'ajouté'} avec succès.`
    });
    
    // Fermer le formulaire et réinitialiser les valeurs
    setIsFormOpen(false);
    setFormValues({
      sessionId: '',
      inscriptionId: '',
      tuteurId: '',
      autrePayeur: '',
      type: '',
      montant: 0,
      echeance: '',
    });
    setIsEditMode(false);
    setSelectedPaymentId(null);
  };
  
  // Ouvrir le formulaire d'édition
  const openEditForm = (paymentId: number) => {
    const payment = paiementsData.find(p => p.id === paymentId);
    if (!payment) return;
    
    // Simuler les valeurs pour l'édition
    setFormValues({
      sessionId: '1', // Valeur fixe pour la démonstration
      inscriptionId: payment.eleve === 'Marie Ndong' ? '1' : '2',
      tuteurId: payment.eleve === 'Marie Ndong' ? '1' : '2',
      autrePayeur: '',
      type: payment.type,
      montant: parseInt(payment.montant.replace(/[^\d]/g, '')),
      echeance: payment.echeance.split('/').reverse().join('-'), // Convertir DD/MM/YYYY en YYYY-MM-DD
    });
    
    setIsEditMode(true);
    setSelectedPaymentId(paymentId);
    setIsFormOpen(true);
  };
  
  // Filtrer les transactions par date
  const filterTransactions = () => {
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date).getTime();
      return transactionDate >= startTimestamp && transactionDate <= endTimestamp;
    });
    
    setFilteredTransactions(filtered);
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
    setFilteredTransactions(transactions);
  };

  // Gérer l'impression du bilan
  const handlePrintStatement = () => {
    window.print();
    toast({
      title: "Impression",
      description: "L'état financier a été envoyé à l'impression."
    });
  };

  return (
    <div>
      <Tabs defaultValue="paiements" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="paiements">Mes Paiements</TabsTrigger>
          <TabsTrigger value="bilan">Bilan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paiements" className="mt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Mes Paiements</h2>
            <p className="text-muted-foreground">Suivi des paiements pour vos enfants</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total payé</CardTitle>
                <CreditCard size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">275 000 FCFA</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reste à payer</CardTitle>
                <FileText size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">75 000 FCFA</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Échéances respectées</CardTitle>
                <FileCheck size={16} className="text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">100%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Prochaine échéance</CardTitle>
                <AlertTriangle size={16} className="text-amber-600" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">01/12/2024</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Rechercher un paiement..."
                className="pl-10"
              />
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  {isEditMode ? "Modifier le paiement" : "Ajouter un paiement"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Modifier le paiement" : "Ajouter un nouveau paiement"}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Session */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="session" className="text-right font-medium text-sm">
                      Session*
                    </label>
                    <Select 
                      value={formValues.sessionId} 
                      onValueChange={handleSessionChange}
                    >
                      <SelectTrigger id="session" className="col-span-3">
                        <SelectValue placeholder="Sélectionner la session" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map(session => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Inscription (élève) */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="inscription" className="text-right font-medium text-sm">
                      Élève*
                    </label>
                    <Select 
                      value={formValues.inscriptionId} 
                      onValueChange={handleInscriptionChange}
                      disabled={!formValues.sessionId}
                    >
                      <SelectTrigger id="inscription" className="col-span-3">
                        <SelectValue placeholder="Sélectionner l'élève" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredInscriptions.map(inscription => (
                          <SelectItem key={inscription.id} value={inscription.id}>
                            {inscription.studentName} ({inscription.class})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Payeur */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="payeur" className="text-right font-medium text-sm">
                      Payeur*
                    </label>
                    <Select 
                      value={formValues.tuteurId} 
                      onValueChange={handleTuteurChange}
                      disabled={!formValues.inscriptionId}
                    >
                      <SelectTrigger id="payeur" className="col-span-3">
                        <SelectValue placeholder="Sélectionner le payeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTuteurs.map(tuteur => (
                          <SelectItem key={tuteur.id} value={tuteur.id}>
                            {tuteur.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="autre">Autre payeur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Autre payeur (conditionnel) */}
                  {formValues.tuteurId === 'autre' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="autrePayeur" className="text-right font-medium text-sm">
                        Nom du payeur*
                      </label>
                      <Input
                        id="autrePayeur"
                        value={formValues.autrePayeur}
                        onChange={(e) => setFormValues({...formValues, autrePayeur: e.target.value})}
                        className="col-span-3"
                        placeholder="Entrez le nom du payeur"
                        required
                      />
                    </div>
                  )}
                  
                  {/* Type de paiement */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right font-medium text-sm">
                      Type de paiement*
                    </label>
                    <Select 
                      value={formValues.type} 
                      onValueChange={(value) => setFormValues({...formValues, type: value})}
                    >
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frais de scolarité">Frais de scolarité</SelectItem>
                        <SelectItem value="Frais de scolarité (Acompte)">Frais de scolarité (Acompte)</SelectItem>
                        <SelectItem value="Frais de scolarité (Solde)">Frais de scolarité (Solde)</SelectItem>
                        <SelectItem value="Fournitures scolaires">Fournitures scolaires</SelectItem>
                        <SelectItem value="Uniforme">Uniforme</SelectItem>
                        <SelectItem value="Activités extrascolaires">Activités extrascolaires</SelectItem>
                        <SelectItem value="Cantine">Cantine</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Montant */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="montant" className="text-right font-medium text-sm">
                      Montant*
                    </label>
                    <div className="relative col-span-3">
                      <Input
                        id="montant"
                        type="number"
                        value={formValues.montant || ''}
                        onChange={(e) => setFormValues({...formValues, montant: parseInt(e.target.value) || 0})}
                        className="pr-16"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
                        FCFA
                      </div>
                    </div>
                  </div>
                  
                  {/* Échéance */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="echeance" className="text-right font-medium text-sm">
                      Échéance
                    </label>
                    <Input
                      id="echeance"
                      type="date"
                      value={formValues.echeance}
                      onChange={(e) => setFormValues({...formValues, echeance: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsFormOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      {isEditMode ? "Mettre à jour" : "Ajouter le paiement"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableCaption>Liste des paiements pour l'année scolaire 2024-2025</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date de paiement</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paiementsData.map((paiement) => (
                  <TableRow key={paiement.id}>
                    <TableCell>{paiement.id}</TableCell>
                    <TableCell className="font-medium">{paiement.eleve}</TableCell>
                    <TableCell>{paiement.classe}</TableCell>
                    <TableCell>{paiement.type}</TableCell>
                    <TableCell>{paiement.montant}</TableCell>
                    <TableCell>{paiement.date}</TableCell>
                    <TableCell>{paiement.echeance}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(paiement.statut)}`}>
                        {paiement.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {paiement.statut === 'À payer' ? (
                        <Button variant="default" size="sm">Payer</Button>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Reçu généré",
                                description: "Le reçu a été généré avec succès."
                              });
                            }}
                          >
                            Reçu
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditForm(paiement.id)}
                          >
                            Modifier
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
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
            onFilter={filterTransactions}
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
            
            {/* Sorties */}
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

export default MesPaiements;
