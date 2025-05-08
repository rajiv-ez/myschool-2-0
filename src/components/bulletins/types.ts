
export interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classe: string;
}

export interface Matiere {
  id: string;
  nom: string;
  coefficient: number;
  uniteEnseignementId: string;
}

export interface UniteEnseignement {
  id: string;
  nom: string;
  coefficient: number;
}

export interface Note {
  eleveId: string;
  matiereId: string;
  valeur: number;
  appreciation?: string;
}

export interface FilterOptions {
  session: string;
  palier: string;
  classe: string;
}
