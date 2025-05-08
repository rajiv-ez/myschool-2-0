
export interface PersonnelMember {
  id: string;
  photo?: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  genre: 'Masculin' | 'Féminin' | 'Autre';
  adresse: string;
  tel1: string;
  tel2?: string;
  whatsapp?: string;
  email: string;
  poste: string;
  matieres: string[];
  niveaux: string[];
  statut: 'Actif' | 'En congé' | 'Suspendu' | 'Inactif';
  date_embauche: string;
}

export interface Contrat {
  id: string;
  personnel_id: string;
  nom_complet: string;
  type_contrat: string;
  date_debut: string;
  date_fin?: string;
  salaire: string;
  statut: 'Actif' | 'Terminé' | 'Suspendu';
  clauses?: ContractClause[];
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Absence {
  id: string;
  personnel_id: string;
  nom_complet: string;
  date_debut: string;
  date_fin: string;
  motif: string;
  justificatif?: boolean;
  statut: 'Validée' | 'En attente' | 'Refusée';
}

export interface PaiementSalaire {
  id: string;
  personnel_id: string;
  nom_complet: string;
  mois: string;
  annee: string;
  montant_base: number;
  primes: number;
  deductions: number;
  montant_final: number;
  date_paiement: string;
  methode_paiement: string;
  statut: 'Payé' | 'En attente' | 'Annulé';
}

export interface Pointage {
  id: string;
  personnel_id: string;
  nom_complet: string;
  date: string;
  heure_arrivee: string;
  heure_debut_pause?: string;
  heure_fin_pause?: string;
  heure_depart?: string;
  statut: 'Présent' | 'En pause' | 'Absent' | 'Parti';
  commentaire?: string;
}

export interface FichePaie {
  id: string;
  paiement_id: string;
  personnel_id: string;
  nom_complet: string;
  poste: string;
  mois: string;
  annee: string;
  salaire_base: number;
  heures_travaillees?: number;
  primes: PrimeDeduction[];
  deductions: PrimeDeduction[];
  total_brut: number;
  total_net: number;
  date_generation: string;
}

export interface PrimeDeduction {
  libelle: string;
  montant: number;
}
