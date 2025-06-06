import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PreferenceUser } from '@/types/configuration';
import { configurationService } from '@/services/configurationService';

interface PreferencesState {
  preferences: PreferenceUser | null;
  setPreferences: (prefs: PreferenceUser) => void;
  loadPreferences: () => Promise<void>;
  savePreferences: (prefs: Partial<PreferenceUser>) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: null,
  setPreferences: (prefs) => set({ preferences: prefs }),
  loadPreferences: async () => {
    const res = await configurationService.getPreferences();
    set({ preferences: Array.isArray(res.data) ? res.data[0] ?? null : res.data });
  },
  savePreferences: async (prefs) => {
    const res = await configurationService.updatePreference(1, prefs);
    set({ preferences: Array.isArray(res.data) ? res.data[0] ?? null : res.data });
  },
    }),
    { name: 'preferences-storage' }
  )
);

