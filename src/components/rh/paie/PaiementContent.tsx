
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileSpreadsheet, 
  Download, 
  DollarSign, 
  Calendar, 
  ArrowUpRight,
  Plus,
  Printer,
  Search
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { PersonnelMember, PaiementSalaire } from '../types';
import PaiementForm from './PaiementForm';
import FichePaiePreview from './FichePaiePreview';

interface PaiementContentProps {
  personnel: PersonnelMember[];
  initialPaiements?: PaiementSalaire[];
}

const PaiementContent: React.FC<PaiementContentProps> = ({
  personnel,
  initialPaiements = []
}) => {
  const { toast } = useToast();
  const [paiements, setPaiements] = useState<PaiementSalaire[]>(initialPaiements);
  const [filteredPaiements, setFilteredPaiements] = useState<PaiementSalaire[]>(initialPaiements);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<PaiementSalaire | null>(null);
  
  // Filters
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedMonth, selectedYear, selectedStatus, paiements]);
  
  const applyFilters = () => {
    let result = [...paiements];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(paiement => 
        paiement.nom_complet.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply month filter
    if (selectedMonth !== "all") {
      const monthIndex = parseInt(selectedMonth);
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];
      
      result = result.filter(paiement => 
        paiement.mois === monthNames[monthIndex - 1]
      );
    }
    
    // Apply year filter
    if (selectedYear !== "all") {
      result = result.filter(paiement => paiement.annee === selectedYear);
    }
    
    // Apply status filter
    if (selectedStatus !== "all") {
      result = result.filter(paiement => paiement.statut === selectedStatus);
    }
    
    setFilteredPaiements(result);
  };
  
  const handleAddPaiement = (newPaiement: PaiementSalaire) => {
    setPaiements([...paiements, newPaiement]);
    setIsAddModalOpen(false);
    toast({
      title: "Paiement ajouté",
      description: "Le paiement a été ajouté avec succès."
    });
  };
  
  const handleEditPaiement = (updatedPaiement: PaiementSalaire) => {
    setPaiements(paiements.map(p => p.id === updatedPaiement.id ? updatedPaiement : p));
    setIsEditModalOpen(false);
    toast({
      title: "Paiement mis à jour",
      description: "Le paiement a été mis à jour avec succès."
    });
  };
  
  const handleViewFichePaie = (paiement: PaiementSalaire) => {
    setSelectedPaiement(paiement);
    setIsPreviewModalOpen(true);
  };
  
  const handleEditPaiementClick = (paiement: PaiementSalaire) => {
    setSelectedPaiement(paiement);
    setIsEditModalOpen(true);
  };
  
  const handlePayClick = (paiement: PaiementSalaire) => {
    const updatedPaiement = {
      ...paiement,
      statut: "Payé",
      date_paiement: new Date().toLocaleDateString('fr-FR')
    };
    
    setPaiements(paiements.map(p => p.id === paiement.id ? updatedPaiement : p));
    
    toast({
      title: "Paiement effectué",
      description: `Le salaire de ${paiement.nom_complet} a été marqué comme payé.`
    });
  };
  
  // Calculate stats for cards
  const totalMonthlySalaries = filteredPaiements.reduce((acc, curr) => acc + curr.montant_final, 0);
  const nextPaymentDate = "25 Mai 2023"; // This would be dynamic in a real app
  
  // Calculate month-to-month change
  const calculateMonthlyChange = () => {
    // This is a placeholder - in a real app, you'd compare with last month's data
    return "+2.3%";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Gestion de la paie</h3>
          <p className="text-muted-foreground">Préparation des fiches de paie et versement des salaires</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Exporter</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Nouvelle paie</span>
          </Button>
        </div>
      </div>
      
      <div className="flex mb-4">
        <div className="relative flex-1 mr-4">
          <Input
            type="search"
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign size={18} />
              Budget mensuel
            </CardTitle>
            <CardDescription>Masse salariale</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalMonthlySalaries.toLocaleString()} FCFA</p>
            <p className="text-sm text-muted-foreground">Pour {personnel.length} employés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar size={18} />
              Prochaine paie
            </CardTitle>
            <CardDescription>Date de versement</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{nextPaymentDate}</p>
            <p className="text-sm text-muted-foreground">Dans 12 jours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpRight size={18} />
              Évolution
            </CardTitle>
            <CardDescription>Par rapport au mois dernier</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{calculateMonthlyChange()}</p>
            <p className="text-sm text-muted-foreground">Augmentation de la masse salariale</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrer les paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Mois</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  <SelectItem value="01">Janvier</SelectItem>
                  <SelectItem value="02">Février</SelectItem>
                  <SelectItem value="03">Mars</SelectItem>
                  <SelectItem value="04">Avril</SelectItem>
                  <SelectItem value="05">Mai</SelectItem>
                  <SelectItem value="06">Juin</SelectItem>
                  <SelectItem value="07">Juillet</SelectItem>
                  <SelectItem value="08">Août</SelectItem>
                  <SelectItem value="09">Septembre</SelectItem>
                  <SelectItem value="10">Octobre</SelectItem>
                  <SelectItem value="11">Novembre</SelectItem>
                  <SelectItem value="12">Décembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Année</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Statut</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Payé">Payé</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet size={18} />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employé</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Primes</TableHead>
                <TableHead>Déductions</TableHead>
                <TableHead>Total</TableHead>
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
                  <TableCell className="font-medium">{paiement.nom_complet}</TableCell>
                  <TableCell>{paiement.mois} {paiement.annee}</TableCell>
                  <TableCell>{paiement.montant_base.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-green-600">+{paiement.primes.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-red-600">-{paiement.deductions.toLocaleString()} FCFA</TableCell>
                  <TableCell className="font-medium">{paiement.montant_final.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      paiement.statut === 'Payé' 
                        ? 'bg-green-100 text-green-800' 
                        : paiement.statut === 'En attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {paiement.statut}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewFichePaie(paiement)}
                      >
                        Fiche de paie
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditPaiementClick(paiement)}
                      >
                        Modifier
                      </Button>
                      {paiement.statut === 'En attente' && (
                        <Button 
                          size="sm"
                          onClick={() => handlePayClick(paiement)}
                        >
                          Payer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Modals */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau paiement</DialogTitle>
          </DialogHeader>
          <PaiementForm 
            personnel={personnel}
            onSubmit={handleAddPaiement}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier un paiement</DialogTitle>
          </DialogHeader>
          {selectedPaiement && (
            <PaiementForm 
              paiement={selectedPaiement}
              personnel={personnel}
              onSubmit={handleEditPaiement}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-screen">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Fiche de paie</span>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>Imprimer</span>
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedPaiement && (
            <FichePaiePreview 
              paiement={selectedPaiement}
              personnel={personnel.find(p => p.id === selectedPaiement.personnel_id)}
              onClose={() => setIsPreviewModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaiementContent;
