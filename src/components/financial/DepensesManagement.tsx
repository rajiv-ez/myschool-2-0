
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Download, Upload, Eye, Edit, Trash2, Wifi, WifiOff, Receipt } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Depense } from '@/types/accounting';

const DepensesManagement: React.FC = () => {
  const { depenses, loading, fromApi } = useFinancialData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categorieFilter, setCategorieFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getCategoryBadge = (categorie: Depense['categorie']) => {
    const colors = {
      'MATERIEL': 'bg-blue-100 text-blue-800',
      'MAINTENANCE': 'bg-orange-100 text-orange-800',
      'SALAIRES': 'bg-green-100 text-green-800',
      'CHARGES': 'bg-purple-100 text-purple-800',
      'TRANSPORT': 'bg-yellow-100 text-yellow-800',
      'ALIMENTATION': 'bg-red-100 text-red-800',
      'AUTRES': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="secondary" className={colors[categorie]}>
        {categorie}
      </Badge>
    );
  };

  const filteredDepenses = depenses.filter(depense => {
    const matchesSearch = depense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         depense.beneficiaire?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie = categorieFilter === 'all' || depense.categorie === categorieFilter;
    const matchesDateRange = !startDate || !endDate || 
                           (depense.date >= startDate && depense.date <= endDate);
    
    return matchesSearch && matchesCategorie && matchesDateRange;
  });

  if (loading) {
    return <div className="p-4">Chargement des dépenses...</div>;
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
        <div className="flex items-center gap-3">
          <Receipt size={24} />
          <div>
            <h2 className="text-xl font-semibold">Gestion des Dépenses</h2>
            <p className="text-muted-foreground">Suivi et gestion des dépenses scolaires</p>
          </div>
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
            Nouvelle dépense
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categorieFilter} onValueChange={setCategorieFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="MATERIEL">Matériel</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="SALAIRES">Salaires</SelectItem>
                <SelectItem value="CHARGES">Charges</SelectItem>
                <SelectItem value="TRANSPORT">Transport</SelectItem>
                <SelectItem value="ALIMENTATION">Alimentation</SelectItem>
                <SelectItem value="AUTRES">Autres</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Date début"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Date fin"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des dépenses ({filteredDepenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Bénéficiaire</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucune dépense trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepenses.map((depense) => (
                    <TableRow key={depense.id}>
                      <TableCell className="font-mono">#{depense.id}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{depense.description}</div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {parseFloat(depense.montant).toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        {new Date(depense.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{depense.beneficiaire || '-'}</TableCell>
                      <TableCell>{getCategoryBadge(depense.categorie)}</TableCell>
                      <TableCell>{depense.reference || '-'}</TableCell>
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

export default DepensesManagement;
