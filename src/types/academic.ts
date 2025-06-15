
// src/types/academic.ts
export interface Session {
  id: number;
  nom: string;
  debut: string;
  fin: string;
  en_cours: boolean;
  auto_activer_palier: boolean;
}

export interface Palier {
  id: number;
  session: number;
  nom: string;
  debut: string;
  fin: string;
  en_cours: boolean;
}

export interface Niveau {
  id: number;
  nom: string;
  description?: string;
}

export interface Filiere {
  id: number;
  niveau: number;
  nom: string;
  description: string;
}

export interface Specialite {
  id: number;
  filiere: number;
  nom: string;
  description: string;
}

export interface Classe {
  id: number;
  specialite: number;
  nom: string;
  description: string;
}

export interface ClasseSession {
  id: number;
  classe: number;
  session: number;
  capacite: number;
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
