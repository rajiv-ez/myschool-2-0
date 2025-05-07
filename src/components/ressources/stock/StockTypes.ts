
export interface Article {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  quantite: number;
  assigneA?: Personne;
  dateAchat: Date;
  etat: 'Neuf' | 'Bon état' | 'Utilisé' | 'À réparer' | 'Hors service';
}

export interface Personne {
  id: string;
  nom: string;
  prenom: string;
  avatar?: string;
  role: string;
}

export interface Demande {
  id: string;
  demandeur: Personne;
  article: Article;
  quantite: number;
  date: Date;
  motif: string;
  statut: 'En attente' | 'Approuvée' | 'Refusée';
  motifRefus?: string;
}
