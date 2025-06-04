export interface Poste {
  id: number;
  nom: string;
  code: string | null;
  description: string;
  niveau_hierarchique: number;
  est_direction: boolean;
  actif: boolean;
  date_creation: string;
}

export interface ClauseContrat {
  id: number;
  titre: string;
  contenu: string;
}

export interface Contrat {
  id: number;
  staff: number;
  type_contrat: string;
  date_debut: string;
  date_fin: string | null;
  salaire_base: number;
  avantages: string;
  clauses: number[];
}

export interface Absence {
  id: number;
  staff: number;
  date_debut: string;
  date_fin: string;
  motif: string;
  justifiee: boolean;
  statut: string;
}

export interface Paie {
  id: number;
  staff: number;
  mois: string;
  salaire_base: number;
  primes: number;
  retenues: number;
  net_a_payer: number;
  date_versement: string | null;
  methode_paiement: string;
  statut: string;
}

export interface Pointage {
  id: number;
  staff: number;
  date: string;
  heure_arrivee: string | null;
  heure_depart: string | null;
  commentaire: string;
}

export interface PauseJournaliere {
  id: number;
  pointage: number;
  heure_debut: string;
  heure_fin: string;
}
