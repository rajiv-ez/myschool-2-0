import { fetchWithFallback, ApiResponse } from './api';
import { Archive, TypeArchive, ModeleDocument, ChampsModele } from '../types/dms';

const mockTypeArchives: TypeArchive[] = [
  { id: 1, nom: 'Inscriptions', nom_modele: 'Inscription', app_label: 'academic', champs_affichage: ['classe_session', 'eleve', 'session'] },
];

const mockArchives: Archive[] = [
  { id: 1, nom: 'Inscription fils du conseiller', type_archive: 1, objet_id: 1, fichier: 'archives/files/file1.pdf', tags: 'inscription', date_creation: '2025-06-01', date_modification: '2025-06-01', cree_par: 1, modifie_par: 1 },
];

const mockModeles: ModeleDocument[] = [
  {
    id: 1,
    nom: 'Attestation de Scolarité',
    description: "Modèle d'attestation",
    template: 'documents/templates/attestationscolarite.docx',
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
};