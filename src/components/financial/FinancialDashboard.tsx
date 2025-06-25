
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Wifi, WifiOff } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import TotalsSummary from '../payments/TotalsSummary';

const FinancialDashboard: React.FC = () => {
  const { statistics, loading, fromApi, paiements, depenses } = useFinancialData();

  if (loading) {
    return <div className="p-4">Chargement du tableau de bord financier...</div>;
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthPaiements = paiements.filter(p => {
    const paiementDate = new Date(p.date);
    return paiementDate.getMonth() === currentMonth && paiementDate.getFullYear() === currentYear;
  });

  const thisMonthDepenses = depenses.filter(d => {
    const depenseDate = new Date(d.date);
    return depenseDate.getMonth() === currentMonth && depenseDate.getFullYear() === currentYear;
  });

  const thisMonthTotal = {
    paiements: thisMonthPaiements.reduce((sum, p) => sum + parseFloat(p.montant), 0),
    depenses: thisMonthDepenses.reduce((sum, d) => sum + parseFloat(d.montant), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header avec statut de connexion */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tableau de Bord Financier</h2>
          <p className="text-muted-foreground">Vue d'ensemble de la situation financière</p>
        </div>
        <Badge variant={fromApi ? "default" : "secondary"} className="flex items-center gap-1">
          {fromApi ? (
            <>
              <Wifi size={12} />
              En ligne - Données synchronisées
            </>
          ) : (
            <>
              <WifiOff size={12} />
              Hors ligne - Données locales
            </>
          )}
        </Badge>
      </div>

      {/* Résumé des totaux */}
      <TotalsSummary 
        totalIn={statistics.totalPaiements} 
        totalOut={statistics.totalDepenses} 
      />

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statistics.paiementsEnAttente}</p>
            <p className="text-xs text-muted-foreground">
              À traiter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paiements validés</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statistics.paiementsPayes}</p>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entrées ce mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{thisMonthTotal.paiements.toLocaleString()} FCFA</p>
            <p className="text-xs text-muted-foreground">
              {thisMonthPaiements.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sorties ce mois</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{thisMonthTotal.depenses.toLocaleString()} FCFA</p>
            <p className="text-xs text-muted-foreground">
              {thisMonthDepenses.length} dépenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur les données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} />
            État du système financier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Source des données:</span>
              <Badge variant={fromApi ? "default" : "secondary"}>
                {fromApi ? "API en ligne" : "Données locales (mode hors ligne)"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Total frais scolaires configurés:</span>
              <span className="font-semibold">{statistics.totalFrais.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Solde global:</span>
              <span className={`font-bold ${statistics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {statistics.balance.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
