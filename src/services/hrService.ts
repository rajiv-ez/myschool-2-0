import { fetchWithFallback } from './api';
import { Poste, ClauseContrat, Contrat, Absence, Paie, Pointage, PauseJournaliere } from '../types/hr';

const mockPostes: Poste[] = [
  { id: 1, nom: 'Directeur', code: 'DIR001', description: 'Poste de direction', niveau_hierarchique: 1, est_direction: true, actif: true, date_creation: '2022-01-01' },
];

const mockClauses: ClauseContrat[] = [
  { id: 1, titre: 'Clause de confidentialité', contenu: 'Le salarié s’engage à garder les informations confidentielles.' },
];

const mockContrats: Contrat[] = [
  { id: 1, staff: 1, type_contrat: 'CDI', date_debut: '2022-01-01', date_fin: null, salaire_base: 300000, avantages: 'Logement, transport', clauses: [1] },
];

const mockAbsences: Absence[] = [
  { id: 1, staff: 1, date_debut: '2024-04-01', date_fin: '2024-04-05', motif: 'Maladie', justifiee: true, statut: 'VALIDEE' },
];

const mockPaies: Paie[] = [
  { id: 1, staff: 1, mois: '2024-06-01', salaire_base: 300000, primes: 50000, retenues: 10000, net_a_payer: 340000, date_versement: '2024-06-30', methode_paiement: 'VIREMENT', statut: 'PAYE' },
];

const mockPointages: Pointage[] = [
  { id: 1, staff: 1, date: '2024-06-01', heure_arrivee: '08:00', heure_depart: '17:00', commentaire: 'RAS' },
];

const mockPauses: PauseJournaliere[] = [
  { id: 1, pointage: 1, heure_debut: '12:00', heure_fin: '13:00' },
];

export const hrService = {
  getPostes: () => fetchWithFallback('/api/hr/postes/', mockPostes),
  getClauses: () => fetchWithFallback('/api/hr/clauses/', mockClauses),
  getContrats: () => fetchWithFallback('/api/hr/contrats/', mockContrats),
  getAbsences: () => fetchWithFallback('/api/hr/absences/', mockAbsences),
  getPaies: () => fetchWithFallback('/api/hr/paies/', mockPaies),
  getPointages: () => fetchWithFallback('/api/hr/pointages/', mockPointages),
  getPauses: () => fetchWithFallback('/api/hr/pauses/', mockPauses),
};
