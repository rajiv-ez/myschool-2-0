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
  getBatiments: (): Promise<ApiResponse<Batiment[]>> =>
    fetchWithFallback('/api/infrastructure/batiments/', mockBatiments),
  getSalles: (): Promise<ApiResponse<Salle[]>> =>
    fetchWithFallback('/api/infrastructure/salles/', mockSalles),
};
