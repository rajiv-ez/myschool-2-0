import { fetchWithFallback, ApiResponse } from './api';
import { Archive, TypeArchive, ModeleDocument, ChampsModele, DocumentGenere  } from '../types/dms';

const mockTypeArchives: TypeArchive[] = [
  { id: 1, nom: 'Inscriptions', nom_modele: 'Inscription', app_label: 'academic', champs_affichage: ['classe_session', 'eleve', 'session'] },
];

const mockArchives: Archive[] = [
  { id: 1, nom: 'Inscription fils du conseiller', type_archive: 1, objet_id: 1, fichier: 'archives/files/file1.pdf', tags: 'inscription', date_creation: '2025-06-01', date_modification: '2025-06-01', cree_par: 1, modifie_par: 1 },
];

const mockModeles: ModeleDocument[] = [
  {
    id: 1,
    nom: 'Attestation de Réussite',
    description: "Modèle d'attestation",
    template: 'documents/templates/attestationreussite.docx',
  },
];

const mockChamps: ChampsModele[] = [
  {
    id: 1,
    modele_document: 1,
    label: 'Nom de famille',
    type: 'char',
    required: true,
  },
  { 
    id: 2, 
    modele_document: 1, 
    label: 'Mention', type: 'char', required: true, options: 'Passble;Bien;Très bien' },
];

const mockDocuments: DocumentGenere[] = [
  {
    id: 1,
    modele: 1,
    donnees: { 'Nom élève': 'Jean Dupont', 'Mention': 'Très bien' },
    fichier_genere: 'documents/generated/attestation_jean.pdf',
    cree_par: 1,
    date_creation: '2025-06-05',
  },
];

export const dmsService = {
  getTypes: (): Promise<ApiResponse<TypeArchive[]>> =>
    fetchWithFallback('/api/dms/types-archives/', mockTypeArchives),

  getArchives: (): Promise<ApiResponse<Archive[]>> =>
    fetchWithFallback('/api/dms/archives/', mockArchives),

  getModelesDocuments: (): Promise<ApiResponse<ModeleDocument[]>> => 
    fetchWithFallback('/api/dms/modeles-documents/', mockModeles),

  getChampsModeles: (): Promise<ApiResponse<ChampsModele[]>> =>
    fetchWithFallback('/api/dms/champs/', mockChamps),

  getDocumentsGeneres: (): Promise<ApiResponse<DocumentGenere[]>> => 
    fetchWithFallback('/api/dms/documents-generes/', mockDocuments),

};