
import { fetchWithFallback, ApiResponse } from './api';
import api from './api';
import { 
  Annonce, LuParAnnonce,
  PreferenceUser, 
  ConfigurationClasse, DispositionClasse, 
  Place, DemandeChangementPlace
} from '../types/configuration';

const mockAnnonces: Annonce[] = [];
const mockLectures: LuParAnnonce[] = [];

const mockPreferences: PreferenceUser[] = [
  { id: 1, user: 1, theme: 'light', couleur: 'purple', disposition: 'tabs' },
];

const mockConfigs: ConfigurationClasse[] = [];
const mockDispositions: DispositionClasse[] = [];
const mockPlaces: Place[] = [];
const mockDemandes: DemandeChangementPlace[] = [];

export const configurationService = {
  getAnnonces: (): Promise<ApiResponse<Annonce[]>> =>
    fetchWithFallback('/api/annonces/', mockAnnonces),
  createAnnonce: (data: Partial<Annonce>) =>
    fetchWithFallback('/api/annonces/', {}, { method: 'POST', data }),
  updateAnnonce: (id: number, data: Partial<Annonce>) =>
    fetchWithFallback(`/api/annonces/${id}/`, {}, { method: 'PUT', data }),
  deleteAnnonce: (id: number) =>
    fetchWithFallback(`/api/annonces/${id}/`, {}, { method: 'DELETE' }),

  // LECTURES
  getLectures: (userId?: number, annonceId?: number): Promise<ApiResponse<LuParAnnonce[]>> =>
    fetchWithFallback( `/api/lectures/${ userId ? `?user=${userId}` : '' }${annonceId ? `?annonce=${annonceId}` : ''}`,mockLectures),
  createLecture: (data: Partial<LuParAnnonce>) =>
    fetchWithFallback('/api/lectures/', {}, { method: 'POST', data }),

  // PREFERENCES
  getPreferences: (): Promise<ApiResponse<PreferenceUser[]>> =>
    fetchWithFallback('/api/config/preferences/me/', mockPreferences),

  updatePreference: (id: number, data: Partial<PreferenceUser>): Promise<ApiResponse<PreferenceUser>> =>
    fetchWithFallback(`/api/config/preferences/${id}/`, mockPreferences[0], { method: 'PUT', data }),
  
  // === CONFIGURATION CLASSE ===
  getConfigurations: (classeSessionId?: number): Promise<ApiResponse<ConfigurationClasse[]>> => {
    const url = classeSessionId
      ? `/api/config/classes/?classe_session=${classeSessionId}`
      : `/api/config/classes/`;
    return fetchWithFallback(url, mockConfigs);
  },

  createConfiguration: (data: Partial<ConfigurationClasse>) =>
    api.post('/api/config/classes/', data),

  updateConfiguration: (id: number, data: Partial<ConfigurationClasse>) =>
    api.patch(`/api/config/classes/${id}/`, data),

  setConfigurationActive: (id: number) =>
    api.post(`/api/config/classes/${id}/activer/`, {}),

  getConfigurationComplete: (classeSessionId: number) =>
    api.get(`/api/config/classes/full/${classeSessionId}/`),


  // === DISPOSITION CLASSE ===
  getDispositions: (configId?: number): Promise<ApiResponse<DispositionClasse[]>> => {
    const url = configId
      ? `/api/config/dispositions/?configuration=${configId}`
      : `/api/config/dispositions/`;
    return fetchWithFallback(url, mockDispositions);
  },

  createDisposition: (data: Partial<DispositionClasse>) =>
    api.post('/api/config/dispositions-full/', data),

  updateDisposition: (id: number, data: Partial<DispositionClasse>) =>
    api.put(`/api/config/dispositions-full/${id}/`, data),

  setDispositionActive: (id: number) =>
    api.post(`/api/config/dispositions/${id}/activer/`, {}),


  // === PLACES ===
  getPlaces: (): Promise<ApiResponse<Place[]>> =>
    fetchWithFallback('/api/config/places/', mockPlaces),

  getPlacesByDisposition: (dispositionId: number) =>
    api.get<Place[]>(`/api/config/places/?disposition=${dispositionId}`),


  // === DEMANDES DE CHANGEMENT ===
  getDemandes: (): Promise<ApiResponse<DemandeChangementPlace[]>> =>
    fetchWithFallback('/api/config/demandes-changement-place/', mockDemandes),

  createDemande: (data: Partial<DemandeChangementPlace>) =>
    api.post('/api/config/demandes-changement-place/', data),

  updateDemande: (id: number, data: Partial<DemandeChangementPlace>) =>
    api.patch(`/api/config/demandes-changement-place/${id}/`, data),
  
};
