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

export const academicService = {
  getSessions: () => fetchWithFallback('/api/academic/sessions/', mockSessions),

  createSession: (session: Omit<Session, 'id'>) => {
    const newSession: Session = { ...session, id: Date.now() };
    return fetchWithFallback('/api/academic/sessions/', newSession, { method: 'POST', data: session });
  },

  getPaliers: () => fetchWithFallback('/api/academic/paliers/', mockPaliers),

  getPaliersBySession: (sessionId: number) => {
    const filtered = mockPaliers.filter(p => p.session === sessionId);
    return fetchWithFallback(`/api/academic/sessions/${sessionId}/paliers/`, filtered);
  },

  getNiveaux: () => fetchWithFallback('/api/academic/niveaux/', mockNiveaux),
  getFilieres: () => fetchWithFallback('/api/academic/filieres/', mockFilieres),
  getClasses: () => fetchWithFallback('/api/academic/classes/', mockClasses),

  getClasseSessions: () => fetchWithFallback('/api/academic/classe-sessions/', mockClasseSessions),

  getInscriptions: () => fetchWithFallback('/api/academic/inscriptions/', mockInscriptions),
};
