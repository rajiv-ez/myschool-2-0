import { fetchWithFallback, ApiResponse } from './api';
import { FraisScolaire, FraisIndividuel, Paiement, Depense } from '../types/accounting';

const mockFrais: FraisScolaire[] = [
  { 
    id: 1, 
    nom: 'Frais d\'inscription', 
    description: 'Frais d\'inscription pour l\'année scolaire', 
    session: 1,
    palier: null,
    montant: "50000",
    est_immateriel: false,
    est_obligatoire: true, 
    est_actif: true, 
    quantite: 1, 
    echeance: null, 
    date_creation: '2024-05-01', 
    concerne_toutes_classes: true, 
    classes: []
  },
  { 
    id: 2, 
    nom: 'Mensualité Octobre', 
    description: 'Mensualité pour le mois d\'octobre', 
    session: 1,
    palier: 1,
    montant: "25000",
    est_immateriel: false,
    est_obligatoire: true, 
    est_actif: true, 
    quantite: 1, 
    echeance: null, 
    date_creation: '2024-05-01', 
    concerne_toutes_classes: true, 
    classes: []
  },
  { 
    id: 3, 
    nom: 'Tenue scolaire', 
    description: 'Uniforme obligatoire', 
    session: 1,
    palier: null,
    quantite: 50,
    montant: "15000",
    est_immateriel: false,
    est_obligatoire: true, 
    est_actif: true, 
    echeance: null, 
    date_creation: '2024-05-01', 
    concerne_toutes_classes: true, 
    classes: []
  },
  { 
    id: 4, 
    nom: 'Frais d\'inscription', 
    description: 'Frais d\'inscription pour l\'année scolaire', 
    session: 2,
    palier: null,
    montant: "55000",
    est_immateriel: false,
    est_obligatoire: true, 
    est_actif: true, 
    quantite: 1, 
    echeance: null, 
    date_creation: '2024-05-01', 
    concerne_toutes_classes: true, 
    classes: []
  },
  { 
    id: 5, 
    nom: 'Mensualité Septembre', 
    description: 'Mensualité pour le mois de septembre', 
    session: 2,
    palier: 4,
    montant: "27000",
    est_immateriel: false,
    est_obligatoire: true, 
    est_actif: true, 
    quantite: 1, 
    echeance: null, 
    date_creation: '2024-05-01', 
    concerne_toutes_classes: true, 
    classes: []
  },
];

const mockFraisIndividuels: FraisIndividuel[] = [
  {
    id: 1,
    inscription: 1,
    frais: 1,
    montant: "50000",
    statut: 'EN_ATTENTE',
    date_creation: '2024-12-01'
  },
  {
    id: 2,
    inscription: 2,
    frais: 1,
    montant: "50000",
    statut: 'PAYE',
    date_creation: '2024-11-15'
  },
  {
    id: 3,
    inscription: 3,
    frais: 2,
    montant: "25000",
    statut: 'PAYE_PARTIELLEMENT',
    date_creation: '2024-12-10'
  }
];

const mockPaiements: Paiement[] = [
  { 
    id: 1, 
    frais_individuel: 1,
    inscription: 1,
    frais: 1,
    montant: "25000", 
    date: '2024-12-01', 
    reference: 'PAY001', 
    user_payeur: null, 
    tiers_payeur: 'Famille Martin',
    methode_paiement: 'ESPECES',
    statut: 'EN_ATTENTE'
  },
  { 
    id: 2, 
    frais_individuel: 2,
    inscription: 2,
    frais: 1,
    montant: "50000", 
    date: '2024-11-15', 
    reference: 'PAY002', 
    user_payeur: null, 
    tiers_payeur: 'Famille Dubois',
    methode_paiement: 'VIREMENT',
    statut: 'PAYE'
  },
  { 
    id: 3, 
    frais_individuel: 3,
    inscription: 3,
    frais: 2,
    montant: "15000", 
    date: '2024-12-10', 
    reference: 'PAY003', 
    user_payeur: null, 
    tiers_payeur: 'Famille Kouadio',
    methode_paiement: 'CARTE',
    statut: 'PAYE_PARTIELLEMENT'
  }
];

const mockDepenses: Depense[] = [
  { 
    id: 1, 
    montant: "20000", 
    description: 'Achat cahiers et fournitures scolaires', 
    categorie: 'MATERIEL', 
    date: '2024-11-20', 
    beneficiaire: 'Librairie Papeterie Moderne', 
    reference: 'DEP001' 
  },
  { 
    id: 2, 
    montant: "15000", 
    description: 'Réparation projecteur salle informatique', 
    categorie: 'MAINTENANCE', 
    date: '2024-12-02', 
    beneficiaire: 'TechnoService', 
    reference: 'DEP002' 
  },
  { 
    id: 3, 
    montant: "75000", 
    description: 'Salaire personnel d\'entretien', 
    categorie: 'SALAIRES', 
    date: '2024-12-01', 
    beneficiaire: 'Personnel d\'entretien', 
    reference: 'SAL001' 
  },
  { 
    id: 4, 
    montant: "12000", 
    description: 'Électricité mois de novembre', 
    categorie: 'CHARGES', 
    date: '2024-12-05', 
    beneficiaire: 'CIE', 
    reference: 'ELEC001' 
  },
  { 
    id: 5, 
    montant: "8000", 
    description: 'Transport matériel pédagogique', 
    categorie: 'TRANSPORT', 
    date: '2024-12-08', 
    beneficiaire: 'Transport Logistics', 
    reference: 'TRANS001' 
  }
];

export const accountingService = {
  // Frais Scolaires
  getFrais: (): Promise<ApiResponse<FraisScolaire[]>> =>
    fetchWithFallback('/api/accounting/frais-scolaires/', mockFrais),
  
  createFrais: async (frais: Omit<FraisScolaire, 'id'>): Promise<ApiResponse<FraisScolaire>> => {
    try {
      const response = await fetch('/api/accounting/frais-scolaires/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frais)
      });
      const data = await response.json();
      return { data, fromApi: true };
    } catch (error) {
      // Fallback: simuler la création localement
      const newFrais = { ...frais, id: Date.now() };
      mockFrais.push(newFrais);
      return { data: newFrais, fromApi: false };
    }
  },

  updateFrais: async (id: number, frais: Partial<FraisScolaire>): Promise<ApiResponse<FraisScolaire>> => {
    try {
      const response = await fetch(`/api/accounting/frais-scolaires/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frais)
      });
      const data = await response.json();
      return { data, fromApi: true };
    } catch (error) {
      // Fallback: mise à jour locale
      const index = mockFrais.findIndex(f => f.id === id);
      if (index !== -1) {
        mockFrais[index] = { ...mockFrais[index], ...frais };
        return { data: mockFrais[index], fromApi: false };
      }
      throw new Error('Frais non trouvé');
    }
  },

  deleteFrais: async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      await fetch(`/api/accounting/frais-scolaires/${id}/`, {
        method: 'DELETE'
      });
      return { data: { success: true }, fromApi: true };
    } catch (error) {
      // Fallback: suppression locale
      const index = mockFrais.findIndex(f => f.id === id);
      if (index !== -1) {
        mockFrais.splice(index, 1);
        return { data: { success: true }, fromApi: false };
      }
      throw new Error('Frais non trouvé');
    }
  },

  // Frais Individuels
  getFraisIndividuels: (): Promise<ApiResponse<FraisIndividuel[]>> =>
    fetchWithFallback('/api/accounting/frais-individuels/', mockFraisIndividuels),

  // Paiements
  getPaiements: (): Promise<ApiResponse<Paiement[]>> =>
    fetchWithFallback('/api/accounting/paiements/', mockPaiements),

  createPaiement: async (paiement: Omit<Paiement, 'id'>): Promise<ApiResponse<Paiement>> => {
    try {
      const response = await fetch('/api/accounting/paiements/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paiement)
      });
      const data = await response.json();
      return { data, fromApi: true };
    } catch (error) {
      const newPaiement = { ...paiement, id: Date.now() };
      mockPaiements.push(newPaiement);
      return { data: newPaiement, fromApi: false };
    }
  },

  updatePaiement: async (id: number, paiement: Partial<Paiement>): Promise<ApiResponse<Paiement>> => {
    try {
      const response = await fetch(`/api/accounting/paiements/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paiement)
      });
      const data = await response.json();
      return { data, fromApi: true };
    } catch (error) {
      const index = mockPaiements.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPaiements[index] = { ...mockPaiements[index], ...paiement };
        return { data: mockPaiements[index], fromApi: false };
      }
      throw new Error('Paiement non trouvé');
    }
  },

  deletePaiement: async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      await fetch(`/api/accounting/paiements/${id}/`, {
        method: 'DELETE'
      });
      return { data: { success: true }, fromApi: true };
    } catch (error) {
      const index = mockPaiements.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPaiements.splice(index, 1);
        return { data: { success: true }, fromApi: false };
      }
      throw new Error('Paiement non trouvé');
    }
  },

  // Dépenses
  getDepenses: (): Promise<ApiResponse<Depense[]>> =>
    fetchWithFallback('/api/accounting/depenses/', mockDepenses),

  createDepense: async (depense: Omit<Depense, 'id'>): Promise<ApiResponse<Depense>> => {
    try {
      const response = await fetch('/api/accounting/depenses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depense)
      });
      const data = await response.json();
      return { data, fromApi: true };
    } catch (error) {
      const newDepense = { ...depense, id: Date.now() + Math.random() };
      mockDepenses.push(newDepense);
      return { data: newDepense, fromApi: false };
    }
  },

  updateDepense: async (id: number, depense: Partial<Depense>): Promise<ApiResponse<Depense>> => {
    try {
      const response = await fetch(`/api/accounting/depenses/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depense)
      });
      const data = await response.json();
      return { data, fromApi: true };
    } catch (error) {
      const index = mockDepenses.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDepenses[index] = { ...mockDepenses[index], ...depense };
        return { data: mockDepenses[index], fromApi: false };
      }
      throw new Error('Dépense non trouvée');
    }
  },

  deleteDepense: async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      await fetch(`/api/accounting/depenses/${id}/`, {
        method: 'DELETE'
      });
      return { data: { success: true }, fromApi: true };
    } catch (error) {
      const index = mockDepenses.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDepenses.splice(index, 1);
        return { data: { success: true }, fromApi: false };
      }
      throw new Error('Dépense non trouvée');
    }
  },

  // Import/Export
  importFrais: async (data: Omit<FraisScolaire, 'id'>[]): Promise<ApiResponse<FraisScolaire[]>> => {
    try {
      const response = await fetch('/api/accounting/frais-scolaires/import/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      const result = await response.json();
      return { data: result, fromApi: true };
    } catch (error) {
      // Fallback: ajout local
      const newFrais = data.map(item => ({ ...item, id: Date.now() + Math.random() }));
      mockFrais.push(...newFrais);
      return { data: newFrais, fromApi: false };
    }
  },

  importPaiements: async (data: Omit<Paiement, 'id'>[]): Promise<ApiResponse<Paiement[]>> => {
    try {
      const response = await fetch('/api/accounting/paiements/import/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      const result = await response.json();
      return { data: result, fromApi: true };
    } catch (error) {
      const newPaiements = data.map(item => ({ ...item, id: Date.now() + Math.random() }));
      mockPaiements.push(...newPaiements);
      return { data: newPaiements, fromApi: false };
    }
  },

  importDepenses: async (data: Omit<Depense, 'id'>[]): Promise<ApiResponse<Depense[]>> => {
    try {
      const response = await fetch('/api/accounting/depenses/import/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      const result = await response.json();
      return { data: result, fromApi: true };
    } catch (error) {
      const newDepenses = data.map(item => ({ ...item, id: Date.now() + Math.random() }));
      mockDepenses.push(...newDepenses);
      return { data: newDepenses, fromApi: false };
    }
  }
};
