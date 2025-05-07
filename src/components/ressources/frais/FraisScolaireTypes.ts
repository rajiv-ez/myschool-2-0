
export interface Session {
  id: string;
  name: string;
  paliers: Palier[];
}

export interface Palier {
  id: string;
  name: string;
  sessionId: string;
}

export interface FraisScolaire {
  id: string;
  nom: string;
  description: string;
  sessionId: string;
  palierId?: string;
  quantite?: number;
  montant: number;
}
