
// src/services/academicService.ts
import { fetchWithFallback } from './api';
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
  {
    id: 1,
    nom: 'Année scolaire 2023-2024',
    debut: '2023-09-01',
    fin: '2024-06-30',
    en_cours: false,
    auto_activer_palier: true,
  },
  {
    id: 2,
    nom: 'Année scolaire 2024-2025',
    debut: '2024-09-01',
    fin: '2025-06-30',
    en_cours: true,
    auto_activer_palier: true,
  },
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
  { id: 1, filiere: 1, nom: 'Sciences', description: 'Spécialité sciences' },
  { id: 2, filiere: 2, nom: 'Lettres', description: 'Spécialité lettres' },
  { id: 3, filiere: 3, nom: 'Économie', description: 'Spécialité économie' },
  { id: 4, filiere: 4, nom: 'Générale', description: 'Spécialité générale' },
];

const mockClasses: Classe[] = [
  { id: 1, specialite: 4, nom: 'CP', description: 'Cours Préparatoire' },
  { id: 2, specialite: 4, nom: 'CE1', description: 'Cours Élémentaire 1' },
  { id: 3, specialite: 4, nom: 'CM1', description: 'Cours Moyen 1' },
  { id: 4, specialite: 1, nom: 'Terminale S', description: 'Terminale Scientifique' },
];

const mockClasseSessions: ClasseSession[] = [
  { id: 1, classe: 1, session: 2, capacite: 30 },
  { id: 2, classe: 2, session: 2, capacite: 25 },
  { id: 3, classe: 3, session: 2, capacite: 20 },
  { id: 4, classe: 4, session: 2, capacite: 30 },
];

const mockInscriptions: Inscription[] = [
  {
    id: 1,
    eleve: 1,
    classe_session: 1,
    date_inscription: '2024-09-01',
    est_reinscription: false,
    statut: 'CONFIRMEE',
  },
  {
    id: 2,
    eleve: 2,
    classe_session: 2,
    date_inscription: '2024-09-01',
    est_reinscription: false,
    statut: 'EN_ATTENTE',
  },
];

// Variables pour gérer les données en mode offline
let localSessions = [...mockSessions];
let localPaliers = [...mockPaliers];
let localNiveaux = [...mockNiveaux];
let localFilieres = [...mockFilieres];
let localSpecialites = [...mockSpecialites];
let localClasses = [...mockClasses];
let localClasseSessions = [...mockClasseSessions];
let localInscriptions = [...mockInscriptions];

export const academicService = {
  // Sessions
  getSessions: () => fetchWithFallback('/api/academic/sessions/', localSessions),

  createSession: async (session: Omit<Session, 'id'>) => {
    try {
      const response = await fetchWithFallback('/api/academic/sessions/', session, { method: 'POST', data: session });
      if (!response.fromApi) {
        const newSession: Session = { ...session, id: Math.max(...localSessions.map(s => s.id), 0) + 1 };
        localSessions.push(newSession);
        return { data: newSession, fromApi: false };
      }
      return response;
    } catch (error) {
      const newSession: Session = { ...session, id: Math.max(...localSessions.map(s => s.id), 0) + 1 };
      localSessions.push(newSession);
      return { data: newSession, fromApi: false };
    }
  },

  updateSession: async (id: number, session: Partial<Session>) => {
    try {
      const response = await fetchWithFallback(`/api/academic/sessions/${id}/`, session, { method: 'PUT', data: session });
      if (!response.fromApi) {
        const index = localSessions.findIndex(s => s.id === id);
        if (index !== -1) {
          localSessions[index] = { ...localSessions[index], ...session };
          return { data: localSessions[index], fromApi: false };
        }
      }
      return response;
    } catch (error) {
      const index = localSessions.findIndex(s => s.id === id);
      if (index !== -1) {
        localSessions[index] = { ...localSessions[index], ...session };
        return { data: localSessions[index], fromApi: false };
      }
      throw error;
    }
  },

  deleteSession: async (id: number) => {
    try {
      const response = await fetchWithFallback(`/api/academic/sessions/${id}/`, {}, { method: 'DELETE' });
      if (!response.fromApi) {
        localSessions = localSessions.filter(s => s.id !== id);
        return { data: { success: true }, fromApi: false };
      }
      return response;
    } catch (error) {
      localSessions = localSessions.filter(s => s.id !== id);
      return { data: { success: true }, fromApi: false };
    }
  },

  // Paliers
  getPaliers: () => fetchWithFallback('/api/academic/paliers/', localPaliers),

  getPaliersBySession: (sessionId: number) => {
    const filtered = localPaliers.filter(p => p.session === sessionId);
    return fetchWithFallback(`/api/academic/sessions/${sessionId}/paliers/`, filtered);
  },

  createPalier: async (palier: Omit<Palier, 'id'>) => {
    try {
      const response = await fetchWithFallback('/api/academic/paliers/', palier, { method: 'POST', data: palier });
      if (!response.fromApi) {
        const newPalier: Palier = { ...palier, id: Math.max(...localPaliers.map(p => p.id), 0) + 1 };
        localPaliers.push(newPalier);
        return { data: newPalier, fromApi: false };
      }
      return response;
    } catch (error) {
      const newPalier: Palier = { ...palier, id: Math.max(...localPaliers.map(p => p.id), 0) + 1 };
      localPaliers.push(newPalier);
      return { data: newPalier, fromApi: false };
    }
  },

  updatePalier: async (id: number, palier: Partial<Palier>) => {
    try {
      const response = await fetchWithFallback(`/api/academic/paliers/${id}/`, palier, { method: 'PUT', data: palier });
      if (!response.fromApi) {
        const index = localPaliers.findIndex(p => p.id === id);
        if (index !== -1) {
          localPaliers[index] = { ...localPaliers[index], ...palier };
          return { data: localPaliers[index], fromApi: false };
        }
      }
      return response;
    } catch (error) {
      const index = localPaliers.findIndex(p => p.id === id);
      if (index !== -1) {
        localPaliers[index] = { ...localPaliers[index], ...palier };
        return { data: localPaliers[index], fromApi: false };
      }
      throw error;
    }
  },

  deletePalier: async (id: number) => {
    try {
      const response = await fetchWithFallback(`/api/academic/paliers/${id}/`, {}, { method: 'DELETE' });
      if (!response.fromApi) {
        localPaliers = localPaliers.filter(p => p.id !== id);
        return { data: { success: true }, fromApi: false };
      }
      return response;
    } catch (error) {
      localPaliers = localPaliers.filter(p => p.id !== id);
      return { data: { success: true }, fromApi: false };
    }
  },

  // Structure académique
  getNiveaux: () => fetchWithFallback('/api/academic/niveaux/', localNiveaux),
  getFilieres: () => fetchWithFallback('/api/academic/filieres/', localFilieres),
  getSpecialites: () => fetchWithFallback('/api/academic/specialites/', localSpecialites),
  getClasses: () => fetchWithFallback('/api/academic/classes/', localClasses),

  // Classes sessions
  getClasseSessions: () => fetchWithFallback('/api/academic/classe-sessions/', localClasseSessions),

  createClasseSession: async (classeSession: Omit<ClasseSession, 'id'>) => {
    try {
      const response = await fetchWithFallback('/api/academic/classe-sessions/', classeSession, { method: 'POST', data: classeSession });
      if (!response.fromApi) {
        const newClasseSession: ClasseSession = { ...classeSession, id: Math.max(...localClasseSessions.map(cs => cs.id), 0) + 1 };
        localClasseSessions.push(newClasseSession);
        return { data: newClasseSession, fromApi: false };
      }
      return response;
    } catch (error) {
      const newClasseSession: ClasseSession = { ...classeSession, id: Math.max(...localClasseSessions.map(cs => cs.id), 0) + 1 };
      localClasseSessions.push(newClasseSession);
      return { data: newClasseSession, fromApi: false };
    }
  },

  updateClasseSession: async (id: number, classeSession: Partial<ClasseSession>) => {
    try {
      const response = await fetchWithFallback(`/api/academic/classe-sessions/${id}/`, classeSession, { method: 'PUT', data: classeSession });
      if (!response.fromApi) {
        const index = localClasseSessions.findIndex(cs => cs.id === id);
        if (index !== -1) {
          localClasseSessions[index] = { ...localClasseSessions[index], ...classeSession };
          return { data: localClasseSessions[index], fromApi: false };
        }
      }
      return response;
    } catch (error) {
      const index = localClasseSessions.findIndex(cs => cs.id === id);
      if (index !== -1) {
        localClasseSessions[index] = { ...localClasseSessions[index], ...classeSession };
        return { data: localClasseSessions[index], fromApi: false };
      }
      throw error;
    }
  },

  deleteClasseSession: async (id: number) => {
    try {
      const response = await fetchWithFallback(`/api/academic/classe-sessions/${id}/`, {}, { method: 'DELETE' });
      if (!response.fromApi) {
        localClasseSessions = localClasseSessions.filter(cs => cs.id !== id);
        return { data: { success: true }, fromApi: false };
      }
      return response;
    } catch (error) {
      localClasseSessions = localClasseSessions.filter(cs => cs.id !== id);
      return { data: { success: true }, fromApi: false };
    }
  },

  // Inscriptions
  getInscriptions: () => fetchWithFallback('/api/academic/inscriptions/', localInscriptions),

  createInscription: async (inscription: Omit<Inscription, 'id'>) => {
    try {
      const response = await fetchWithFallback('/api/academic/inscriptions/', inscription, { method: 'POST', data: inscription });
      if (!response.fromApi) {
        const newInscription: Inscription = { ...inscription, id: Math.max(...localInscriptions.map(i => i.id), 0) + 1 };
        localInscriptions.push(newInscription);
        return { data: newInscription, fromApi: false };
      }
      return response;
    } catch (error) {
      const newInscription: Inscription = { ...inscription, id: Math.max(...localInscriptions.map(i => i.id), 0) + 1 };
      localInscriptions.push(newInscription);
      return { data: newInscription, fromApi: false };
    }
  },

  updateInscription: async (id: number, inscription: Partial<Inscription>) => {
    try {
      const response = await fetchWithFallback(`/api/academic/inscriptions/${id}/`, inscription, { method: 'PUT', data: inscription });
      if (!response.fromApi) {
        const index = localInscriptions.findIndex(i => i.id === id);
        if (index !== -1) {
          localInscriptions[index] = { ...localInscriptions[index], ...inscription };
          return { data: localInscriptions[index], fromApi: false };
        }
      }
      return response;
    } catch (error) {
      const index = localInscriptions.findIndex(i => i.id === id);
      if (index !== -1) {
        localInscriptions[index] = { ...localInscriptions[index], ...inscription };
        return { data: localInscriptions[index], fromApi: false };
      }
      throw error;
    }
  },

  deleteInscription: async (id: number) => {
    try {
      const response = await fetchWithFallback(`/api/academic/inscriptions/${id}/`, {}, { method: 'DELETE' });
      if (!response.fromApi) {
        localInscriptions = localInscriptions.filter(i => i.id !== id);
        return { data: { success: true }, fromApi: false };
      }
      return response;
    } catch (error) {
      localInscriptions = localInscriptions.filter(i => i.id !== id);
      return { data: { success: true }, fromApi: false };
    }
  },
};
