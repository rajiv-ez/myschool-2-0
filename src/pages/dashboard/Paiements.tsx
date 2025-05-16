
import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DateRangeFilter from '@/components/payments/DateRangeFilter';
import TotalsSummary from '@/components/payments/TotalsSummary';
import TransactionModal from '@/components/payments/TransactionModal';
import { Transaction } from '@/components/notes/types';

// Données fictives pour démonstration
const paiementsData = [
  {
    id: 1,
    nom: 'Jean Assoumou',
    classe: 'CM2',
    montant: '150000',
    type: 'Frais de scolarité',
    date: '2024-05-10',
    statut: 'Payé'
  },
  {
    id: 2,
    nom: 'Marie Ndong',
    classe: 'CE1',
    montant: '120000',
    type: 'Frais de scolarité',
    date: '2024-05-09',
    statut: 'Payé'
  },
  {
    id: 3,
    nom: 'Pierre Obiang',
    classe: 'CP',
    montant: '100000',
    type: 'Frais de scolarité',
    date: '2024-05-12',
    statut: 'En attente'
  },
  {
    id: 4,
    nom: 'Sophie Mba',
    classe: 'CM1',
    montant: '135000',
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
    date: '2024-05-05',
    categorie: 'Matériel',
    beneficiaire: 'Papeterie Centrale'
  },
  {
    id: 2,
    description: 'Réparation climatisation',
    montant: '120000',
    date: '2024-05-03',
    categorie: 'Maintenance',
    beneficiaire: 'Technicien Clim'
  },
  {
    id: 3,
    description: 'Salaires personnel enseignant',
    montant: '2500000',
    date: '2024-05-01',
    categorie: 'Salaires',
    beneficiaire: 'Personnel'
  },
  {
    id: 4,
    description: 'Facture électricité',
    montant: '180000',
    date: '2024-05-02',
    categorie: 'Charges',
    beneficiaire: 'SEEG'
  }
];

// Transactions bilancielles
const transactions: Transaction[] = [
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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPaiements, setFilteredPaiements] = useState(paiementsData);
  const [filteredDepenses, setFilteredDepenses] = useState(depensesData);
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-10-31");
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtrer les données en fonction du terme de recherche
  const handleSearch = (tab: string, term: string) => {
    setSearchTerm(term);
    
    if (tab === 'recettes') {
      const filtered = paiementsData.filter(paiement =>
        paiement.nom.toLowerCase().includes(term.toLowerCase()) ||
        paiement.classe.toLowerCase().includes(term.toLowerCase()) ||
        paiement.type.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPaiements(filtered);
    } else if (tab === 'depenses') {
      const filtered = depensesData.filter(depense =>
        depense.description.toLowerCase().includes(term.toLowerCase()) ||
        depense.beneficiaire.toLowerCase().includes(term.toLowerCase()) ||
        depense.categorie.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredDepenses(filtered);
    }
  };
  
  // Gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
    
    // Réinitialiser les listes filtrées
    if (value === 'recettes') {
      setFilteredPaiements(paiementsData);
    } else if (value === 'depenses') {
      setFilteredDepenses(depensesData);
    }
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
            onClick={() => setIsOpenModal(true)}
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
                      onChange={(e) => handleSearch('recettes', e.target.value)}
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
                    <div className="text-2xl font-bold">3 875 000 FCFA</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium">Paiements ce mois</div>
                    <div className="text-2xl font-bold">1 245 000 FCFA</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="text-amber-600 font-medium">En attente</div>
                    <div className="text-2xl font-bold">235 000 FCFA</div>
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
                      {filteredPaiements.map((paiement) => (
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
                              <Button variant="outline" size="sm">Voir</Button>
                              <Button variant="ghost" size="sm">Modifier</Button>
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
                      onChange={(e) => handleSearch('depenses', e.target.value)}
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
                    <div className="text-2xl font-bold">3 150 000 FCFA</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium">Dépenses ce mois</div>
                    <div className="text-2xl font-bold">950 000 FCFA</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-purple-600 font-medium">Catégorie principale</div>
                    <div className="text-2xl font-bold">Salaires</div>
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
                      {filteredDepenses.map((depense) => (
                        <TableRow key={depense.id}>
                          <TableCell>{depense.id}</TableCell>
                          <TableCell className="font-medium">{depense.description}</TableCell>
                          <TableCell>{parseInt(depense.montant).toLocaleString()} FCFA</TableCell>
                          <TableCell>{new Date(depense.date).toLocaleDateString()}</TableCell>
                          <TableCell>{depense.categorie}</TableCell>
                          <TableCell>{depense.beneficiaire}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">Voir</Button>
                              <Button variant="ghost" size="sm">Modifier</Button>
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
            
            {/* Sorties (dépenses) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight size={16} className="text-red-500" />
                  Dépenses
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
                            Aucune dépense trouvée pour cette période
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
      
      {/* Modal pour ajouter */}
      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'recettes' ? 'Ajouter un paiement' : 'Ajouter une dépense'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Formulaire à implémenter</p>
          </div>
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
