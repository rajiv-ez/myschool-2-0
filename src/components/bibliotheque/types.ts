
export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  categorie: string;
  isbn: string;
  etat: string;
  date_ajout: string;
  disponible: boolean;
}

export interface Emprunt {
  id: number;
  livre_id: number;
  titre: string;
  emprunteur: string;
  classe: string;
  date_emprunt: string;
  date_retour_prevue: string;
  date_retour_reelle: string | null;
  statut: 'En cours' | 'Rendu' | 'En retard';
}

export interface DemandeEmprunt {
  id: number;
  livre_id: number;
  titre: string;
  eleve_id: string;
  eleve_nom: string;
  classe: string;
  date_demande: string;
  raison: string;
  statut: 'En attente' | 'Validée' | 'Refusée';
}
