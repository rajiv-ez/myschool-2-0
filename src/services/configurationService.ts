
import { fetchWithFallback, ApiResponse } from './api';
import { PreferenceUser } from '../types/configuration';

const mockPreferences: PreferenceUser[] = [
  { id: 1, user: 1, theme: 'light', couleur: 'purple', disposition: 'tabs' },
];

export const configurationService = {
  getPreferences: (): Promise<ApiResponse<PreferenceUser[]>> =>
    fetchWithFallback('/api/config/preferences/me/', mockPreferences),

  updatePreference: (id: number, data: Partial<PreferenceUser>): Promise<ApiResponse<PreferenceUser>> =>
    fetchWithFallback(`/api/config/preferences/${id}/`, mockPreferences[0], { method: 'PUT', data }),
};
