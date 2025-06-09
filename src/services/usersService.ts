
import { fetchWithFallback, ApiResponse } from './api';
import { User, Eleve } from '../types/users';

const mockUsers: User[] = [
  { id: 1, email: 'jean.dupont@email.com', nom: 'Dupont', prenom: 'Jean', genre: 'M', date_naissance: '2010-05-15', lieu_naissance: 'Libreville', adresse: '123 Rue de la Paix', tel1: '+241 01 23 45 67', is_staff: false, is_active: true },
  { id: 2, email: 'marie.martin@email.com', nom: 'Martin', prenom: 'Marie', genre: 'F', date_naissance: '2011-03-20', lieu_naissance: 'Port-Gentil', adresse: '456 Avenue Central', tel1: '+241 02 34 56 78', is_staff: false, is_active: true },
  { id: 3, email: 'paul.bernard@email.com', nom: 'Bernard', prenom: 'Paul', genre: 'M', date_naissance: '2009-12-10', lieu_naissance: 'Libreville', adresse: '789 Boulevard Principal', tel1: '+241 03 45 67 89', is_staff: false, is_active: true },
  { id: 4, email: 'claire.dubois@email.com', nom: 'Dubois', prenom: 'Claire', genre: 'F', date_naissance: '2008-08-25', lieu_naissance: 'Franceville', adresse: '321 Rue des Écoles', tel1: '+241 04 56 78 90', is_staff: false, is_active: true },
];

const mockEleves: Eleve[] = [
  { id: 1, user: 1, matricule: 'E2024001', tuteurs: [1] },
  { id: 2, user: 2, matricule: 'E2024002', tuteurs: [2] },
  { id: 3, user: 3, matricule: 'E2024003', tuteurs: [3] },
  { id: 4, user: 4, matricule: 'E2024004', tuteurs: [4] },
];

export const usersService = {
  getUsers: (): Promise<ApiResponse<User[]>> =>
    fetchWithFallback('/api/users/', mockUsers),

  getEleves: (): Promise<ApiResponse<Eleve[]>> =>
    fetchWithFallback('/api/users/eleves/', mockEleves),

  getUserById: (id: number): Promise<ApiResponse<User>> =>
    fetchWithFallback(`/api/users/${id}/`, mockUsers.find(u => u.id === id) as User),

  createUser: (data: Partial<User>): Promise<ApiResponse<User>> =>
    fetchWithFallback('/api/users/', {} as User, {
      method: 'POST',
      data,
    }),

  updateUser: (id: number, data: Partial<User>): Promise<ApiResponse<User>> =>
    fetchWithFallback(`/api/users/${id}/`, {} as User, {
      method: 'PUT',
      data,
    }),
};
