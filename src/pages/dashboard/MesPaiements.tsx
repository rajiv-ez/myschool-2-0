
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
  Printer,
  Search
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DateRangeFilter from '@/components/payments/DateRangeFilter';
import { useToast } from '@/hooks/use-toast';

// Sessions et inscriptions
const sessions = [
  { id: '1', name: '2024-2025' },
  { id: '2', name: '2023-2024' },
];

// Classes
const classes = [
  { id: '1', name: 'CP' },
  { id: '2', name: 'CE1' },
  { id: '3', name: 'CE2' },
  { id: '4', name: 'CM1' },
  { id: '5', name: 'CM2' },
];

// Élèves
const eleves = [
  { id: '1', name: 'Marie Ndong', classId: '4' },
  { id: '2', name: 'Paul Obiang', classId: '3' },
  { id: '3', name: 'Sophie Moussavou', classId: '1' },
  { id: '4', name: 'Jean Ondo', classId: '5' },
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

const MesPaiements: React.FC = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-10-31");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEleve, setSelectedEleve] = useState('all');
  const [selectedClasse, setSelectedClasse] = useState('all');
  const [filteredPaiements, setFilteredPaiements] = useState(paiementsData);
  
  // Appliquer les filtres
  React.useEffect(() => {
    let result = [...paiementsData];
    
    // Filtre par recherche
    if (searchQuery) {
      result = result.filter(paiement => 
        paiement.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paiement.eleve.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtre par élève
    if (selectedEleve !== 'all') {
      const eleve = eleves.find(e => e.id === selectedEleve);
      if (eleve) {
        result = result.filter(paiement => paiement.eleve === eleve.name);
      }
    }
    
    // Filtre par classe
    if (selectedClasse !== 'all') {
      const classe = classes.find(c => c.id === selectedClasse);
      if (classe) {
        result = result.filter(paiement => paiement.classe === classe.name);
      }
    }
    
    // Filtre par dates (à implémenter avec les données réelles)
    
    setFilteredPaiements(result);
  }, [searchQuery, selectedEleve, selectedClasse, startDate, endDate]);
  
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
  
  // Ouvrir la modal de prévisualisation du reçu
  const openReceiptPreview = (paymentId: number) => {
    setSelectedPaymentId(paymentId);
    setIsPreviewModalOpen(true);
  };
  
  // Imprimer le reçu
  const handlePrintReceipt = () => {
    window.print();
    toast({
      title: "Impression",
      description: "Le reçu a été envoyé à l'impression."
    });
    setIsPreviewModalOpen(false);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setStartDate("2024-09-01");
    setEndDate("2024-10-31");
    setSelectedEleve('all');
    setSelectedClasse('all');
    setSearchQuery('');
  };

  // Filtrer par période
  const filterByDateRange = () => {
    // Dans une implémentation réelle, cette fonction filtrerait 
    // les paiements en fonction des dates sélectionnées
    toast({
      title: "Filtre appliqué",
      description: `Affichage des paiements du ${startDate} au ${endDate}`
    });
  };

  return (
    <div>
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
      
      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrer les paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Élève</label>
                <Select value={selectedEleve} onValueChange={setSelectedEleve}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les élèves" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les élèves</SelectItem>
                    {eleves.map(eleve => (
                      <SelectItem key={eleve.id} value={eleve.id}>
                        {eleve.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Classe</label>
                <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    {classes.map(classe => (
                      <SelectItem key={classe.id} value={classe.id}>
                        {classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium mb-1 block">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Rechercher un paiement..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <DateRangeFilter 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onFilter={filterByDateRange}
              onReset={resetFilters}
            />
          </div>
        </CardContent>
      </Card>
      
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
            {filteredPaiements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            ) : filteredPaiements.map((paiement) => (
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openReceiptPreview(paiement.id)}
                      className="flex items-center gap-1"
                    >
                      <Printer size={14} />
                      <span>Reçu</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Modal d'aperçu d'impression */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Aperçu du reçu</DialogTitle>
          </DialogHeader>
          <div className="p-4 border rounded-md">
            <div className="mb-4 text-center">
              <h3 className="font-bold text-xl">École Primaire La Réussite</h3>
              <p className="text-sm text-muted-foreground">Reçu de paiement</p>
            </div>
            
            {selectedPaymentId && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="font-medium">N° de reçu:</p>
                  <p>{selectedPaymentId}</p>
                  
                  <p className="font-medium">Élève:</p>
                  <p>{paiementsData.find(p => p.id === selectedPaymentId)?.eleve}</p>
                  
                  <p className="font-medium">Classe:</p>
                  <p>{paiementsData.find(p => p.id === selectedPaymentId)?.classe}</p>
                  
                  <p className="font-medium">Type de paiement:</p>
                  <p>{paiementsData.find(p => p.id === selectedPaymentId)?.type}</p>
                  
                  <p className="font-medium">Montant:</p>
                  <p className="font-bold">{paiementsData.find(p => p.id === selectedPaymentId)?.montant}</p>
                  
                  <p className="font-medium">Date de paiement:</p>
                  <p>{paiementsData.find(p => p.id === selectedPaymentId)?.date}</p>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-center">Ce reçu atteste que le paiement a bien été effectué.</p>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPreviewModalOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button 
                    onClick={handlePrintReceipt}
                    className="flex items-center gap-2"
                  >
                    <Printer size={16} />
                    <span>Imprimer</span>
                  </Button>
                </div>
              </div>
            )}
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

export default MesPaiements;
