
// Base teaching structure
export interface Domaine {
  id: number;
  nom: string;
  description: string;
}

export interface UniteEnseignement {
  id: number;
  nom: string;
  description: string;
  domaines: number[]; // FK to Domaine
}

export interface Matiere {
  id: number;
  unite: number; // FK to UniteEnseignement
  nom: string;
  coefficient: number;
  description: string;
}

export interface MatiereGroupee {
  id: number;
  nom: string;
  matieres: number[]; // FK to Matiere
}

// Events and evaluations
export interface Evenement {
  id: number;
  titre: string;
  type: 'COURS' | 'EVALUATION' | 'DEVOIR' | 'CONTROLE' | 'EXAMEN';
  date: string;
  heure_debut: string;
  heure_fin: string;
  palier: number; // FK to Palier
  classe_session: number; // FK to ClasseSession
  matiere: number; // FK to Matiere
  barreme: number;
  description: string;
  contenu: string;
  correction: string;
}

export interface FichierEvenement {
  id: number;
  evenement: number; // FK to Evenement
  fichier: string; // File path
}

// Exercises
export interface Exercice {
  id: number;
  nom: string;
  date: string;
  est_a_rendre: boolean;
  contenu: string;
}

export interface FichierExercice {
  id: number;
  exercice: number; // FK to Exercice
  fichier: string; // File path
}

// Attendance
export interface Presence {
  id: number;
  evenement: number; // FK to Evenement
  eleve: number; // FK to Eleve
  present: boolean;
  retard: boolean;
  justification: string;
}

// Grades
export interface Note {
  id: number;
  evaluation: number; // FK to Evenement (type EVALUATION)
  inscription: number; // FK to Inscription
  note: number;
}

export interface NoteConfig {
  id: number;
  matiere: number; // FK to Matiere
  enseignant: number; // FK to Enseignant
  classe_session: number; // FK to ClasseSession
  formule: string; // Formula for calculating final grade
}
