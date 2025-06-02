
export interface Succursale {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  est_siege: boolean;
}

export interface Batiment {
  id: string;
  succursale: string; // FK to Succursale
  nom: string;
}

export interface Salle {
  id: string;
  batiment: string; // FK to Batiment
  nom: string;
  capacite: number;
}
