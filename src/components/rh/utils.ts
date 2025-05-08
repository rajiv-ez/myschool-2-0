
import { PersonnelMember, Contrat } from './types';

// Rechercher un contrat actif pour un membre du personnel
export const findContratForPersonnel = (
  contrats: Contrat[],
  personnelId: string
): Contrat | null => {
  // D'abord chercher un contrat actif
  const contratActif = contrats.find(
    (contrat) => contrat.personnel_id === personnelId && contrat.statut === 'Actif'
  );
  
  if (contratActif) return contratActif;
  
  // Si pas de contrat actif, retourner le dernier contrat
  const contratsPersonnel = contrats
    .filter((contrat) => contrat.personnel_id === personnelId)
    .sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
  
  return contratsPersonnel.length > 0 ? contratsPersonnel[0] : null;
};

// Générer des données fictives pour les tests
export const generateMockPersonnel = (): PersonnelMember[] => {
  return [
    {
      id: "1",
      nom: "Assoumou",
      prenom: "Jean",
      dateNaissance: "1985-03-15",
      lieuNaissance: "Libreville",
      genre: "Masculin",
      adresse: "Quartier Glass, Libreville",
      tel1: "074 01 23 45",
      tel2: "",
      whatsapp: "+241 74 01 23 45",
      email: "j.assoumou@ecole.com",
      poste: "Enseignant",
      matieres: ["Mathématiques"],
      niveaux: ["CM1", "CM2"],
      statut: "Actif",
      date_embauche: "2020-09-01"
    },
    {
      id: "2",
      nom: "Ndong",
      prenom: "Marie",
      dateNaissance: "1990-06-22",
      lieuNaissance: "Port-Gentil",
      genre: "Féminin",
      adresse: "Quartier Akébé, Libreville",
      tel1: "066 12 34 56",
      tel2: "",
      whatsapp: "+241 66 12 34 56",
      email: "m.ndong@ecole.com",
      poste: "Enseignante",
      matieres: ["Français"],
      niveaux: ["CE1", "CE2"],
      statut: "Actif",
      date_embauche: "2018-09-01"
    },
    {
      id: "3",
      nom: "Obiang",
      prenom: "Paul",
      dateNaissance: "1975-11-05",
      lieuNaissance: "Franceville",
      genre: "Masculin",
      adresse: "Quartier Batterie IV, Libreville",
      tel1: "077 98 76 54",
      tel2: "066 87 65 43",
      whatsapp: "+241 77 98 76 54",
      email: "p.obiang@ecole.com",
      poste: "Directeur",
      matieres: [],
      niveaux: [],
      statut: "Actif",
      date_embauche: "2015-09-01"
    },
    {
      id: "4",
      nom: "Mba",
      prenom: "Sophie",
      dateNaissance: "1992-08-17",
      lieuNaissance: "Oyem",
      genre: "Féminin",
      adresse: "Quartier IAI, Libreville",
      tel1: "066 45 67 89",
      tel2: "",
      whatsapp: "",
      email: "s.mba@ecole.com",
      poste: "Secrétaire",
      matieres: [],
      niveaux: [],
      statut: "Actif",
      date_embauche: "2021-10-15"
    },
    {
      id: "5",
      nom: "Ondo",
      prenom: "Pierre",
      dateNaissance: "1988-04-30",
      lieuNaissance: "Lambaréné",
      genre: "Masculin",
      adresse: "Quartier PK8, Libreville",
      tel1: "074 56 78 90",
      tel2: "",
      whatsapp: "+241 74 56 78 90",
      email: "p.ondo@ecole.com",
      poste: "Enseignant",
      matieres: ["Histoire-Géographie"],
      niveaux: ["6ème", "5ème"],
      statut: "En congé",
      date_embauche: "2019-09-01"
    }
  ];
};

export const generateMockContrats = (): Contrat[] => {
  return [
    {
      id: "101",
      personnel_id: "1",
      nom_complet: "Jean Assoumou",
      type_contrat: "CDI",
      date_debut: "2020-09-01",
      date_fin: "",
      salaire: "450 000 FCFA",
      statut: "Actif"
    },
    {
      id: "102",
      personnel_id: "2",
      nom_complet: "Marie Ndong",
      type_contrat: "CDI",
      date_debut: "2018-09-01",
      date_fin: "",
      salaire: "450 000 FCFA",
      statut: "Actif"
    },
    {
      id: "103",
      personnel_id: "3",
      nom_complet: "Paul Obiang",
      type_contrat: "CDI",
      date_debut: "2015-09-01",
      date_fin: "",
      salaire: "750 000 FCFA",
      statut: "Actif"
    },
    {
      id: "104",
      personnel_id: "4",
      nom_complet: "Sophie Mba",
      type_contrat: "CDD",
      date_debut: "2021-10-15",
      date_fin: "2023-10-15",
      salaire: "350 000 FCFA",
      statut: "Actif"
    },
    {
      id: "105",
      personnel_id: "5",
      nom_complet: "Pierre Ondo",
      type_contrat: "CDI",
      date_debut: "2019-09-01",
      date_fin: "",
      salaire: "450 000 FCFA",
      statut: "Actif"
    }
  ];
};
