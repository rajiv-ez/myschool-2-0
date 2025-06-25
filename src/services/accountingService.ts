
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

const mockPaiements: Paiement[] = [
  { 
    id: 1, 
    montant: "25000", 
    statut: 'EN_ATTENTE', 
    frais: 1, 
    inscription: 1, 
    date: '2024-12-01', 
    reference: 'PAY001', 
    user_payeur: null, 
    tiers_payeur: 'Famille Martin' 
  },
  { 
    id: 2, 
    montant: "50000", 
    statut: 'PAYE', 
    frais: 1, 
    inscription: 2, 
    date: '2024-11-15', 
    reference: 'PAY002', 
    user_payeur: null, 
    tiers_payeur: 'Famille Dubois' 
  },
  { 
    id: 3, 
    montant: "30000", 
    statut: 'PAYE_PARTIELLEMENT', 
    frais: 2, 
    inscription: 3, 
    date: '2024-12-10', 
    reference: 'PAY003', 
    user_payeur: null, 
    tiers_payeur: 'Famille Kouadio' 
  },
  { 
    id: 4, 
    montant: "15000", 
    statut: 'PAYE', 
    frais: 3, 
    inscription: 4, 
    date: '2024-12-05', 
    reference: 'PAY004', 
    user_payeur: null, 
    tiers_payeur: 'Famille N\'Guessan' 
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
  getFrais: (): Promise<ApiResponse<FraisScolaire[]>> =>
    fetchWithFallback('/api/accounting/frais-scolaires/', mockFrais),
  getPaiements: (): Promise<ApiResponse<Paiement[]>> =>
    fetchWithFallback('/api/accounting/paiements/', mockPaiements),
  getDepenses: (): Promise<ApiResponse<Depense[]>> =>
    fetchWithFallback('/api/accounting/depenses/', mockDepenses),
};
