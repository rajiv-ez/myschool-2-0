
import React from 'react';
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
  ArrowUpRight 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const paiementsData = [
  {
    id: "1",
    nom_complet: "Jean Assoumou",
    mois: "Avril",
    annee: "2023",
    montant_base: 450000,
    primes: 50000,
    deductions: 25000,
    montant_final: 475000,
    date_paiement: "25/04/2023",
    methode_paiement: "Virement",
    statut: "Payé"
  },
  {
    id: "2",
    nom_complet: "Marie Ndong",
    mois: "Avril",
    annee: "2023",
    montant_base: 450000,
    primes: 0,
    deductions: 15000,
    montant_final: 435000,
    date_paiement: "25/04/2023",
    methode_paiement: "Virement",
    statut: "Payé"
  },
  {
    id: "3",
    nom_complet: "Paul Obiang",
    mois: "Avril",
    annee: "2023",
    montant_base: 750000,
    primes: 75000,
    deductions: 35000,
    montant_final: 790000,
    date_paiement: "25/04/2023",
    methode_paiement: "Virement",
    statut: "Payé"
  },
  {
    id: "4",
    nom_complet: "Sophie Mba",
    mois: "Mai",
    annee: "2023",
    montant_base: 350000,
    primes: 0,
    deductions: 10000,
    montant_final: 340000,
    date_paiement: "",
    methode_paiement: "",
    statut: "En attente"
  }
];

const PaieStaticContent: React.FC = () => {
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
          <Button className="flex items-center gap-2">
            <FileSpreadsheet size={16} />
            <span>Nouvelle paie</span>
          </Button>
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
            <p className="text-3xl font-bold">8 475 000 FCFA</p>
            <p className="text-sm text-muted-foreground">Pour 42 employés</p>
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
            <p className="text-3xl font-bold">25 Mai 2023</p>
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
            <p className="text-3xl font-bold text-green-600">+2.3%</p>
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
              <Select defaultValue="all">
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
              <Select defaultValue="2023">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Statut</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paye">Payé</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="annule">Annulé</SelectItem>
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
              {paiementsData.map((paiement) => (
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
                      <Button variant="outline" size="sm">
                        Fiche de paie
                      </Button>
                      {paiement.statut === 'En attente' && (
                        <Button size="sm">
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
    </div>
  );
};

export default PaieStaticContent;
