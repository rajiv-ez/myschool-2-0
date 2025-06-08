// src/stores/useAuthStore.ts
import { create } from 'zustand';
import api from '@/services/api';
import { User } from '@/types/users';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/api/auth/login/', { email, password });
        console.log('Réponse de connexion', res.data);
      const token = res.data.token;
      localStorage.setItem('token', token);
      set({ token });
      await useAuthStore.getState().fetchUser();
    } catch (error: any) {
      set({ error: 'Échec de la connexion' });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
    window.location.href = '/connexion';
  },

  fetchUser: async () => {
    try {
      const res = await api.get('/api/accounts/me/');
      set({ user: res.data });
      console.log('Utilisateur récupéré', res.data);
    } catch {
      set({ user: null });
    }
  },
}));
