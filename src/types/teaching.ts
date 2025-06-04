export interface Domaine {
  id: number;
  nom: string;
  description: string;
}

export interface UniteEnseignement {
  id: number;
  nom: string;
  description: string;
  domaines: number[];
}

export interface Matiere {
  id: number;
  nom: string;
  unite: number;
  coefficient: number;
  description: string;
}

export interface MatiereGroupee {
  id: number;
  nom: string;
  matieres: number[];
}

export interface Evenement {
  id: number;
  titre: string;
  type: string | 'COURS' | 'EVALUATION' | 'AUTRE';
  date: string;
  heure_debut: string;
  heure_fin: string;
  palier: number;
  classe_session: number;
  matiere: number;
  barreme: number;
  description: string;
  contenu: string;
  correction: string;
}

export interface FichierEvenement {
  id: number;
  evenement: number;
  fichier: string;
}

export interface Exercice {
  id: number;
  nom: string;
  date: string;
  est_a_rendre: boolean;
  echeance?: string;
  contenu: string;
  evenement?: number;
}

export interface FichierExercice {
  id: number;
  exercice: number;
  fichier: string;
}

export interface Presence {
  id: number;
  evenement: number;
  eleve: number;
  present: boolean;
  retard: boolean;
  justification: string;
}

export interface Note {
  id: number;
  evaluation: number;
  inscription: number;
  note: number;
}

export interface NoteConfig {
  id: number;
  matiere: number;
  enseignant: number;
  classe_session: number;
  formule: string;
}
