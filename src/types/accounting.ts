export interface FraisScolaire {
  id: number;
  nom: string | null;
  description: string | null;
  session: number;
  palier: number | null;
  est_immateriel: boolean;
  est_obligatoire: boolean;
  est_actif: boolean;
  quantite: number;
  montant: string; // Decimal as string
  echeance: string | null; // ISO date
  date_creation: string; // ISO date
  concerne_toutes_classes: boolean;
  classes: number[]; // ManyToMany: ids of Classe
}

export interface Paiement {
  id: number;
  inscription: number;
  frais: number;
  montant: string;
  date: string;
  reference: string | null;
  user_payeur: number | null;
  tiers_payeur: string | null;
  statut: 'EN_ATTENTE' | 'PAYE_PARTIELLEMENT' | 'PAYE' | 'ANNULE' | 'REMBOURSE';
}

export interface Depense {
  id: number;
  montant: string;
  date: string;
  beneficiaire: string | null;
  reference: string | null;
  description: string;
  categorie:
    | 'MATERIEL'
    | 'MAINTENANCE'
    | 'SALAIRES'
    | 'CHARGES'
    | 'TRANSPORT'
    | 'ALIMENTATION'
    | 'AUTRES';
}
