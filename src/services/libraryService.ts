import { fetchWithFallback, ApiResponse } from './api';
import { Livre, Emprunt } from '../types/library';

const mockLivres: Livre[] = [
  { id: Date.now(), titre: 'Le Petit Prince', auteur: 'Antoine de Saint-Exupéry', categorie: 'JEUNESSE', etat: 'BON', disponibilite: 'DISPONIBLE' },
  { id: Date.now() + 1, titre: '1984', auteur: 'George Orwell', categorie: 'SCIENCEFICTION', etat: 'NEUF', disponibilite: 'DISPONIBLE' },
];

const mockEmprunts: Emprunt[] = [
  { id: Date.now(), livre: mockLivres[0].id, user: 2, debut: '2025-06-01', fin_prevue: '2025-06-15', fin_reelle: null, statut: 'EN_COURS', prolongation: 0, hist_prolongation: '', penalite: null, echeance_penalite: 0, statut_penalite: 'AUCUNE' },
];

export const libraryService = {
  getLivres: (): Promise<ApiResponse<Livre[]>> =>
    fetchWithFallback('/api/library/livres/', mockLivres),

  getEmprunts: (): Promise<ApiResponse<Emprunt[]>> =>
    fetchWithFallback('/api/library/emprunts/', mockEmprunts),

  createLivre: (livre: Omit<Livre, 'id'>): Promise<ApiResponse<Livre>> => {
    const newLivre = { ...livre, id: Date.now() };
    mockLivres.push(newLivre);
    return fetchWithFallback('/api/library/livres/', newLivre, { method: 'POST', data: livre });
  },

  updateLivre: (id: number, updates: Partial<Livre>): Promise<ApiResponse<Livre>> => {
    const livre = mockLivres.find(l => l.id === id);
    if (livre) Object.assign(livre, updates);
    return fetchWithFallback(`/api/library/livres/${id}/`, livre!, { method: 'PUT', data: updates });
  },

  createEmprunt: (emprunt: Omit<Emprunt, 'id'>): Promise<ApiResponse<Emprunt>> => {
    const newEmprunt = { ...emprunt, id: Date.now() };
    mockEmprunts.push(newEmprunt);
    return fetchWithFallback('/api/library/emprunts/', newEmprunt, { method: 'POST', data: emprunt });
  },

  updateEmprunt: (id: number, updates: Partial<Emprunt>): Promise<ApiResponse<Emprunt>> => {
    const emprunt = mockEmprunts.find(e => e.id === id);
    if (emprunt) Object.assign(emprunt, updates);
    return fetchWithFallback(`/api/library/emprunts/${id}/`, emprunt!, { method: 'PUT', data: updates });
  },
};