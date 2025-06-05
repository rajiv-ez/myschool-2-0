
export interface School {
  id: number;
  nom: string;
  description: string;
  subdomain: string;
  note: number; // nombre d'étoiles (1-5)
  images: string[];
  resultats_examens: {
    annee: string;
    taux_reussite: number;
    mentions: {
      passable: number;
      bien: number;
      tres_bien: number;
    };
  }[];
  adresse: string;
  telephone: string;
  email: string;
  nombre_eleves: number;
}
