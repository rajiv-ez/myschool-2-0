
import { fetchWithFallback, ApiResponse } from './api';
import { Article, CategorieArticle, DemandeActif } from '../types/stocks';

// Données fictives pour le fallback
const mockCategories: CategorieArticle[] = [
  { id: '1', nom: 'Mobilier', description: 'Tables, chaises, armoires' },
  { id: '2', nom: 'Informatique', description: 'Ordinateurs, imprimantes, accessoires' },
  { id: '3', nom: 'Fournitures', description: 'Papier, stylos, cahiers' },
  { id: '4', nom: 'Sport', description: 'Équipements sportifs' },
];

const mockArticles: Article[] = [
  {
    id: '1',
    nom: 'Chaise de bureau',
    description: 'Chaise ergonomique pour bureau',
    categorie: '1',
    quantite: 50,
    seuil: 10,
    etat: 'bon etat',
    date_achat: '2024-01-15',
    prix_achat: 75000,
    prix_vente: 85000
  },
  {
    id: '2',
    nom: 'Ordinateur portable',
    description: 'Laptop pour enseignants',
    categorie: '2',
    quantite: 15,
    seuil: 5,
    etat: 'neuf',
    date_achat: '2024-02-10',
    prix_achat: 450000,
  },
  {
    id: '3',
    nom: 'Cahier 200 pages',
    description: 'Cahier grand format',
    categorie: '3',
    quantite: 200,
    seuil: 50,
    etat: 'neuf',
    date_achat: '2024-03-01',
    prix_achat: 1500,
    prix_vente: 2000
  },
];

const mockDemandes: DemandeActif[] = [
  {
    id: '1',
    demandeur: 'staff1',
    article: '1',
    quantite: 5,
    motif: 'Nouvelle salle de classe',
    date: '2024-03-15',
    statut: 'en attente'
  },
  {
    id: '2',
    demandeur: 'staff2',
    article: '2',
    quantite: 2,
    motif: 'Remplacement ordinateurs défaillants',
    date: '2024-03-10',
    statut: 'approuvée'
  },
];

export const stocksService = {
  // Catégories
  getCategories: (): Promise<ApiResponse<CategorieArticle[]>> => {
    return fetchWithFallback('/stocks/categories/', mockCategories);
  },

  // Articles
  getArticles: (): Promise<ApiResponse<Article[]>> => {
    return fetchWithFallback('/stocks/articles/', mockArticles);
  },

  createArticle: (article: Omit<Article, 'id'>): Promise<ApiResponse<Article>> => {
    const newArticle: Article = { ...article, id: Date.now().toString() };
    return fetchWithFallback('/stocks/articles/', newArticle, { method: 'POST', data: article });
  },

  updateArticle: (id: string, article: Partial<Article>): Promise<ApiResponse<Article>> => {
    const updatedArticle = mockArticles.find(a => a.id === id);
    if (updatedArticle) {
      Object.assign(updatedArticle, article);
    }
    return fetchWithFallback(`/stocks/articles/${id}/`, updatedArticle!, { method: 'PUT', data: article });
  },

  // Demandes
  getDemandes: (): Promise<ApiResponse<DemandeActif[]>> => {
    return fetchWithFallback('/stocks/demandes/', mockDemandes);
  },

  createDemande: (demande: Omit<DemandeActif, 'id'>): Promise<ApiResponse<DemandeActif>> => {
    const newDemande: DemandeActif = { ...demande, id: Date.now().toString() };
    return fetchWithFallback('/stocks/demandes/', newDemande, { method: 'POST', data: demande });
  },

  updateDemandeStatus: (id: string, statut: DemandeActif['statut'], motif_refus?: string): Promise<ApiResponse<DemandeActif>> => {
    const demande = mockDemandes.find(d => d.id === id);
    if (demande) {
      demande.statut = statut;
      if (motif_refus) demande.motif_refus = motif_refus;
    }
    return fetchWithFallback(`/stocks/demandes/${id}/`, demande!, { 
      method: 'PUT', 
      data: { statut, motif_refus } 
    });
  },
};
