export interface CategorieArticle {
  id: number;
  nom: string;
  description: string | null;
}

export interface Article {
  id: number;
  nom: string;
  description: string | null;
  categorie: number;
  quantite: number;
  seuil: number | null;
  etat: 'neuf' | 'bon' | 'utilise' | 'reparer' | 'hors_service';
  date_achat: string;
  prix_achat: string;
  prix_vente: string | null;
}

export interface DemandeActif {
  id: number;
  demandeur: number;
  article: number;
  quantite: number;
  motif: string;
  date: string;
  statut: 'en_attente' | 'approuvee' | 'refusee';
  motif_refus: string | null;
}
