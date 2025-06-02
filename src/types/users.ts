
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  genre: string;
  date_naissance: string; // ISO date string
  lieu_naissance: string;
  adresse: string;
  tel1: string;
  tel2: string;
  whatsapp: string;
  photo?: string;
}

export interface Staff {
  id: string;
  user: string; // FK to User
  poste: string; // FK to hr.poste
  date_embauche: string; // ISO date string
  statut: 'ACTIF' | 'CONGE' | 'SUSPENDU' | 'INACTIF';
  domaines: string[]; // Many-to-many with teaching.domaine
  niveaux: string[]; // Many-to-many with academic.niveau
}

export interface Tuteur {
  id: string;
  user: string; // FK to User
  profession: string;
}

export interface Eleve {
  id: string;
  user: string; // FK to User
  matricule: string;
}

export interface RelationEleveTuteur {
  id: string;
  eleve: string; // FK to Eleve
  tuteur: string; // FK to Tuteur
  relation: string;
}
