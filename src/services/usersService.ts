// src/services/usersService.ts
import { fetchWithFallback } from './api';
import { User, Staff, Tuteur, Eleve, RelationEleveTuteur } from '../types/users';

const mockUsers: User[] = [
  {
    id: 1,
    email: 'alice@example.com',
    nom: 'Dupont',
    prenom: 'Alice',
    genre: 'F',
    date_naissance: '1975-01-01',
    lieu_naissance: 'Paris',
    adresse: '123 rue Lafayette',
    tel1: '0102030405',
    tel2: '',
    whatsapp: '',
    is_staff: true,
    is_active: true,
    photo: null,
  },
  {
    id: 2,
    email: 'eleve@example.com',
    nom: 'Nguema',
    prenom: 'Eric',
    genre: 'M',
    date_naissance: '2000-01-01',
    lieu_naissance: 'Libreville',
    adresse: 'Nzeng-Ayong',
    tel1: '074676038',
    tel2: '',
    whatsapp: '',
    is_staff: true,
    is_active: true,
    photo: null,
  },
  {
    id: 3,
    email: 'tuteur@example.com',
    nom: 'Nguema',
    prenom: 'Emilie',
    genre: 'F',
    date_naissance: '1992-01-01',
    lieu_naissance: 'Libreville',
    adresse: 'Nzeng-Ayong',
    tel1: '074676038',
    tel2: '',
    whatsapp: '24174676038',
    is_staff: true,
    is_active: true,
    photo: null,
  },
];

const mockStaff: Staff[] = [
  { id: 1, user: 1, poste: 1, date_embauche: '2020-09-01', statut: 'ACTIF', domaines: [], niveaux: [] },
];

const mockTuteurs: Tuteur[] = [
  { id: 1, user: 3, profession: 'Médecin' },
];

const mockEleves: Eleve[] = [
  { id: 1, user: 2, matricule: 'E123', tuteurs: [3] },
];

const mockRelations: RelationEleveTuteur[] = [
  { id: 1, eleve: 2, tuteur: 3, relation: 'Mère' },
];

export const usersService = {
  getUsers: () => fetchWithFallback('/api/users/users/', mockUsers),
  getStaffs: () => fetchWithFallback('/api/users/staff/', mockStaff),
  getTuteurs: () => fetchWithFallback('/api/users/tuteurs/', mockTuteurs),
  getEleves: () => fetchWithFallback('/api/users/eleves/', mockEleves),
  getRelations: () => fetchWithFallback('/api/users/relations/', mockRelations),
};
