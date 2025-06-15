
export interface Succursale {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  telephone: string;
  email: string;
  est_siege: boolean;
  description: string;
}

export interface Batiment {
  id: number;
  succursale: number; // FK to Succursale
  nom: string;
  description: string;
}

export interface Salle {
  id: number;
  batiment: number; // FK to Batiment
  nom: string;
  capacite: number;
  description: string;
}
