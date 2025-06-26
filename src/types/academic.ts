
export interface Niveau {
  id: number;
  nom: string;
  ordre: number;
  description: string;
  is_active: boolean;
}

export interface Filiere {
  id: number;
  nom: string;
  niveau: number;
  description: string;
  is_active: boolean;
}

export interface Specialite {
  id: number;
  nom: string;
  filiere: number;
  description: string;
  is_active: boolean;
}

export interface Classe {
  id: number;
  nom: string;
  specialite: number;
  session: number;
  description: string;
  is_active: boolean;
}

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
  nom: string;
  session: number;
  debut: string;
  fin: string;
  en_cours: boolean;
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
  type: 'NORMALE' | 'AVANCEE' | 'RATTRAPAGE';
  statut: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'SUSPENDU';
  est_reinscription: boolean;
}
