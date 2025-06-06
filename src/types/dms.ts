export interface TypeArchive {
  id: number;
  nom: string;
  description?: string;
  nom_modele: string;
  app_label: string;
  champs_affichage: string[];
}

export interface Archive {
  id: number;
  nom?: string;
  description?: string;
  type_archive: number;
  objet_id: number;
  fichier: string; // URL vers le fichier
  tags: string;
  date_creation: string;
  date_modification: string;
  cree_par: number | null;
  modifie_par: number | null;
  instance_data?: string; // enrichi côté backend pour lecture
}

export interface ModeleDocument {
  id: number;
  nom: string;
  description?: string;
  template?: string;
}

export interface ChampsModele {
  id: number;
  modele_document: number;
  label: string;
  type: 'char' | 'text';
  tag_name: string; // nom du champ dans le modèle
  options?: string;
  help_text?: string;
  required: boolean;
}

export interface DocumentGenere {
  id: number;
  modele: number;
  donnees: Record<string, string>;
  fichier_genere?: string;
  cree_par: number;
  date_creation: string;
}