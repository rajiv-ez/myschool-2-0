
import { fetchWithFallback, ApiResponse } from './api';
import api from './api';
import { 
  PreferenceUser, 
  ConfigurationClasse, DispositionClasse, 
  Place, DemandeChangementPlace
} from '../types/configuration';

const mockPreferences: PreferenceUser[] = [
  { id: 1, user: 1, theme: 'light', couleur: 'purple', disposition: 'tabs' },
];

const mockConfigs: ConfigurationClasse[] = [];
const mockDispositions: DispositionClasse[] = [];
const mockPlaces: Place[] = [];
const mockDemandes: DemandeChangementPlace[] = [];

export const configurationService = {
  getPreferences: (): Promise<ApiResponse<PreferenceUser[]>> =>
    fetchWithFallback('/api/config/preferences/me/', mockPreferences),

  updatePreference: (id: number, data: Partial<PreferenceUser>): Promise<ApiResponse<PreferenceUser>> =>
    fetchWithFallback(`/api/config/preferences/${id}/`, mockPreferences[0], { method: 'PUT', data }),
  
  getConfigurations: (): Promise<ApiResponse<ConfigurationClasse[]>> =>
    fetchWithFallback('/api/configurations/configurations/', mockConfigs),
  createConfiguration: (data: Partial<ConfigurationClasse>) => api.post('/api/configurations/classes/', data),
  setConfigurationActive: (id: number) => api.post(`/api/configurations/classes/${id}/activer/`, {}),

  getDispositions: (): Promise<ApiResponse<DispositionClasse[]>> =>
    fetchWithFallback('/api/configurations/dispositions/', mockDispositions),
  createDisposition: (data: Partial<DispositionClasse>) => api.post('/api/configurations/dispositions/', data),
  setDispositionActive: (id: number) => api.post(`/api/configurations/dispositions/${id}/activer/`, {}),

  getPlaces: (): Promise<ApiResponse<Place[]>> =>
    fetchWithFallback('/api/configurations/places/', mockPlaces),
  getPlacesByDisposition: (id: number) => api.get<Place[]>(`/api/configurations/places/?disposition=${id}`),

  getDemandes: (): Promise<ApiResponse<DemandeChangementPlace[]>> =>
    fetchWithFallback('/api/configurations/demandes-changement-place/', mockDemandes),
  
};
