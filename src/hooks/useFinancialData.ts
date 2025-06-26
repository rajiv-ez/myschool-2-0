
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

  // Actions CRUD pour les frais
  const createFrais = async (data: Omit<FraisScolaire, 'id'>) => {
    try {
      const response = await accountingService.createFrais(data);
      setFrais(prev => [...prev, response.data]);
      toast({
        title: "Frais créé",
        description: "Le frais a été créé avec succès",
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le frais",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateFrais = async (id: number, data: Partial<FraisScolaire>) => {
    try {
      const response = await accountingService.updateFrais(id, data);
      setFrais(prev => prev.map(f => f.id === id ? response.data : f));
      toast({
        title: "Frais modifié",
        description: "Le frais a été modifié avec succès",
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le frais",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteFrais = async (id: number) => {
    try {
      await accountingService.deleteFrais(id);
      setFrais(prev => prev.filter(f => f.id !== id));
      toast({
        title: "Frais supprimé",
        description: "Le frais a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le frais",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actions CRUD pour les paiements
  const createPaiement = async (data: Omit<Paiement, 'id'>) => {
    try {
      const response = await accountingService.createPaiement(data);
      setPaiements(prev => [...prev, response.data]);
      toast({
        title: "Paiement créé",
        description: "Le paiement a été créé avec succès",
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le paiement",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePaiement = async (id: number, data: Partial<Paiement>) => {
    try {
      const response = await accountingService.updatePaiement(id, data);
      setPaiements(prev => prev.map(p => p.id === id ? response.data : p));
      toast({
        title: "Paiement modifié",
        description: "Le paiement a été modifié avec succès",
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le paiement",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePaiement = async (id: number) => {
    try {
      await accountingService.deletePaiement(id);
      setPaiements(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Paiement supprimé",
        description: "Le paiement a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le paiement",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actions CRUD pour les dépenses
  const createDepense = async (data: Omit<Depense, 'id'>) => {
    try {
      const response = await accountingService.createDepense(data);
      setDepenses(prev => [...prev, response.data]);
      toast({
        title: "Dépense créée",
        description: "La dépense a été créée avec succès",
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la dépense",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateDepense = async (id: number, data: Partial<Depense>) => {
    try {
      const response = await accountingService.updateDepense(id, data);
      setDepenses(prev => prev.map(d => d.id === id ? response.data : d));
      toast({
        title: "Dépense modifiée",
        description: "La dépense a été modifiée avec succès",
      });
      return response.data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la dépense",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteDepense = async (id: number) => {
    try {
      await accountingService.deleteDepense(id);
      setDepenses(prev => prev.filter(d => d.id !== id));
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la dépense",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Actions d'import
  const importFrais = async (data: Omit<FraisScolaire, 'id'>[]) => {
    try {
      const response = await accountingService.importFrais(data);
      await fetchFinancialData(); // Recharger les données
      toast({
        title: "Import réussi",
        description: `${response.data.length} frais importés`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les frais",
        variant: "destructive"
      });
      throw error;
    }
  };

  const importPaiements = async (data: Omit<Paiement, 'id'>[]) => {
    try {
      const response = await accountingService.importPaiements(data);
      await fetchFinancialData();
      toast({
        title: "Import réussi",
        description: `${response.data.length} paiements importés`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les paiements",
        variant: "destructive"
      });
      throw error;
    }
  };

  const importDepenses = async (data: Omit<Depense, 'id'>[]) => {
    try {
      const response = await accountingService.importDepenses(data);
      await fetchFinancialData();
      toast({
        title: "Import réussi",
        description: `${response.data.length} dépenses importées`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les dépenses",
        variant: "destructive"
      });
      throw error;
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
    
    // Actions CRUD
    createFrais,
    updateFrais,
    deleteFrais,
    createPaiement,
    updatePaiement,
    deletePaiement,
    createDepense,
    updateDepense,
    deleteDepense,
    
    // Actions d'import
    importFrais,
    importPaiements,
    importDepenses,
    
    // Setters pour mise à jour manuelle
    setFrais,
    setPaiements,
    setDepenses
  };
}
