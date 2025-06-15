
// src/types/academic.ts
export interface Session {
  id: number;
  nom: string;
  debut: string;
  fin: string;
  en_cours: boolean;
  auto_activer_palier: boolean;
  description: string;
  is_active: boolean;
}

export interface Palier {
  id: number;
  session: number;
  nom: string;
  debut: string;
  fin: string;
  en_cours: boolean;
  description: string;
  is_active: boolean;
}

export interface Niveau {
  id: number;
  nom: string;
  ordre: number;
  description?: string;
  is_active: boolean;
}

export interface Filiere {
  id: number;
  niveau: number;
  nom: string;
  description: string;
  is_active: boolean;
}

export interface Specialite {
  id: number;
  filiere: number;
  nom: string;
  description: string;
  is_active: boolean;
}

export interface Classe {
  id: number;
  specialite: number;
  nom: string;
  description: string;
  is_active: boolean;
}

export interface ClasseSession {
  id: number;
  classe: number;
  session: number;
  capacite: number;
  is_active: boolean;
}

export interface Inscription {
  id: number;
  eleve: number;
  classe_session: number;
  date_inscription: string;
  est_reinscription: boolean;
  decision_conseil?: string;
  motif_reinscription?: string;
  statut: 'CONFIRMEE' | 'EN_ATTENTE' | 'ANNULEE';
}
