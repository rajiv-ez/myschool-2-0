// src/services/academicService.ts
import { fetchWithFallback, ApiResponse } from './api';
import {
  Session,
  Palier,
  Niveau,
  Filiere,
  Specialite,
  Classe,
  ClasseSession,
  Inscription,
} from '../types/academic';

const mockSessions: Session[] = [
  { id: 1, nom: 'Année scolaire 2023-2024', debut: '2023-09-01', fin: '2024-06-30', en_cours: false, auto_activer_palier: true, },
  { id: 2, nom: 'Année scolaire 2024-2025', debut: '2024-09-01', fin: '2025-06-30', en_cours: true, auto_activer_palier: true, },
];

const mockPaliers: Palier[] = [
  { id: 1, session: 1, nom: 'Trimestre 1', debut: '2023-09-01', fin: '2023-12-15', en_cours: false },
  { id: 2, session: 1, nom: 'Trimestre 2', debut: '2024-01-08', fin: '2024-03-29', en_cours: false },
  { id: 3, session: 1, nom: 'Trimestre 3', debut: '2024-04-08', fin: '2024-06-30', en_cours: false },
  { id: 4, session: 2, nom: 'Trimestre 1', debut: '2024-09-01', fin: '2024-12-15', en_cours: true },
  { id: 5, session: 2, nom: 'Trimestre 2', debut: '2025-01-08', fin: '2025-03-29', en_cours: false },
];

const mockNiveaux: Niveau[] = [
  { id: 1, nom: 'Maternelle' },
  { id: 2, nom: 'Primaire' },
  { id: 3, nom: 'Collège' },
  { id: 4, nom: 'Lycée' },
];

const mockFilieres: Filiere[] = [
  { id: 1, niveau: 4, nom: 'Scientifique', description: 'Option sciences' },
  { id: 2, niveau: 4, nom: 'Littéraire', description: 'Option lettres et philosophie' },
  { id: 3, niveau: 4, nom: 'Économique', description: 'Option économie et gestion' },
  { id: 4, niveau: 2, nom: 'Générale', description: 'Programme général' },
];

const mockSpecialites: Specialite[] = [
  { id: 1, filiere: 1, nom: 'Mathématiques-Physique', description: 'Spécialité mathématiques et physique' },
  { id: 2, filiere: 1, nom: 'Sciences de la Vie et de la Terre', description: 'Spécialité SVT' },
  { id: 3, filiere: 2, nom: 'Philosophie', description: 'Spécialité philosophie' },
  { id: 4, filiere: 3, nom: 'Économie-Gestion', description: 'Spécialité économie et gestion' },
];

const mockClasses: Classe[] = [
  { id: 1, specialite: 1, nom: 'CP', description: 'Cours Préparatoire' },
  { id: 2, specialite: 1, nom: 'CE1', description: 'Cours Élémentaire 1' },
  { id: 3, specialite: 1, nom: 'CM1', description: 'Cours Moyen 1' },
  { id: 4, specialite: 2, nom: 'Terminale S', description: 'Terminale Scientifique' },
];

const mockClasseSessions: ClasseSession[] = [
  { id: 1, classe: 1, session: 1, capacite: 30 },
  { id: 2, classe: 2, session: 1, capacite: 25 },
  { id: 3, classe: 3, session: 1, capacite: 20 },
  { id: 4, classe: 4, session: 2, capacite: 30 },
];

const mockInscriptions: Inscription[] = [
  { id: 1, eleve: 1, classe_session: 1, date_inscription: '2024-09-01', est_reinscription: false, statut: 'CONFIRMEE', },
  { id: 2, eleve: 2, classe_session: 2, date_inscription: '2024-09-01', est_reinscription: false, statut: 'EN_ATTENTE', },
];

export const academicService = {
  // === SESSIONS ===
  getSessions: () => fetchWithFallback('/api/academic/sessions/', mockSessions),
  createSession: (data: Partial<Session>): Promise<ApiResponse<Session>> =>
    fetchWithFallback('/api/academic/sessions/', {} as Session, { method: 'POST', data, }),
  updateSession: (id: number, data: Partial<Session>): Promise<ApiResponse<Session>> =>
    fetchWithFallback(`/api/academic/sessions/${id}/`, {} as Session, { method: 'PUT', data, }),
  deleteSession: (id: number) =>
    fetchWithFallback(`/api/academic/sessions/${id}/`, {}, { method: 'DELETE' }),


  // === PALIERS ===
  getPaliers: (sessionId?: number): Promise<ApiResponse<Palier[]>> =>
      fetchWithFallback(`/api/academic/paliers/${sessionId ? `?session=${sessionId}` : ''}`, mockPaliers),
  createPalier: (data: Partial<Palier>): Promise<ApiResponse<Palier>> =>
    fetchWithFallback('/api/academic/paliers/', {} as Palier, { method: 'POST', data, }),
  updatePalier: (id: number, data: Partial<Palier>): Promise<ApiResponse<Palier>> =>
    fetchWithFallback(`/api/academic/paliers/${id}/`, {} as Palier, { method: 'PUT', data, }),
  deletePalier: (id: number) =>
    fetchWithFallback(`/api/academic/paliers/${id}/`, {}, { method: 'DELETE' }),


  // === NIVEAUX ===
  getNiveaux: () => fetchWithFallback('/api/academic/niveaux/', mockNiveaux),
  createNiveau: (data: Partial<Niveau>): Promise<ApiResponse<Niveau>> =>
    fetchWithFallback('/api/academic/niveaux/', {} as Niveau, { method: 'POST', data, }),
  updateNiveau: (id: number, data: Partial<Niveau>): Promise<ApiResponse<Niveau>> =>
    fetchWithFallback(`/api/academic/niveaux/${id}/`, {} as Niveau, { method: 'PUT', data, }),
  deleteNiveau: (id: number) =>
    fetchWithFallback(`/api/academic/niveaux/${id}/`, {}, { method: 'DELETE' }),

    
  // === FILIERES ===
  getFilieres: (niveauId?: number) => 
    fetchWithFallback(`/api/academic/filieres/${niveauId ? `?niveau=${niveauId}` : ''}`, mockFilieres),
  createFiliere: (data: Partial<Filiere>): Promise<ApiResponse<Filiere>> =>
    fetchWithFallback('/api/academic/filieres/', {} as Filiere, { method: 'POST', data, }),
  updateFiliere: (id: number, data: Partial<Filiere>): Promise<ApiResponse<Filiere>> =>
    fetchWithFallback(`/api/academic/filieres/${id}/`, {} as Filiere, { method: 'PUT', data, }),
  deleteFiliere: (id: number) =>
    fetchWithFallback(`/api/academic/filieres/${id}/`, {}, { method: 'DELETE' }),


  // === SPECIALITES ===
  getSpecialites: (filiereId?: number) => 
    fetchWithFallback(`/api/academic/specialites/${filiereId ? `?filiere=${filiereId}` : ''}`, mockSpecialites),
  createSpecialite: (data: Partial<Specialite>): Promise<ApiResponse<Specialite>> =>
    fetchWithFallback('/api/academic/specialites/', {} as Specialite, { method: 'POST', data, }),
  updateSpecialite: (id: number, data: Partial<Specialite>): Promise<ApiResponse<Specialite>> =>
    fetchWithFallback(`/api/academic/specialites/${id}/`, {} as Specialite, { method: 'PUT', data, }),
  deleteSpecialite: (id: number) =>
    fetchWithFallback(`/api/academic/specialites/${id}/`, {}, { method: 'DELETE' }),


  // === CLASSES ===
  getClasses: (specialiteId?: number): Promise<ApiResponse<Classe[]>> =>
      fetchWithFallback(`/api/academic/classes/${specialiteId ? `?specialite=${specialiteId}` : ''}`, mockClasses),
  createClasse: (data: Partial<Classe>): Promise<ApiResponse<Classe>> =>
    fetchWithFallback('/api/academic/classes/', {} as Classe, { method: 'POST', data, }),
  updateClasse: (id: number, data: Partial<Classe>): Promise<ApiResponse<Classe>> =>
    fetchWithFallback(`/api/academic/classes/${id}/`, {} as Classe, { method: 'PUT', data, }),
  deleteClasse: (id: number) =>
    fetchWithFallback(`/api/academic/classes/${id}/`, {}, { method: 'DELETE' }),


  // === CLASSE_SESSIONS ===
  getClasseSessions: (classeId?: number, sessionId?: number): Promise<ApiResponse<ClasseSession[]>> => 
    fetchWithFallback(`/api/academic/classe-sessions/${classeId ? `?classe=${classeId}` : ''}${sessionId ? `?session=${sessionId}` : ''}`, mockClasseSessions),
  createClasseSession: (data: Partial<ClasseSession>): Promise<ApiResponse<ClasseSession>> =>
    fetchWithFallback('/api/academic/classe-sessions/', {} as ClasseSession, { method: 'POST', data, }),
  updateClasseSession: (id: number, data: Partial<ClasseSession>): Promise<ApiResponse<ClasseSession>> =>
    fetchWithFallback(`/api/academic/classe-sessions/${id}/`, {} as ClasseSession, { method: 'PUT', data, }),
  deleteClasseSession: (id: number) =>
    fetchWithFallback(`/api/academic/classe-sessions/${id}/`, {}, { method: 'DELETE' }),


  // === INSCRIPTIONS ===
  getInscriptions: (eleveId?: number, classe_sessionId?: number): Promise<ApiResponse<Inscription[]>> =>
      fetchWithFallback(`/api/academic/inscriptions/${eleveId ? `?eleve=${eleveId}` : ''}${classe_sessionId ? `?classe_session=${classe_sessionId}` : ''}`, mockInscriptions),
  createInscription: (data: Partial<Inscription>): Promise<ApiResponse<Inscription>> =>
    fetchWithFallback('/api/academic/inscriptions/', {} as Inscription, { method: 'POST', data, }),
  updateInscription: (id: number, data: Partial<Inscription>): Promise<ApiResponse<Inscription>> =>
    fetchWithFallback(`/api/academic/inscriptions/${id}/`, {} as Inscription, { method: 'PUT', data, }),
  deleteInscription: (id: number) =>
    fetchWithFallback(`/api/academic/inscriptions/${id}/`, {}, { method: 'DELETE' }),

};
