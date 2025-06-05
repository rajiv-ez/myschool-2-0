
export interface FraisScolaire {
  id: string;
  nom: string;
  description: string;
  sessionId: string;
  palierId?: string;
  quantite?: number;
  montant: number;
}
