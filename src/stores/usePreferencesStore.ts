
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PreferenceUser } from '@/types/configuration';
import { configurationService } from '@/services/configurationService';

interface PreferencesState {
  preferences: PreferenceUser | null;
  loading: boolean;
  error: string | null;
  setPreferences: (prefs: PreferenceUser) => void;
  loadPreferences: () => Promise<void>;
  savePreferences: (prefs: Partial<PreferenceUser>) => Promise<void>;
  updateLocalPreferences: (prefs: Partial<PreferenceUser>) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: null,
      loading: false,
      error: null,

      setPreferences: (prefs) => set({ preferences: prefs, error: null }),

      loadPreferences: async () => {
        set({ loading: true, error: null });
        try {
          const res = await configurationService.getPreferences();
          const preferences = Array.isArray(res.data) ? res.data[0] ?? null : res.data;
          set({ preferences, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors du chargement des préférences',
            loading: false 
          });
        }
      },

      savePreferences: async (prefs) => {
        const currentPrefs = get().preferences;
        if (!currentPrefs) return;

        set({ loading: true, error: null });
        try {
          const res = await configurationService.updatePreference(currentPrefs.id, prefs);
          const updatedPreferences = Array.isArray(res.data) ? res.data[0] ?? null : res.data;
          set({ preferences: updatedPreferences, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde des préférences',
            loading: false 
          });
        }
      },

      updateLocalPreferences: (prefs) => {
        const currentPrefs = get().preferences;
        if (currentPrefs) {
          set({ preferences: { ...currentPrefs, ...prefs } });
        }
      },
    }),
    { 
      name: 'preferences-storage',
      partialize: (state) => ({ preferences: state.preferences })
    }
  )
);
