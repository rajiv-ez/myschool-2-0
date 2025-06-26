import { useState, useEffect } from 'react';
import { accountingService } from '@/services/accountingService';
import { academicService } from '@/services/academicService';
import { FraisScolaire, FraisIndividuel, Paiement, Depense } from '@/types/accounting';
import { Session, Palier } from '@/types/academic';

export const useFinancialData = () => {
  const [frais, setFrais] = useState<FraisScolaire[]>([]);
  const [fraisIndividuels, setFraisIndividuels] = useState<FraisIndividuel[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [paliers, setPaliers] = useState<Palier[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [fraisResult, fraisIndividuelsResult, paiementsResult, depensesResult, sessionsResult, paliersResult] = await Promise.all([
        accountingService.getFrais(),
        accountingService.getFraisIndividuels(),
        accountingService.getPaiements(),
        accountingService.getDepenses(),
        academicService.getSessions(),
        academicService.getPaliers()
      ]);

      setFrais(fraisResult.data);
      setFraisIndividuels(fraisIndividuelsResult.data);
      setPaiements(paiementsResult.data);
      setDepenses(depensesResult.data);
      setSessions(sessionsResult.data);
      setPaliers(paliersResult.data);
      setFromApi(fraisResult.fromApi || fraisIndividuelsResult.fromApi || paiementsResult.fromApi || depensesResult.fromApi);
    } catch (error) {
      console.error('Erreur lors du chargement des données financières:', error);
    } finally {
      setLoading(false);
    }
  };

  const statistics = {
    totalFrais: frais.reduce((sum, f) => sum + parseFloat(f.montant), 0),
    totalPaiements: paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0),
    totalDepenses: depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0),
    balance: paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0) - depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0),
    fraisEnAttente: fraisIndividuels.filter(f => f.statut === 'EN_ATTENTE').length,
    fraisPayes: fraisIndividuels.filter(f => f.statut === 'PAYE').length
  };

  // CRUD operations for Frais
  const createFrais = async (data: Omit<FraisScolaire, 'id'>) => {
    const result = await accountingService.createFrais(data);
    setFrais(prev => [...prev, result.data]);
    return result.data;
  };

  const updateFrais = async (id: number, data: Partial<FraisScolaire>) => {
    const result = await accountingService.updateFrais(id, data);
    setFrais(prev => prev.map(f => f.id === id ? result.data : f));
    return result.data;
  };

  const deleteFrais = async (id: number) => {
    await accountingService.deleteFrais(id);
    setFrais(prev => prev.filter(f => f.id !== id));
  };

  // CRUD operations for Paiements
  const createPaiement = async (data: Omit<Paiement, 'id'>) => {
    const result = await accountingService.createPaiement(data);
    setPaiements(prev => [...prev, result.data]);
    return result.data;
  };

  const updatePaiement = async (id: number, data: Partial<Paiement>) => {
    const result = await accountingService.updatePaiement(id, data);
    setPaiements(prev => prev.map(p => p.id === id ? result.data : p));
    return result.data;
  };

  const deletePaiement = async (id: number) => {
    await accountingService.deletePaiement(id);
    setPaiements(prev => prev.filter(p => p.id !== id));
  };

  // CRUD operations for Depenses
  const createDepense = async (data: Omit<Depense, 'id'>) => {
    const result = await accountingService.createDepense(data);
    setDepenses(prev => [...prev, result.data]);
    return result.data;
  };

  const updateDepense = async (id: number, data: Partial<Depense>) => {
    const result = await accountingService.updateDepense(id, data);
    setDepenses(prev => prev.map(d => d.id === id ? result.data : d));
    return result.data;
  };

  const deleteDepense = async (id: number) => {
    await accountingService.deleteDepense(id);
    setDepenses(prev => prev.filter(d => d.id !== id));
  };

  // Import operations
  const importFrais = async (data: Omit<FraisScolaire, 'id'>[]) => {
    const result = await accountingService.importFrais(data);
    setFrais(prev => [...prev, ...result.data]);
    return result.data;
  };

  const importPaiements = async (data: Omit<Paiement, 'id'>[]) => {
    const result = await accountingService.importPaiements(data);
    setPaiements(prev => [...prev, ...result.data]);
    return result.data;
  };

  const importDepenses = async (data: Omit<Depense, 'id'>[]) => {
    const result = await accountingService.importDepenses(data);
    setDepenses(prev => [...prev, ...result.data]);
    return result.data;
  };

  return {
    frais,
    fraisIndividuels,
    paiements,
    depenses,
    sessions,
    paliers,
    statistics,
    loading,
    fromApi,
    createFrais,
    updateFrais,
    deleteFrais,
    createPaiement,
    updatePaiement,
    deletePaiement,
    createDepense,
    updateDepense,
    deleteDepense,
    importFrais,
    importPaiements,
    importDepenses
  };
};
