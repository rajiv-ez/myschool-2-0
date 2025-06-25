
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { accountingService } from '@/services/accountingService';
import { FraisScolaire, Paiement, Depense } from '@/types/accounting';

interface UseFinancialDataOptions {
  showToastOnFallback?: boolean;
  autoRefetch?: boolean;
  refetchInterval?: number;
}

export function useFinancialData(options: UseFinancialDataOptions = {}) {
  const [frais, setFrais] = useState<FraisScolaire[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromApi, setFromApi] = useState(false);
  const { toast } = useToast();

  const {
    showToastOnFallback = true,
    autoRefetch = false,
    refetchInterval = 30000,
  } = options;

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [fraisResponse, paiementsResponse, depensesResponse] = await Promise.all([
        accountingService.getFrais(),
        accountingService.getPaiements(),
        accountingService.getDepenses()
      ]);

      setFrais(fraisResponse.data);
      setPaiements(paiementsResponse.data);
      setDepenses(depensesResponse.data);
      setFromApi(fraisResponse.fromApi && paiementsResponse.fromApi && depensesResponse.fromApi);

      if (!fraisResponse.fromApi && showToastOnFallback) {
        toast({
          title: "Mode hors ligne",
          description: "Connexion API indisponible, données locales affichées",
          variant: "default"
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast({
        title: "Erreur",
        description: "Impossible de charger les données financières",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  useEffect(() => {
    if (autoRefetch && fromApi) {
      const interval = setInterval(fetchFinancialData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefetch, refetchInterval, fromApi]);

  // Calcul des statistiques en temps réel
  const statistics = {
    totalPaiements: paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0),
    totalDepenses: depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0),
    totalFrais: frais.reduce((sum, f) => sum + parseFloat(f.montant) * f.quantite, 0),
    paiementsEnAttente: paiements.filter(p => p.statut === 'EN_ATTENTE').length,
    paiementsPayes: paiements.filter(p => p.statut === 'PAYE').length,
    balance: 0 // sera calculé
  };

  statistics.balance = statistics.totalPaiements - statistics.totalDepenses;

  return {
    frais,
    paiements,
    depenses,
    loading,
    error,
    fromApi,
    statistics,
    refetch: fetchFinancialData,
    setFrais,
    setPaiements,
    setDepenses
  };
}
