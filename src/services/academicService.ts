
import { fetchWithFallback, ApiResponse } from './api';
import { Session, Palier, Niveau, Filiere, Specialite, Classe } from '../types/academic';

// Données fictives pour le fallback
const mockSessions: Session[] = [
  { 
    id: '1', 
    nom: 'Année scolaire 2023-2024', 
    debut: '2023-09-01', 
    fin: '2024-06-30', 
    en_cours: false, 
    auto_activer_palier: true 
  },
  { 
    id: '2', 
    nom: 'Année scolaire 2024-2025', 
    debut: '2024-09-01', 
    fin: '2025-06-30', 
    en_cours: true, 
    auto_activer_palier: true 
  },
];

const mockPaliers: Palier[] = [
  { id: '1', session: '1', nom: 'Trimestre 1', debut: '2023-09-01', fin: '2023-12-15', en_cours: false },
  { id: '2', session: '1', nom: 'Trimestre 2', debut: '2024-01-08', fin: '2024-03-29', en_cours: false },
  { id: '3', session: '1', nom: 'Trimestre 3', debut: '2024-04-08', fin: '2024-06-30', en_cours: false },
  { id: '4', session: '2', nom: 'Trimestre 1', debut: '2024-09-01', fin: '2024-12-15', en_cours: true },
  { id: '5', session: '2', nom: 'Trimestre 2', debut: '2025-01-08', fin: '2025-03-29', en_cours: false },
];

const mockNiveaux: Niveau[] = [
  { id: '1', nom: 'Maternelle' },
  { id: '2', nom: 'Primaire' },
  { id: '3', nom: 'Collège' },
  { id: '4', nom: 'Lycée' },
];

const mockFilieres: Filiere[] = [
  { id: '1', niveau: '4', nom: 'Scientifique', description: 'Option sciences' },
  { id: '2', niveau: '4', nom: 'Littéraire', description: 'Option lettres et philosophie' },
  { id: '3', niveau: '4', nom: 'Économique', description: 'Option économie et gestion' },
  { id: '4', niveau: '2', nom: 'Générale', description: 'Programme général' },
];

const mockClasses: Classe[] = [
  { id: '1', specialite: '1', nom: 'CP', description: 'Cours Préparatoire' },
  { id: '2', specialite: '1', nom: 'CE1', description: 'Cours Élémentaire 1' },
  { id: '3', specialite: '1', nom: 'CM1', description: 'Cours Moyen 1' },
  { id: '4', specialite: '2', nom: 'Terminale S', description: 'Terminale Scientifique' },
];

// Services d'API
export const academicService = {
  // Sessions
  getSessions: (): Promise<ApiResponse<Session[]>> => {
    return fetchWithFallback('/academic/sessions/', mockSessions);
  },

  createSession: (session: Omit<Session, 'id'>): Promise<ApiResponse<Session>> => {
    const newSession: Session = { ...session, id: Date.now().toString() };
    return fetchWithFallback('/academic/sessions/', newSession, { method: 'POST', data: session });
  },

  // Paliers
  getPaliers: (): Promise<ApiResponse<Palier[]>> => {
    return fetchWithFallback('/academic/paliers/', mockPaliers);
  },

  getPaliersBySession: (sessionId: string): Promise<ApiResponse<Palier[]>> => {
    const filteredPaliers = mockPaliers.filter(p => p.session === sessionId);
    return fetchWithFallback(`/academic/sessions/${sessionId}/paliers/`, filteredPaliers);
  },

  // Niveaux
  getNiveaux: (): Promise<ApiResponse<Niveau[]>> => {
    return fetchWithFallback('/academic/niveaux/', mockNiveaux);
  },

  // Filières
  getFilieres: (): Promise<ApiResponse<Filiere[]>> => {
    return fetchWithFallback('/academic/filieres/', mockFilieres);
  },

  // Classes
  getClasses: (): Promise<ApiResponse<Classe[]>> => {
    return fetchWithFallback('/academic/classes/', mockClasses);
  },
};
