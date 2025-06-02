
export interface CategorieArticle {
  id: string;
  nom: string;
  description: string;
}

export interface Article {
  id: string;
  nom: string;
  description: string;
  categorie: string; // FK to CategorieArticle
  quantite: number;
  seuil?: number;
  etat: 'neuf' | 'bon etat' | 'utilisé' | 'à reparer' | 'hors service';
  date_achat: string; // ISO date string
  prix_achat: number;
  prix_vente?: number;
}

export interface DemandeActif {
  id: string;
  demandeur: string; // FK to Staff
  article: string; // FK to Article
  quantite: number;
  motif: string;
  date: string; // ISO date string
  statut: 'en attente' | 'approuvée' | 'refusée';
  motif_refus?: string;
}
