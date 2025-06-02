
export interface Session {
  id: string;
  nom: string;
  debut: string; // ISO date string
  fin: string; // ISO date string
  en_cours: boolean;
  auto_activer_palier: boolean;
}

export interface Palier {
  id: string;
  session: string; // FK to Session
  nom: string;
  debut: string; // ISO date string
  fin: string; // ISO date string
  en_cours: boolean;
}

export interface Niveau {
  id: string;
  nom: string;
}

export interface Filiere {
  id: string;
  niveau: string; // FK to Niveau
  nom: string;
  description: string;
}

export interface Specialite {
  id: string;
  filiere: string; // FK to Filiere
  nom: string;
  description: string;
}

export interface Classe {
  id: string;
  specialite: string; // FK to Specialite
  nom: string;
  description: string;
}

export interface ClasseSession {
  id: string;
  classe: string; // FK to Classe
  session: string; // FK to Session
  capacite: number;
}

export interface Inscription {
  id: string;
  eleve: string; // FK to Eleve
  classe_session: string; // FK to ClasseSession
  date_inscription: string; // ISO date string
  est_reinscription: boolean;
  decision_conseil?: string;
  motif_reinscription?: string;
  statut: 'CONFIRMEE' | 'EN_ATTENTE' | 'ANNULEE';
}
