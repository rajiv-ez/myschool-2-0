import { fetchWithFallback, ApiResponse } from './api';
import { FraisScolaire, Paiement, Depense } from '../types/accounting';

const mockFrais: FraisScolaire[] = [
  { 
    id: 1, 
    nom: 'Frais d\'inscription', 
    description: 'Frais d\'inscription pour l\'année scolaire', 
    session: 1,
    palier: null,
    montant: "50000",
    est_immateriel:false,est_obligatoire:true, est_actif:true, quantite:1, echeance:null, date_creation:'2024-05-01', concerne_toutes_classes:true, classes:[]
  },
  { 
    id: 2, 
    nom: 'Mensualité Octobre', 
    description: 'Mensualité pour le mois d\'octobre', 
    session: 1,
    palier: 1,
    montant: "25000",
    est_immateriel:false,est_obligatoire:true, est_actif:true, quantite:1, echeance:null, date_creation:'2024-05-01', concerne_toutes_classes:true, classes:[]
  },
  { 
    id: 3, 
    nom: 'Tenue scolaire', 
    description: 'Uniforme obligatoire', 
    session: 1,
    palier: null,
    quantite: 50,
    montant: "15000",
    est_immateriel:false,est_obligatoire:true, est_actif:true, echeance:null, date_creation:'2024-05-01', concerne_toutes_classes:true, classes:[]
  },
  { 
    id: 4, 
    nom: 'Frais d\'inscription', 
    description: 'Frais d\'inscription pour l\'année scolaire', 
    session: 2,
    palier: null,
    montant: "55000",
    est_immateriel:false,est_obligatoire:true, est_actif:true, quantite:1, echeance:null, date_creation:'2024-05-01', concerne_toutes_classes:true, classes:[]
  },
  { 
    id: 5, 
    nom: 'Mensualité Septembre', 
    description: 'Mensualité pour le mois de septembre', 
    session: 2,
    palier: 4,
    montant: "27000",
    est_immateriel:false,est_obligatoire:true, est_actif:true, quantite:1, echeance:null, date_creation:'2024-05-01', concerne_toutes_classes:true, classes:[]
  },
];

const mockPaiements: Paiement[] = [
  { id: 1, montant: "25000", statut: 'EN_ATTENTE', frais: 1, inscription: 1, date: '2024-05-01', reference: null, user_payeur: null, tiers_payeur: null },
  { id: 2, montant: "50000", statut: 'PAYE', frais: 1, inscription: 1, date: '2024-05-01', reference: null, user_payeur: null, tiers_payeur: null },
];

const mockDepenses: Depense[] = [
  { id: 1, montant: "20000", description: 'Achat cahiers', categorie: 'MATERIEL', date: '2024-05-01', beneficiaire: null, reference: null },
  { id: 1, montant: "15000", description: 'Réparation projecteur', categorie: 'MAINTENANCE', date: '2024-05-02', beneficiaire: null, reference: null },
];

export const accountingService = {
  getFrais: (): Promise<ApiResponse<FraisScolaire[]>> =>
    fetchWithFallback('/api/accounting/frais-scolaires/', mockFrais),
  getPaiements: (): Promise<ApiResponse<Paiement[]>> =>
    fetchWithFallback('/api/accounting/paiements/', mockPaiements),
  getDepenses: (): Promise<ApiResponse<Depense[]>> =>
    fetchWithFallback('/api/accounting/depenses/', mockDepenses),
};
