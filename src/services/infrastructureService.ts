import { fetchWithFallback, ApiResponse } from './api';
import { Succursale, Batiment, Salle } from '../types/infrastructure';

const mockSuccursales: Succursale[] = [
  { 
    id: 1, 
    nom: 'Campus Principal', 
    ville: 'Libreville', 
    pays: 'Gabon', 
    est_siege: true, 
    adresse: '123 Avenue de l\'Éducation',
    telephone: '+241 01 23 45 67',
    email: 'principal@ecole.ga',
    description: 'Campus principal de l\'établissement',
    is_active: true
  },
  { 
    id: 2, 
    nom: 'Campus Nord', 
    ville: 'Libreville', 
    pays: 'Gabon', 
    est_siege: false, 
    adresse: '45 Rue des Sciences',
    telephone: '+241 01 23 45 68',
    email: 'nord@ecole.ga',
    description: 'Campus secondaire au nord de Libreville',
    is_active: true
  },
  { 
    id: 3, 
    nom: 'Annexe Port-Gentil', 
    ville: 'Port-Gentil', 
    pays: 'Gabon', 
    est_siege: false, 
    adresse: '12 Boulevard de la Mer',
    telephone: '+241 05 67 89 01',
    email: 'portgentil@ecole.ga',
    description: 'Annexe située à Port-Gentil',
    is_active: true
  },
];

const mockBatiments: Batiment[] = [
  { 
    id: 1, 
    nom: 'Bâtiment A', 
    succursale: 1,
    description: 'Bâtiment principal des classes',
    is_active: true
  },
  { 
    id: 2, 
    nom: 'Bâtiment B', 
    succursale: 1,
    description: 'Bâtiment des laboratoires',
    is_active: true
  },
  { 
    id: 3, 
    nom: 'Bâtiment Principal', 
    succursale: 2,
    description: 'Bâtiment unique du campus nord',
    is_active: true
  },
  { 
    id: 4, 
    nom: 'Bloc Unique', 
    succursale: 3,
    description: 'Bloc principal de l\'annexe',
    is_active: true
  },
];

const mockSalles: Salle[] = [
  { 
    id: 1, 
    nom: 'Salle 101', 
    capacite: 35, 
    batiment: 1,
    description: 'Salle de classe standard',
    is_active: true
  },
  { 
    id: 2, 
    nom: 'Salle 102', 
    capacite: 30, 
    batiment: 1,
    description: 'Salle de classe avec équipement multimédia',
    is_active: true
  },
  { 
    id: 3, 
    nom: 'Laboratoire 201', 
    capacite: 25, 
    batiment: 2,
    description: 'Laboratoire de sciences',
    is_active: true
  },
  { 
    id: 4, 
    nom: 'Amphithéâtre', 
    capacite: 150, 
    batiment: 3,
    description: 'Grand amphithéâtre pour conférences',
    is_active: true
  },
  { 
    id: 5, 
    nom: 'Salle 001', 
    capacite: 40, 
    batiment: 4,
    description: 'Salle polyvalente',
    is_active: true
  },
];

export const infrastructureService = {
  getSuccursales: (): Promise<ApiResponse<Succursale[]>> =>
    fetchWithFallback('/api/infrastructure/succursales/', mockSuccursales),

  createSuccursale: (data: Partial<Succursale>): Promise<ApiResponse<Succursale>> => {
    const newSuccursale = {
      id: Math.max(...mockSuccursales.map(s => s.id)) + 1,
      ...data
    } as Succursale;
    
    return fetchWithFallback('/api/infrastructure/succursales/', newSuccursale, {
      method: 'POST',
      data,
    });
  },

  updateSuccursale: (id: number, data: Partial<Succursale>): Promise<ApiResponse<Succursale>> => {
    const existingSuccursale = mockSuccursales.find(s => s.id === id);
    const updatedSuccursale = { ...existingSuccursale, ...data } as Succursale;
    
    return fetchWithFallback(`/api/infrastructure/succursales/${id}/`, updatedSuccursale, {
      method: 'PUT',
      data,
    });
  },
  
  deleteSuccursale: (id: number) =>
    fetchWithFallback(`/api/infrastructure/succursales/${id}/`, {}, { method: 'DELETE' }),

  // === BATIMENTS ===
  getBatiments: (succursaleId?: number): Promise<ApiResponse<Batiment[]>> => {
    const filteredBatiments = succursaleId 
      ? mockBatiments.filter(b => b.succursale === succursaleId)
      : mockBatiments;
    
    return fetchWithFallback(
      `/api/infrastructure/batiments/${succursaleId ? `?succursale=${succursaleId}` : ''}`,
      filteredBatiments
    );
  },

  createBatiment: (data: Partial<Batiment>): Promise<ApiResponse<Batiment>> => {
    const newBatiment = {
      id: Math.max(...mockBatiments.map(b => b.id)) + 1,
      ...data
    } as Batiment;
    
    return fetchWithFallback('/api/infrastructure/batiments/', newBatiment, {
      method: 'POST',
      data,
    });
  },

  updateBatiment: (id: number, data: Partial<Batiment>): Promise<ApiResponse<Batiment>> => {
    const existingBatiment = mockBatiments.find(b => b.id === id);
    const updatedBatiment = { ...existingBatiment, ...data } as Batiment;
    
    return fetchWithFallback(`/api/infrastructure/batiments/${id}/`, updatedBatiment, {
      method: 'PUT',
      data,
    });
  },

  deleteBatiment: (id: number) =>
    fetchWithFallback(`/api/infrastructure/batiments/${id}/`, {}, { method: 'DELETE' }),

  // === SALLES ===
  getSalles: (batimentId?: number): Promise<ApiResponse<Salle[]>> => {
    const filteredSalles = batimentId 
      ? mockSalles.filter(s => s.batiment === batimentId)
      : mockSalles;
    
    return fetchWithFallback(
      `/api/infrastructure/salles/${batimentId ? `?batiment=${batimentId}` : ''}`,
      filteredSalles
    );
  },

  createSalle: (data: Partial<Salle>): Promise<ApiResponse<Salle>> => {
    const newSalle = {
      id: Math.max(...mockSalles.map(s => s.id)) + 1,
      ...data
    } as Salle;
    
    return fetchWithFallback('/api/infrastructure/salles/', newSalle, {
      method: 'POST',
      data,
    });
  },

  updateSalle: (id: number, data: Partial<Salle>): Promise<ApiResponse<Salle>> => {
    const existingSalle = mockSalles.find(s => s.id === id);
    const updatedSalle = { ...existingSalle, ...data } as Salle;
    
    return fetchWithFallback(`/api/infrastructure/salles/${id}/`, updatedSalle, {
      method: 'PUT',
      data,
    });
  },

  deleteSalle: (id: number) =>
    fetchWithFallback(`/api/infrastructure/salles/${id}/`, {}, { method: 'DELETE' }),
};
