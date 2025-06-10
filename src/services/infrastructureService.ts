import { fetchWithFallback, ApiResponse } from './api';
import { Succursale, Batiment, Salle } from '../types/infrastructure';

const mockSuccursales: Succursale[] = [
  { id: 1, nom: 'Campus A', ville: 'Cotonou', pays: 'Bénin', est_siege: true, adresse: 'Rue 1' },
];

const mockBatiments: Batiment[] = [
  { id: 1, nom: 'Bloc A', succursale: 1 },
  { id: 2, nom: 'Bloc B', succursale: 1 },
];

const mockSalles: Salle[] = [
  { id: 1, nom: 'Salle 101', capacite: 40, batiment: 1 },
  { id: 2, nom: 'Salle 102', capacite: 35, batiment: 1 },
];

export const infrastructureService = {
  getSuccursales: (): Promise<ApiResponse<Succursale[]>> =>
    fetchWithFallback('/api/infrastructure/succursales/', mockSuccursales),

  createSuccursale: (data: Partial<Succursale>): Promise<ApiResponse<Succursale>> =>
    fetchWithFallback('/api/infrastructure/succursales/', {} as Succursale, {
      method: 'POST',
      data,
    }),
  updateSuccursale: (id: number, data: Partial<Succursale>): Promise<ApiResponse<Succursale>> =>
    fetchWithFallback(`/api/infrastructure/succursales/${id}/`, {} as Succursale, {
      method: 'PUT',
      data,
    }),
  
  deleteSuccursale: (id: number) =>
    fetchWithFallback(`/api/infrastructure/succursales/${id}/`, {}, { method: 'DELETE' }),

  // === BATIMENTS ===
  getBatiments: (succursaleId?: number): Promise<ApiResponse<Batiment[]>> =>
    fetchWithFallback(
      `/api/infrastructure/batiments/${succursaleId ? `?succursale=${succursaleId}` : ''}`,
      mockBatiments
    ),

  createBatiment: (data: Partial<Batiment>): Promise<ApiResponse<Batiment>> =>
    fetchWithFallback('/api/infrastructure/batiments/', {} as Batiment, {
      method: 'POST',
      data,
    }),

  updateBatiment: (id: number, data: Partial<Batiment>): Promise<ApiResponse<Batiment>> =>
    fetchWithFallback(`/api/infrastructure/batiments/${id}/`, {} as Batiment, {
      method: 'PUT',
      data,
    }),

  deleteBatiment: (id: number) =>
    fetchWithFallback(`/api/infrastructure/batiments/${id}/`, {}, { method: 'DELETE' }),

  // === SALLES ===
  getSalles: (batimentId?: number): Promise<ApiResponse<Salle[]>> =>
    fetchWithFallback(
      `/api/infrastructure/salles/${batimentId ? `?batiment=${batimentId}` : ''}`,
      mockSalles
    ),

  createSalle: (data: Partial<Salle>): Promise<ApiResponse<Salle>> =>
    fetchWithFallback('/api/infrastructure/salles/', {} as Salle, {
      method: 'POST',
      data,
    }),

  updateSalle: (id: number, data: Partial<Salle>): Promise<ApiResponse<Salle>> =>
    fetchWithFallback(`/api/infrastructure/salles/${id}/`, {} as Salle, {
      method: 'PUT',
      data,
    }),

  deleteSalle: (id: number) =>
    fetchWithFallback(`/api/infrastructure/salles/${id}/`, {}, { method: 'DELETE' }),
};

