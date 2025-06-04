export interface Livre {
  id: number;
  titre: string;
  description?: string;
  image?: string;
  auteur: string;
  maison_edition?: string;
  date_publication?: string;
  categorie: 'ROMAN' | 'CONTE' | 'FANTAISIE' | 'JEUNESSE' | 'SCIENCEFICTION';
  etat: 'NEUF' | 'BON' | 'USE' | 'ABIME';
  isbn?: string;
  disponibilite: 'DISPONIBLE' | 'EMPRUNTE' | 'RUPTURE';
}

export interface Emprunt {
  id: number;
  livre: number;
  user: number;
  debut: string;
  fin_prevue: string;
  fin_reelle?: string;
  statut: 'EN_COURS' | 'RENDU' | 'EN_RETARD';
  prolongation?: number;
  hist_prolongation?: string;
  penalite?: string;
  echeance_penalite?: number;
  statut_penalite: 'AUCUNE' | 'EN_COURS' | 'TERMINE' | 'DEPASSE' | 'PROLONGE';
}
