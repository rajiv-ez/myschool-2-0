
export interface Succursale {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  est_siege: boolean;
}

export interface Batiment {
  id: number;
  succursale: number; // FK to Succursale
  nom: string;
}

export interface Salle {
  id: number;
  batiment: number; // FK to Batiment
  nom: string;
  capacite: number;
}
