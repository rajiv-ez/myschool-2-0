
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Download, Upload, Eye, Edit, Trash2, Wifi, WifiOff } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import TotalsSummary from '../payments/TotalsSummary';
import DateRangeFilter from '../payments/DateRangeFilter';
import { Paiement } from '@/types/accounting';

const PaiementsManagement: React.FC = () => {
  const { paiements, loading, fromApi, statistics } = useFinancialData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getStatusBadge = (statut: Paiement['statut']) => {
    const variants = {
      'EN_ATTENTE': 'secondary',
      'PAYE_PARTIELLEMENT': 'default',
      'PAYE': 'default',
      'ANNULE': 'destructive',
      'REMBOURSE': 'outline'
    } as const;

    const colors = {
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'PAYE_PARTIELLEMENT': 'bg-blue-100 text-blue-800',
      'PAYE': 'bg-green-100 text-green-800',
      'ANNULE': 'bg-red-100 text-red-800',
      'REMBOURSE': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant={variants[statut]} className={colors[statut]}>
        {statut.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredPaiements = paiements.filter(paiement => {
    const matchesSearch = paiement.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paiement.tiers_payeur?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || paiement.statut === statusFilter;
    const matchesDateRange = !startDate || !endDate || 
                           (paiement.date >= startDate && paiement.date <= endDate);
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleFilterByDate = () => {
    // La logique de filtrage est déjà appliquée dans filteredPaiements
    console.log('Filtrage par date appliqué');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return <div className="p-4">Chargement des paiements...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-end mb-3">
        <Badge variant={fromApi ? "default" : "secondary"} className="flex items-center gap-1">
          {fromApi ? (
            <>
              <Wifi size={12} />
              En ligne
            </>
          ) : (
            <>
              <WifiOff size={12} />
              Hors ligne
            </>
          )}
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des Paiements</h2>
          <p className="text-muted-foreground">Suivi des paiements et transactions financières</p>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload size={16} />
            Importer
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Exporter
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <TotalsSummary 
        totalIn={statistics.totalPaiements} 
        totalOut={statistics.totalDepenses} 
      />

      {/* Filtres */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFilter={handleFilterByDate}
        onReset={handleResetFilters}
      />

      {/* Filtres de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par référence ou payeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                <SelectItem value="PAYE_PARTIELLEMENT">Payé partiellement</SelectItem>
                <SelectItem value="PAYE">Payé</SelectItem>
                <SelectItem value="ANNULE">Annulé</SelectItem>
                <SelectItem value="REMBOURSE">Remboursé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements ({filteredPaiements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Payeur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPaiements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun paiement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPaiements.map((paiement) => (
                    <TableRow key={paiement.id}>
                      <TableCell className="font-mono">#{paiement.id}</TableCell>
                      <TableCell className="font-semibold">
                        {parseFloat(paiement.montant).toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        {new Date(paiement.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{paiement.reference || '-'}</TableCell>
                      <TableCell>{paiement.tiers_payeur || '-'}</TableCell>
                      <TableCell>{getStatusBadge(paiement.statut)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Eye size={16} />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit size={16} />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaiementsManagement;
