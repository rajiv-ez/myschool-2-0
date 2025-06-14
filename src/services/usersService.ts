
import { fetchWithFallback, ApiResponse } from './api';
import { User, Eleve, Tuteur, Staff, RelationEleveTuteur } from '../types/users';

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
  { id: 1, user: mockUsers[7], poste: 1, date_embauche: '2011-01-01', statut: 'ACTIF', domaines: [], niveaux: [] }, 
  { id: 2, user: 9, poste: 1, date_embauche: '2011-01-01', statut: 'ACTIF', domaines: [], niveaux: [] },
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


  // Tuteurs
  getTuteurs: (): Promise<ApiResponse<Tuteur[]>> =>
    fetchWithFallback('/api/accounts/tuteurs/', mockTuteurs), // ex: [ { "id": 4, "user": 3, "profession": "Comptable" } ]
  createTuteur: (data: Partial<Tuteur>): Promise<ApiResponse<Tuteur>> =>
    fetchWithFallback('/api/accounts/tuteurs/', {} as Tuteur, { method: 'POST', data, }),
  updateTuteur: (id: number, data: Partial<Tuteur>): Promise<ApiResponse<Tuteur>> =>
    fetchWithFallback(`/api/accounts/tuteurs/${id}/`, {} as Tuteur, { method: 'PUT', data, }),
  deleteTuteur: (id: number) =>
    fetchWithFallback(`/api/accounts/tuteurs/${id}/`, {}, { method: 'DELETE' }),
  
  getTuteursDetails: (): Promise<ApiResponse<Tuteur[]>> =>
    fetchWithFallback('/api/accounts/tuteurs-details/', mockTuteurs), // ex: [ { "id": 4, "user": { "id": 3, "is_superuser": false, "email": "parent1@csleguide.com", "nom": "Fokou", "prenom": "Jean", "genre": "M", "date_naissance": "1970-03-20", "lieu_naissance": "Bafoussam", "adresse": "Adresse 3", "tel1": "74000003", "tel2": "", "whatsapp": "", "photo": null }, "profession": "Comptable" } ]
  createTuteurDetail: (data: Partial<Tuteur>): Promise<ApiResponse<Tuteur>> =>
    fetchWithFallback('/api/accounts/tuteurs-details/', {} as Tuteur, { method: 'POST', data, }),
  updateTuteurDetail: (id: number, data: Partial<Tuteur>): Promise<ApiResponse<Tuteur>> =>
    fetchWithFallback(`/api/accounts/tuteurs-details/${id}/`, {} as Tuteur, { method: 'PUT', data, }),
  deleteTuteurDetail: (id: number) =>
    fetchWithFallback(`/api/accounts/tuteurs-details/${id}/`, {}, { method: 'DELETE' }),


  // Eleves
  getEleves: (): Promise<ApiResponse<Eleve[]>> =>
    fetchWithFallback('/api/accounts/eleves/', mockEleves), // ex: [ { "id": 4, "matricule": "E2025001", "user": 4, "tuteurs": [ 4 ] } ]
  createEleve: (data: Partial<Eleve>): Promise<ApiResponse<Eleve>> =>
    fetchWithFallback('/api/accounts/eleves/', {} as Eleve, { method: 'POST', data, }),
  updateEleve: (id: number, data: Partial<Eleve>): Promise<ApiResponse<Eleve>> =>
    fetchWithFallback(`/api/accounts/eleves/${id}/`, {} as Eleve, { method: 'PUT', data, }),
  deleteEleve: (id: number) =>
    fetchWithFallback(`/api/accounts/eleves/${id}/`, {}, { method: 'DELETE' }),
  
  getElevesDetails: (): Promise<ApiResponse<Eleve[]>> =>
    fetchWithFallback('/api/accounts/eleves-details/', mockEleves), // ex: [{ "id": 4, "user": { "id": 4, "is_superuser": false, "email": "eleve1@csleguide.com", "nom": "Fokou", "prenom": "Emma", "genre": "F", "date_naissance": "2010-09-01", "lieu_naissance": "Bafoussam", "adresse": "Adresse 3", "tel1": "74000004", "tel2": "", "whatsapp": "", "photo": null }, "matricule": "E2025001", "tuteurs": [ { "id": 4, "profession": "Comptable", "user": 3 }]
  createEleveDetail: (data: Partial<Eleve>): Promise<ApiResponse<Eleve>> =>
    fetchWithFallback('/api/accounts/eleves-details/', {} as Eleve, { method: 'POST', data, }),
  updateEleveDetail: (id: number, data: Partial<Eleve>): Promise<ApiResponse<Eleve>> =>
    fetchWithFallback(`/api/accounts/eleves-details/${id}/`, {} as Eleve, { method: 'PUT', data, }),
  deleteEleveDetail: (id: number) =>
    fetchWithFallback(`/api/accounts/eleves-details/${id}/`, {}, { method: 'DELETE' }),

  getRelations: (): Promise<ApiResponse<RelationEleveTuteur[]>> =>
    fetchWithFallback('/api/accounts/tuteurs/', mockRelations), // ex: [ { "id": 2, "relation": "Père", "eleve": { "id": 4, "matricule": "E2025001", "user": 4, "tuteurs": [ 4 ] }, "tuteur": { "id": 4, "profession": "Comptable", "user": 3 } } ]
  createRelation: (data: Partial<RelationEleveTuteur>): Promise<ApiResponse<RelationEleveTuteur>> =>
    fetchWithFallback('/api/accounts/tuteurs/', {} as RelationEleveTuteur, { method: 'POST', data, }),
  updateRelation: (id: number, data: Partial<RelationEleveTuteur>): Promise<ApiResponse<RelationEleveTuteur>> =>
    fetchWithFallback(`/api/accounts/tuteurs/${id}/`, {} as RelationEleveTuteur, { method: 'PUT', data, }),
  deleteRelation: (id: number) =>
    fetchWithFallback(`/api/accounts/tuteurs/${id}/`, {}, { method: 'DELETE' }),
  

  // Staffs
  getStaffs: (): Promise<ApiResponse<Staff[]>> =>
    fetchWithFallback('/api/accounts/staffs/', mockStaffs), // ex: [ { "id": 7, "user": { "id": 1, "is_superuser": false, "email": "prof1@csleguide.com", "nom": "Ngoma", "prenom": "Paul", "genre": "M", "date_naissance": "1980-01-01", "lieu_naissance": "Douala", "adresse": "Adresse 1", "tel1": "74000001", "tel2": "", "whatsapp": "", "photo": null }, "date_embauche": "2020-09-01", "statut": "ACTIF", "poste": 2, "domaines": [], "niveaux": [] }, ]
  createStaff: (data: Partial<Staff>): Promise<ApiResponse<Staff>> =>
    fetchWithFallback('/api/accounts/staffs/', {} as Staff, { method: 'POST', data, }),
  updateStaff: (id: number, data: Partial<Staff>): Promise<ApiResponse<Staff>> =>
    fetchWithFallback(`/api/accounts/staffs/${id}/`, {} as Staff, { method: 'PUT', data, }),
  deleteStaff: (id: number) =>
    fetchWithFallback(`/api/accounts/staffs/${id}/`, {}, { method: 'DELETE' }),
  
  getStaffsDetails: (): Promise<ApiResponse<Staff[]>> =>
    fetchWithFallback('/api/accounts/staffs-details/', mockStaffs), // ex: [ { "id": 7, "date_embauche": "2020-09-01", "statut": "ACTIF", "user": 1, "poste": 2, "domaines": [], "niveaux": [] },]
  createStaffDetail: (data: Partial<Staff>): Promise<ApiResponse<Staff>> =>
    fetchWithFallback('/api/accounts/staffs-details/', {} as Staff, { method: 'POST', data, }),
  updateStaffDetail: (id: number, data: Partial<Staff>): Promise<ApiResponse<Staff>> =>
    fetchWithFallback(`/api/accounts/staffs-details/${id}/`, {} as Staff, { method: 'PUT', data, }),
  deleteStaffDetail: (id: number) =>
    fetchWithFallback(`/api/accounts/staffs-details/${id}/`, {}, { method: 'DELETE' }),
};
