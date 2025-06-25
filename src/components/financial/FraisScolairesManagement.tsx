
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Download, Upload, Eye, Edit, Trash2, Wifi, WifiOff, GraduationCap } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { FraisScolaire } from '@/types/accounting';

const FraisScolairesManagement: React.FC = () => {
  const { frais, loading, fromApi } = useFinancialData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredFrais = frais.filter(frais => {
    const matchesSearch = frais.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         frais.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSession = sessionFilter === 'all' || frais.session.toString() === sessionFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'actif' && frais.est_actif) ||
                         (statusFilter === 'inactif' && !frais.est_actif);
    
    return matchesSearch && matchesSession && matchesStatus;
  });

  const sessions = [...new Set(frais.map(f => f.session))].sort();

  if (loading) {
    return <div className="p-4">Chargement des frais scolaires...</div>;
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
          <GraduationCap size={24} />
          <div>
            <h2 className="text-xl font-semibold">Frais Scolaires</h2>
            <p className="text-muted-foreground">Gestion des frais et tarifs scolaires</p>
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
            Nouveau frais
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {sessions.map(session => (
                  <SelectItem key={session} value={session.toString()}>
                    Session {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="actif">Actifs</SelectItem>
                <SelectItem value="inactif">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des frais */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des frais scolaires ({filteredFrais.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Obligatoire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFrais.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun frais trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFrais.map((frais) => (
                    <TableRow key={frais.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{frais.nom}</div>
                          {frais.description && (
                            <div className="text-sm text-muted-foreground">{frais.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Session {frais.session}</TableCell>
                      <TableCell className="font-semibold">
                        {parseFloat(frais.montant).toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>{frais.quantite}</TableCell>
                      <TableCell>
                        <Badge variant={frais.est_obligatoire ? "default" : "secondary"}>
                          {frais.est_obligatoire ? "Oui" : "Non"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={frais.est_actif ? "default" : "secondary"}>
                          {frais.est_actif ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
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

export default FraisScolairesManagement;
