import { fetchWithFallback, ApiResponse } from './api';
import { 
  Domaine, UniteEnseignement, Matiere, MatiereGroupee, 
  Evenement, FichierEvenement, Exercice, FichierExercice,
  Presence, Note, NoteConfig 
} from '../types/teaching';

const mockDomaines: Domaine[] = [
  { 
    id: 1, 
    nom: 'Sciences', 
    description: 'Enseignements scientifiques',
    is_active: true
  },
];

const mockUnites: UniteEnseignement[] = [
  { 
    id: 1, 
    nom: 'Mathématiques', 
    description: 'Unité de maths', 
    domaines: [1],
    is_active: true
  },
];

const mockMatieres: Matiere[] = [
  { 
    id: 1, 
    nom: 'Algèbre', 
    unite: 1, 
    coefficient: 2, 
    description: "Cours d'algèbre",
    is_active: true
  },
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
  getDomaines: () => fetchWithFallback('/api/teaching/domaines-enseignement/', mockDomaines),
  createDomaine: (data: Partial<Domaine>): Promise<ApiResponse<Domaine>> =>
    fetchWithFallback('/api/teaching/domaines-enseignement/', {} as Domaine, { method: 'POST', data, }),
  updateDomaine: (id: number, data: Partial<Domaine>): Promise<ApiResponse<Domaine>> =>
    fetchWithFallback(`/api/teaching/domaines-enseignement/${id}/`, {} as Domaine, { method: 'PUT', data, }),
  deleteDomaine: (id: number) =>
    fetchWithFallback(`/api/teaching/domaines-enseignement/${id}/`, {}, { method: 'DELETE' }),


  // === UNITES ===
  getUnites: () => fetchWithFallback('/api/teaching/unites/', mockUnites),
  createUnite: (data: Partial<UniteEnseignement>): Promise<ApiResponse<UniteEnseignement>> =>
    fetchWithFallback('/api/teaching/unites/', {} as UniteEnseignement, { method: 'POST', data, }),
  updateUnite: (id: number, data: Partial<UniteEnseignement>): Promise<ApiResponse<UniteEnseignement>> =>
    fetchWithFallback(`/api/teaching/unites/${id}/`, {} as UniteEnseignement, { method: 'PUT', data, }),
  deleteUnite: (id: number) =>
    fetchWithFallback(`/api/teaching/unites/${id}/`, {}, { method: 'DELETE' }),


  // === MATIERES ===
  getMatieres: (uniteId?: number): Promise<ApiResponse<Matiere[]>> =>
      fetchWithFallback(`/api/teaching/matieres/${uniteId ? `?unite=${uniteId}` : ''}`, mockMatieres),
  createMatiere: (data: Partial<Matiere>): Promise<ApiResponse<Matiere>> =>
    fetchWithFallback('/api/teaching/matieres/', {} as Matiere, { method: 'POST', data, }),
  updateMatiere: (id: number, data: Partial<Matiere>): Promise<ApiResponse<Matiere>> =>
    fetchWithFallback(`/api/teaching/matieres/${id}/`, {} as Matiere, { method: 'PUT', data, }),
  deleteMatiere: (id: number) =>
    fetchWithFallback(`/api/teaching/matieres/${id}/`, {}, { method: 'DELETE' }),


  // === MATIERES GROUPEES ===
  getMatGroupes: () => fetchWithFallback('/api/teaching/matieres-groupees/', mockGroupes),
  createMatGroupe: (data: Partial<MatiereGroupee>): Promise<ApiResponse<MatiereGroupee>> =>
    fetchWithFallback('/api/teaching/matieres-groupees/', {} as MatiereGroupee, { method: 'POST', data, }),
  updateMatGroupe: (id: number, data: Partial<MatiereGroupee>): Promise<ApiResponse<MatiereGroupee>> =>
    fetchWithFallback(`/api/teaching/matieres-groupees/${id}/`, {} as MatiereGroupee, { method: 'PUT', data, }),
  deleteMatGroupe: (id: number) =>
    fetchWithFallback(`/api/teaching/matieres-groupees/${id}/`, {}, { method: 'DELETE' }),


  // === EVENEMENT ===
  getEvenements: (type?: string, palierId?: number, classeSessionId?: number, matiereId?: number): Promise<ApiResponse<Evenement[]>> =>
      fetchWithFallback(
        `/api/teaching/evenements/${type ? `?type=${type}` : ''}${palierId ? `?palier=${palierId}` : ''}${classeSessionId ? `?classe_session=${classeSessionId}` : ''}${matiereId ? `?matiere=${matiereId}` : ''}`,
        mockEvenements
      ),
  createEvenement: (data: Partial<Evenement>): Promise<ApiResponse<Evenement>> =>
    fetchWithFallback('/api/teaching/evenements/', {} as Evenement, { method: 'POST', data, }),
  updateEvenement: (id: number, data: Partial<Evenement>): Promise<ApiResponse<Evenement>> =>
    fetchWithFallback(`/api/teaching/evenements/${id}/`, {} as Evenement, { method: 'PUT', data, }),
  deleteEvenement: (id: number) =>
    fetchWithFallback(`/api/teaching/evenements/${id}/`, {}, { method: 'DELETE' }),


  // === FICHIERS EVENEMENTS ===
  getFichiersEvenements: (evenementId?: number): Promise<ApiResponse<FichierEvenement[]>> =>
      fetchWithFallback(`/api/teaching/fichiers-evenements/${evenementId ? `?evenement=${evenementId}` : ''}`, mockFichiersEvenements),
  createFichierEvenement: (data: Partial<FichierEvenement>): Promise<ApiResponse<FichierEvenement>> =>
    fetchWithFallback('/api/teaching/fichiers-evenements/', {} as FichierEvenement, { method: 'POST', data, }),
  updateFichierEvenement: (id: number, data: Partial<FichierEvenement>): Promise<ApiResponse<FichierEvenement>> =>
    fetchWithFallback(`/api/teaching/fichiers-evenements/${id}/`, {} as FichierEvenement, { method: 'PUT', data, }),
  deleteFichierEvenement: (id: number) =>
    fetchWithFallback(`/api/teaching/fichiers-evenements/${id}/`, {}, { method: 'DELETE' }),


  // === ECXERCISES ===
  getExercices: (evenementId?: number): Promise<ApiResponse<Exercice[]>> =>
      fetchWithFallback(`/api/teaching/exercices/${evenementId ? `?evenement=${evenementId}` : ''}`, mockExercices),
  createExercice: (data: Partial<Exercice>): Promise<ApiResponse<Exercice>> =>
    fetchWithFallback('/api/teaching/exercices/', {} as Exercice, { method: 'POST', data, }),
  updateExercice: (id: number, data: Partial<Exercice>): Promise<ApiResponse<Exercice>> =>
    fetchWithFallback(`/api/teaching/exercices/${id}/`, {} as Exercice, { method: 'PUT', data, }),
  deleteExercice: (id: number) =>
    fetchWithFallback(`/api/teaching/exercices/${id}/`, {}, { method: 'DELETE' }),
  

  // === FICHIERS EXERCICE ===
  getFichiersExercices: (evenementId?: number): Promise<ApiResponse<FichierExercice[]>> =>
      fetchWithFallback(`/api/teaching/fichiers-exercices/${evenementId ? `?evenement=${evenementId}` : ''}`, mockFichiersExercices),
  createFichierExercice: (data: Partial<FichierExercice>): Promise<ApiResponse<FichierExercice>> =>
    fetchWithFallback('/api/teaching/fichiers-exercices/', {} as FichierExercice, { method: 'POST', data, }),
  updateFichierExercice: (id: number, data: Partial<FichierExercice>): Promise<ApiResponse<FichierExercice>> =>
    fetchWithFallback(`/api/teaching/fichiers-exercices/${id}/`, {} as FichierExercice, { method: 'PUT', data, }),
  deleteFichierExercice: (id: number) =>
    fetchWithFallback(`/api/teaching/fichiers-exercices/${id}/`, {}, { method: 'DELETE' }),


  // === PRESENCES ===
  getPresences: (evenementId?: number, inscriptionId?: number): Promise<ApiResponse<Presence[]>> =>
      fetchWithFallback(
        `/api/teaching/presences/${evenementId ? `?evenement=${evenementId}` : ''}${inscriptionId ? `?inscription=${inscriptionId}` : ''}`,
        mockPresences
      ),
  createPresence: (data: Partial<Presence>): Promise<ApiResponse<Presence>> =>
    fetchWithFallback('/api/teaching/presences/', {} as Presence, { method: 'POST', data, }),
  updatePresence: (id: number, data: Partial<Presence>): Promise<ApiResponse<Presence>> =>
    fetchWithFallback(`/api/teaching/presences/${id}/`, {} as Presence, { method: 'PUT', data, }),
  deletePresence: (id: number) =>
    fetchWithFallback(`/api/teaching/presences/${id}/`, {}, { method: 'DELETE' }),


  // === NOTES ===
  getNotes: (evaluationId?: number, inscriptionId?: number): Promise<ApiResponse<Note[]>> =>
      fetchWithFallback(
        `/api/teaching/notes/${evaluationId ? `?evaluation=${evaluationId}` : ''}${inscriptionId ? `?inscription=${inscriptionId}` : ''}`,
        mockNotes
      ),
  createNote: (data: Partial<Note>): Promise<ApiResponse<Note>> =>
    fetchWithFallback('/api/teaching/notes/', {} as Note, { method: 'POST', data, }),
  updateNote: (id: number, data: Partial<Note>): Promise<ApiResponse<Note>> =>
    fetchWithFallback(`/api/teaching/notes/${id}/`, {} as Note, { method: 'PUT', data, }),
  deleteNote: (id: number) =>
    fetchWithFallback(`/api/teaching/notes/${id}/`, {}, { method: 'DELETE' }),

  // === NOTES CONFIGS ===
  getNoteConfigs: (matiereId?: number, enseignantId?: number, classeSessionId?: number): Promise<ApiResponse<NoteConfig[]>> =>
      fetchWithFallback(
        `/api/teaching/notes-configs/${matiereId ? `?matiere=${matiereId}` : ''}${enseignantId ? `?enseignant=${classeSessionId}` : ''}${classeSessionId ? `?classe_session=${classeSessionId}` : ''}`,
        mockConfigs
      ),
  createNoteConfig: (data: Partial<NoteConfig>): Promise<ApiResponse<NoteConfig>> =>
    fetchWithFallback('/api/teaching/notes-configs/', {} as NoteConfig, { method: 'POST', data, }),
  updateNoteConfig: (id: number, data: Partial<NoteConfig>): Promise<ApiResponse<NoteConfig>> =>
    fetchWithFallback(`/api/teaching/notes-configs/${id}/`, {} as NoteConfig, { method: 'PUT', data, }),
  deleteNoteConfig: (id: number) =>
    fetchWithFallback(`/api/teaching/notes-configs/${id}/`, {}, { method: 'DELETE' }),
};
