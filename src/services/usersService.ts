import { fetchWithFallback, ApiResponse } from './api';
import { 
  User, Eleve, Tuteur, Staff, RelationEleveTuteur,
  UserLite, StaffDetail, EleveDetail, TuteurDetail
} from '../types/users';

const mockUsers: User[] = [
  { id: 1, email: 'jean.ndong@email.com', nom: 'NDONG', prenom: 'Jean', genre: 'M', date_naissance: '2010-05-15', lieu_naissance: 'Libreville', adresse: '123 Rue de la Paix', tel1: '+241 01 23 45 67', is_staff: false, is_active: true, is_superuser: false },
  { id: 2, email: 'marie.ndong@email.com', nom: 'NDONG', prenom: 'Marie', genre: 'F', date_naissance: '2011-03-20', lieu_naissance: 'Port-Gentil', adresse: '123 Rue de la Paix', tel1: '+241 01 23 45 67', is_staff: false, is_active: true , is_superuser: false},
  { id: 3, email: 'paul.nziengui@email.com', nom: 'NZIENGUI', prenom: 'Paul', genre: 'M', date_naissance: '2009-12-10', lieu_naissance: 'Libreville', adresse: '789 Boulevard Principal', tel1: '+241 03 45 67 89', is_staff: false, is_active: true, is_superuser: false },
  { id: 4, email: 'claire.nziengui@email.com', nom: 'NZIENGUI', prenom: 'Claire', genre: 'F', date_naissance: '2008-08-25', lieu_naissance: 'Franceville', adresse: '789 Boulevard Principal', tel1: '+241 03 45 67 89', is_staff: false, is_active: true, is_superuser: false },
  
  { id: 5, email: 'marc.ndong@email.com', nom: 'NDONG', prenom: 'Marc', genre: 'M', date_naissance: '1998-08-25', lieu_naissance: 'Franceville', adresse: '123 Rue de la Paix', tel1: '+241 01 23 45 67', is_staff: false, is_active: true, is_superuser: false },
  { id: 6, email: 'sophie.ndong@email.com', nom: 'NDONG', prenom: 'Sophie', genre: 'F', date_naissance: '1999-10-10', lieu_naissance: 'Franceville', adresse: '123 Rue de la Paix', tel1: '+241 01 23 45 67', is_staff: false, is_active: true, is_superuser: false },
  { id: 7, email: 'emilie.nziengui@email.com', nom: 'NZIENGUI', prenom: 'Emilie', genre: 'F', date_naissance: '1992-08-25', lieu_naissance: 'Franceville', adresse: '789 Boulevard Principal', tel1: '+241 03 45 67 89', is_staff: false, is_active: true, is_superuser: false },
  
  { id: 8, email: 'claire.dubois@email.com', nom: 'Dubois', prenom: 'Claire', genre: 'F', date_naissance: '1990-08-25', lieu_naissance: 'Paris', adresse: '321 Rue des Écoles', tel1: '+241 04 56 78 90', is_staff: true, is_active: true, is_superuser: false },
  { id: 9, email: 'diallo.ousmane@email.com', nom: 'Ousmane', prenom: 'Diallo', genre: 'M', date_naissance: '1988-08-25', lieu_naissance: 'Dakar', adresse: '321 Rue des Écoles', tel1: '+241 04 56 78 90', is_staff: true, is_active: true, is_superuser: false },
];

const mockUserLites: UserLite[] = [
    { id: 7, email: 'emilie.nziengui@email.com', nom: 'NZIENGUI', prenom: 'Emilie', genre: 'F', date_naissance: '1992-08-25', lieu_naissance: 'Franceville', adresse: '789 Boulevard Principal', tel1: '+241 03 45 67 89', },
]

const mockTuteurs: Tuteur[] = [
  { id: 1, user: 5, profession: 'Enseignant' },
  { id: 2, user: 6, profession: 'Enseignante' },
  { id: 3, user: 7, profession: 'Fonctionnaire' },
];

const mockEleves: Eleve[] = [
  { id: 1, user: 1, matricule: 'E2024001', tuteurs: [1, 2] },
  { id: 2, user: 2, matricule: 'E2024002', tuteurs: [1] },
  { id: 3, user: 3, matricule: 'E2024003', tuteurs: [3] },
  { id: 4, user: 4, matricule: 'E2024004', tuteurs: [3] },
];

const mockRelations: RelationEleveTuteur[] = [
  { id: 1, eleve: 1, tuteur: 1, relation: 'Père' },
  { id: 2, eleve: 1, tuteur: 2, relation: 'Mère' },
  { id: 3, eleve: 2, tuteur: 1, relation: 'Père' },
  { id: 4, eleve: 3, tuteur: 3, relation: 'Mère' },
];

const mockStaffs: Staff[] = [
  { id: 1, user: 7, poste: 1, date_embauche: '2011-01-01', statut: 'ACTIF', domaines: [], niveaux: [] }, 
  { id: 2, user: 9, poste: 1, date_embauche: '2011-01-01', statut: 'ACTIF', domaines: [], niveaux: [] },
];

const mockStaffsDetails: StaffDetail[] = [
  { id: 1, date_embauche: '2011-01-01', statut: 'ACTIF', user: mockUsers[6], poste: 1, domaines: [], niveaux: [] }, 
  { id: 2, date_embauche: '2011-01-01', statut: 'ACTIF', user: mockUsers[8], poste: 1, domaines: [], niveaux: [] },
];

const mockTuteursDetails: TuteurDetail[] = [
  { id: 1, user: mockUsers[4], profession: 'Enseignant' },
  { id: 2, user: mockUsers[5], profession: 'Enseignante' },
  { id: 3, user: mockUsers[6], profession: 'Fonctionnaire' },
];

const mockElevesDetails: EleveDetail[] = [
  { id: 1, user: mockUsers[0], matricule: 'E2024001', tuteurs: [1, 2] },
  { id: 2, user: mockUsers[1], matricule: 'E2024002', tuteurs: [1] },
  { id: 3, user: mockUsers[2], matricule: 'E2024003', tuteurs: [3] },
  { id: 4, user: mockUsers[3], matricule: 'E2024004', tuteurs: [3] },
];

export const usersService = {
  getUsers: (): Promise<ApiResponse<User[]>> =>
    fetchWithFallback('/api/accounts/users/', mockUsers),
  getUserById: (id: number): Promise<ApiResponse<User>> =>
    fetchWithFallback(`/api/accounts/users/${id}/`, mockUsers.find(u => u.id === id) as User),
  createUser: (data: Partial<User>): Promise<ApiResponse<User>> =>
    fetchWithFallback('/api/accounts/users/', {} as User, { method: 'POST', data, }),
  updateUser: (id: number, data: Partial<User>): Promise<ApiResponse<User>> =>
    fetchWithFallback(`/api/accounts/users/${id}/`, {} as User, { method: 'PUT', data, }),
  deleteUser: (id: number) =>
    fetchWithFallback(`/api/accounts/users/${id}/`, {}, { method: 'DELETE' }),

  // Tuteurs - Basic endpoints (deprecated, use TuteurDetail instead)
  getTuteurs: (): Promise<ApiResponse<Tuteur[]>> =>
    fetchWithFallback('/api/accounts/tuteurs/', mockTuteurs),
  createTuteur: (data: Partial<Tuteur>): Promise<ApiResponse<Tuteur>> =>
    fetchWithFallback('/api/accounts/tuteurs/', {} as Tuteur, { method: 'POST', data, }),
  updateTuteur: (id: number, data: Partial<Tuteur>): Promise<ApiResponse<Tuteur>> =>
    fetchWithFallback(`/api/accounts/tuteurs/${id}/`, {} as Tuteur, { method: 'PUT', data, }),
  deleteTuteur: (id: number) =>
    fetchWithFallback(`/api/accounts/tuteurs/${id}/`, {}, { method: 'DELETE' }),
  
  // TuteurDetail - Combined User + Tuteur operations
  getTuteursDetails: (): Promise<ApiResponse<TuteurDetail[]>> =>
    fetchWithFallback('/api/accounts/tuteurs-details/', mockTuteursDetails),
  createTuteurDetail: (data: Partial<TuteurDetail>): Promise<ApiResponse<TuteurDetail>> =>
    fetchWithFallback('/api/accounts/tuteurs-details/', {} as TuteurDetail, { method: 'POST', data, }),
  updateTuteurDetail: (id: number, data: Partial<TuteurDetail>): Promise<ApiResponse<TuteurDetail>> =>
    fetchWithFallback(`/api/accounts/tuteurs-details/${id}/`, {} as TuteurDetail, { method: 'PUT', data, }),
  deleteTuteurDetail: (id: number) =>
    fetchWithFallback(`/api/accounts/tuteurs-details/${id}/`, {}, { method: 'DELETE' }),

  // Eleves - Basic endpoints (deprecated, use EleveDetail instead)
  getEleves: (): Promise<ApiResponse<Eleve[]>> =>
    fetchWithFallback('/api/accounts/eleves/', mockEleves),
  createEleve: (data: Partial<Eleve>): Promise<ApiResponse<Eleve>> =>
    fetchWithFallback('/api/accounts/eleves/', {} as Eleve, { method: 'POST', data, }),
  updateEleve: (id: number, data: Partial<Eleve>): Promise<ApiResponse<Eleve>> =>
    fetchWithFallback(`/api/accounts/eleves/${id}/`, {} as Eleve, { method: 'PUT', data, }),
  deleteEleve: (id: number) =>
    fetchWithFallback(`/api/accounts/eleves/${id}/`, {}, { method: 'DELETE' }),
  
  // EleveDetail - Combined User + Eleve operations
  getElevesDetails: (): Promise<ApiResponse<EleveDetail[]>> =>
    fetchWithFallback('/api/accounts/eleves-details/', mockElevesDetails),
  createEleveDetail: (data: Partial<EleveDetail>): Promise<ApiResponse<EleveDetail>> =>
    fetchWithFallback('/api/accounts/eleves-details/', {} as EleveDetail, { method: 'POST', data, }),
  updateEleveDetail: (id: number, data: Partial<EleveDetail>): Promise<ApiResponse<EleveDetail>> =>
    fetchWithFallback(`/api/accounts/eleves-details/${id}/`, {} as EleveDetail, { method: 'PUT', data, }),
  deleteEleveDetail: (id: number) =>
    fetchWithFallback(`/api/accounts/eleves-details/${id}/`, {}, { method: 'DELETE' }),

  // Relations
  getRelations: (): Promise<ApiResponse<RelationEleveTuteur[]>> =>
    fetchWithFallback('/api/accounts/relations/', mockRelations),
  createRelation: (data: Partial<RelationEleveTuteur>): Promise<ApiResponse<RelationEleveTuteur>> =>
    fetchWithFallback('/api/accounts/relations/', {} as RelationEleveTuteur, { method: 'POST', data, }),
  updateRelation: (id: number, data: Partial<RelationEleveTuteur>): Promise<ApiResponse<RelationEleveTuteur>> =>
    fetchWithFallback(`/api/accounts/relations/${id}/`, {} as RelationEleveTuteur, { method: 'PUT', data, }),
  deleteRelation: (id: number) =>
    fetchWithFallback(`/api/accounts/relations/${id}/`, {}, { method: 'DELETE' }),
  
  // Staffs - Basic endpoints (deprecated, use StaffDetail instead)
  getStaffs: (): Promise<ApiResponse<Staff[]>> =>
    fetchWithFallback('/api/accounts/staffs/', mockStaffs),
  createStaff: (data: Partial<Staff>): Promise<ApiResponse<Staff>> =>
    fetchWithFallback('/api/accounts/staffs/', {} as Staff, { method: 'POST', data, }),
  updateStaff: (id: number, data: Partial<Staff>): Promise<ApiResponse<Staff>> =>
    fetchWithFallback(`/api/accounts/staffs/${id}/`, {} as Staff, { method: 'PUT', data, }),
  deleteStaff: (id: number) =>
    fetchWithFallback(`/api/accounts/staffs/${id}/`, {}, { method: 'DELETE' }),
  
  // StaffDetail - Combined User + Staff operations
  getStaffsDetails: (): Promise<ApiResponse<StaffDetail[]>> =>
    fetchWithFallback('/api/accounts/staffs-details/', mockStaffsDetails),
  createStaffDetail: (data: Partial<StaffDetail>): Promise<ApiResponse<StaffDetail>> =>
    fetchWithFallback('/api/accounts/staffs-details/', {} as StaffDetail, { method: 'POST', data, }),
  updateStaffDetail: (id: number, data: Partial<StaffDetail>): Promise<ApiResponse<StaffDetail>> =>
    fetchWithFallback(`/api/accounts/staffs-details/${id}/`, {} as StaffDetail, { method: 'PUT', data, }),
  deleteStaffDetail: (id: number) =>
    fetchWithFallback(`/api/accounts/staffs-details/${id}/`, {}, { method: 'DELETE' }),
};
