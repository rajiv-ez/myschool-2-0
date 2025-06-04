export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  genre: 'M' | 'F' | 'A';
  date_naissance: string;
  lieu_naissance: string;
  adresse: string;
  tel1: string;
  tel2?: string;
  whatsapp?: string;
  photo?: string | null;
  is_staff: boolean;
  is_active: boolean;
}

export interface Staff {
  id: number;
  user: number;
  poste: number;
  date_embauche: string;
  statut: 'ACTIF' | 'CONGE' | 'SUSPENDU' | 'INACTIF';
  domaines: number[];
  niveaux: number[];
}

export interface Tuteur {
  id: number;
  user: number;
  profession: string;
}

export interface Eleve {
  id: number;
  user: number;
  matricule: string;
  tuteurs: number[];
}

export interface RelationEleveTuteur {
  id: number;
  eleve: number;
  tuteur: number;
  relation: string;
}
