
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Configuration de base d'axios - utilisation de la syntaxe Vite

const protocol = window.location.protocol; //ex: 'http:' ou 'https:'
const hostname = window.location.hostname; //ex: 'csleguide.localhost' ou 'myschool.com'
const port = import.meta.env.MODE === 'development' ? ':8000' : ''; // en prod souvent sans port

const API_BASE_URL = `${protocol}//${hostname}${port}`; // ex: 'http://csleguide.localhost:8000' ou 'https://myschool.com'
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://csleguide.localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 300 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface pour les réponses d'API avec fallback
export interface ApiResponse<T> {
  data: T;
  fromApi: boolean; // Indique si les données viennent de l'API ou du fallback
}

// Fonction générique pour faire des appels avec fallback
export async function fetchWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
  }
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await apiClient.request({
      url: endpoint,
      method: options?.method || 'GET',
      data: options?.data,
    });

    console.log(`✅ API call successful for ${endpoint}`);
    return {
      data: response.data,
      fromApi: true,
    };
  } catch (error) {
    console.warn(`⚠️ API call failed for ${endpoint}, using fallback data:`, error);
    return {
      data: fallbackData,
      fromApi: false,
    };
  }
}

// Intercepteurs pour la gestion des erreurs et de l'authentification
apiClient.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }

  // Supprimer Content-Type si fichier envoyé
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }

  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion centralisée des erreurs
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      console.warn('Token expired, redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
