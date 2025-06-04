import { fetchWithFallback, ApiResponse } from './api';
import { Article, CategorieArticle, DemandeActif } from '../types/stocks';

const mockCategories: CategorieArticle[] = [
  { id: Date.now(), nom: 'Matériel informatique', description: 'Ordinateurs, câbles, etc.' },
];

const mockArticles: Article[] = [
  { id: Date.now(), nom: 'Ordinateur Dell', description: 'PC portable', categorie: mockCategories[0].id, quantite: 5, seuil: 2, etat: 'neuf', date_achat: '2025-06-01', prix_achat: '350000', prix_vente: null },
];

const mockDemandes: DemandeActif[] = [
  { id: Date.now(), demandeur: 2, article: mockArticles[0].id, quantite: 1, motif: 'Besoin pour présentation', date: '2025-06-02', statut: 'en_attente', motif_refus: null },
];

export const stocksService = {
  getCategories: (): Promise<ApiResponse<CategorieArticle[]>> =>
    fetchWithFallback('/api/stocks/categories/', mockCategories),

  getArticles: (): Promise<ApiResponse<Article[]>> =>
    fetchWithFallback('/api/stocks/articles/', mockArticles),

  getDemandes: (): Promise<ApiResponse<DemandeActif[]>> =>
    fetchWithFallback('/api/stocks/demandes/', mockDemandes),

  createArticle: (article: Omit<Article, 'id'>): Promise<ApiResponse<Article>> => {
    const newArticle = { ...article, id: Date.now() };
    mockArticles.push(newArticle);
    return fetchWithFallback('/api/stocks/articles/', newArticle, { method: 'POST', data: article });
  },

  updateArticle: (id: number, updates: Partial<Article>): Promise<ApiResponse<Article>> => {
    const article = mockArticles.find(a => a.id === id);
    if (article) Object.assign(article, updates);
    return fetchWithFallback(`/api/stocks/articles/${id}/`, article!, { method: 'PUT', data: updates });
  },

  createDemande: (demande: Omit<DemandeActif, 'id'>): Promise<ApiResponse<DemandeActif>> => {
    const newDemande = { ...demande, id: Date.now() };
    mockDemandes.push(newDemande);
    return fetchWithFallback('/api/stocks/demandes/', newDemande, { method: 'POST', data: demande });
  },

  updateDemande: (id: number, updates: Partial<DemandeActif>): Promise<ApiResponse<DemandeActif>> => {
    const demande = mockDemandes.find(d => d.id === id);
    if (demande) Object.assign(demande, updates);
    return fetchWithFallback(`/api/stocks/demandes/${id}/`, demande!, { method: 'PUT', data: updates });
  },
};
