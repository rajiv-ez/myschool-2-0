export interface PreferenceUser {
  id: number;
  user: number;
  theme: 'light' | 'dark' | 'system';
  couleur: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'pink';
  disposition: 'tabs' | 'sidebar';
}

export interface ConfigurationClasse {
  id: number;
  nom: string;
  classe_session: number;
  nb_rangees: number;
  nb_lignes_par_rangee: number;
  nb_places_par_ligne: number;
  est_actif: boolean;
}

export interface DispositionClasse {
  id: number;
  configuration: number;
  nom: string;
  description?: string;
  est_active: boolean;
}

export interface Place {
  id: number;
  disposition: number;
  rangee: number;
  ligne: number;
  place: number;
  inscription: number;
}

export interface DemandeChangementPlace {
  id: number;
  user: number;
  inscription: number;
  date_demande?: string;
  date_reponse?: string;
  motif: string;
  raison_refus?: string;
  statut :'en_attente'|'acceptee'|'refusee'|'annulee';
}
