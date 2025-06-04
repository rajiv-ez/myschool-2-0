import { fetchWithFallback } from './api';
import { 
  Domaine, UniteEnseignement, Matiere, MatiereGroupee, 
  Evenement, FichierEvenement, Exercice, FichierExercice,
  Presence, Note, NoteConfig 
} from '../types/teaching';

const mockDomaines: Domaine[] = [
  { id: 1, nom: 'Sciences', description: 'Enseignements scientifiques' },
];

const mockUnites: UniteEnseignement[] = [
  { id: 1, nom: 'Mathématiques', description: 'Unité de maths', domaines: [1] },
];

const mockMatieres: Matiere[] = [
  { id: 1, nom: 'Algèbre', unite: 1, coefficient: 2, description: "Cours d'algèbre" },
];

const mockGroupes: MatiereGroupee[] = [
  { id: 1, nom: 'Maths Groupe', matieres: [1] },
];

const mockEvenements: Evenement[] = [
  { id: 1, titre: "Cours d'algèbre", type: 'COURS', date: '2025-06-01', heure_debut: '08:00', heure_fin: '10:00', palier: 1, classe_session: 1, matiere: 1, barreme: 20, description: '', contenu: '', correction: '' },
  { id: 2, titre: "Examen d'algèbre", type: 'EVALUATION', date: '2025-06-15', heure_debut: '10:00', heure_fin: '12:00', palier: 1, classe_session: 1, matiere: 1, barreme: 50, description: '', contenu: '', correction: '' },
  { id: 3, titre: "Cours de grammaire", type: 'COURS', date: '2025-06-10', heure_debut: '14:00', heure_fin: '16:00', palier: 1, classe_session: 1, matiere: 1, barreme: 30, description: '', contenu: '', correction: '' },
];

const mockFichiersEvenements: FichierEvenement[] = [
  { id: 1, evenement: 1, fichier: 'teaching/fichiers/evenements/file1.pdf' },
];

const mockExercices: Exercice[] = [
  { id: 1, nom: 'Exercice 1', date: '2025-06-01', est_a_rendre: true, contenu: 'Contenu ici' },
];

const mockFichiersExercices: FichierExercice[] = [
  { id: 1, exercice: 1, fichier: 'teaching/exercices/file1.pdf' },
];
const mockPresences: Presence[] = [
  { id: 1, evenement: 1, eleve: 1, present: true, retard: false, justification: '' },
];

const mockNotes: Note[] = [
  { id: 1, evaluation: 1, inscription: 1, note: 15 },
];

const mockConfigs: NoteConfig[] = [
  { id: 1, matiere: 1, enseignant: 1, classe_session: 1, formule: '(ds + tp + exam) / 3' },
];

export const teachingService = {
  getDomaines: () => fetchWithFallback('/api/teaching/domaines/', mockDomaines),
  getUnites: () => fetchWithFallback('/api/teaching/unites/', mockUnites),
  getMatieres: () => fetchWithFallback('/api/teaching/matieres/', mockMatieres),
  getGroupes: () => fetchWithFallback('/api/teaching/groupes/', mockGroupes),
  getEvenements: () => fetchWithFallback('/api/teaching/evenements/', mockEvenements),
  getFichiersEvenements: () => fetchWithFallback('/api/teaching/fichiers-evenements/', mockFichiersEvenements),
  getExercices: () => fetchWithFallback('/api/teaching/exercices/', mockExercices),
  getFichiersExercice: () => fetchWithFallback('/api/teaching/fichiers-exercices/', mockFichiersExercices),
  getPresences: () => fetchWithFallback('/api/teaching/presences/', mockPresences),
  getNotes: () => fetchWithFallback('/api/teaching/notes/', mockNotes),
  getConfigs: () => fetchWithFallback('/api/teaching/configs/', mockConfigs),
};
