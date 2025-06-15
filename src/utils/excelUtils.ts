
import * as XLSX from 'xlsx';
import { Succursale, Batiment } from '@/types/infrastructure';

// Read Excel file utility
export const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

// Validation functions
export const validateSuccursalesImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // Excel row number (header is row 1)
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (!row.adresse || typeof row.adresse !== 'string') {
      errors.push(`Ligne ${rowNumber}: L'adresse est requise`);
    }
    if (!row.telephone || typeof row.telephone !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le téléphone est requis`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.nom,
        adresse: row.adresse,
        telephone: row.telephone,
        email: row.email || '',
        description: row.description || '',
        is_active: row.is_active !== false
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateBatimentsImport = (data: any[], succursales: Succursale[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (!row.succursale_nom) {
      errors.push(`Ligne ${rowNumber}: Le nom de la succursale est requis`);
    } else {
      const succursale = succursales.find(s => s.nom === row.succursale_nom);
      if (!succursale) {
        errors.push(`Ligne ${rowNumber}: Succursale "${row.succursale_nom}" non trouvée`);
      }
    }

    if (errors.length === 0) {
      const succursale = succursales.find(s => s.nom === row.succursale_nom);
      validData.push({
        nom: row.nom,
        succursale: succursale!.id,
        description: row.description || '',
        is_active: row.is_active !== false
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateSallesImport = (data: any[], batiments: Batiment[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (!row.batiment_nom) {
      errors.push(`Ligne ${rowNumber}: Le nom du bâtiment est requis`);
    } else {
      const batiment = batiments.find(b => b.nom === row.batiment_nom);
      if (!batiment) {
        errors.push(`Ligne ${rowNumber}: Bâtiment "${row.batiment_nom}" non trouvé`);
      }
    }
    if (row.capacite && (isNaN(row.capacite) || row.capacite <= 0)) {
      errors.push(`Ligne ${rowNumber}: La capacité doit être un nombre positif`);
    }

    if (errors.length === 0) {
      const batiment = batiments.find(b => b.nom === row.batiment_nom);
      validData.push({
        nom: row.nom,
        batiment: batiment!.id,
        capacite: row.capacite || 0,
        description: row.description || '',
        is_active: row.is_active !== false
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateInscriptionsImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    // Validation basique pour les inscriptions
    if (!row.nom_eleve || typeof row.nom_eleve !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom de l'élève est requis`);
    }
    if (!row.prenom_eleve || typeof row.prenom_eleve !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le prénom de l'élève est requis`);
    }
    if (!row.email_eleve || typeof row.email_eleve !== 'string') {
      errors.push(`Ligne ${rowNumber}: L'email de l'élève est requis`);
    }

    if (errors.length === 0) {
      validData.push(row);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateSessionsImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (!row.date_debut) {
      errors.push(`Ligne ${rowNumber}: La date de début est requise`);
    }
    if (!row.date_fin) {
      errors.push(`Ligne ${rowNumber}: La date de fin est requise`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.nom,
        date_debut: row.date_debut,
        date_fin: row.date_fin,
        description: row.description || '',
        is_active: row.is_active !== false
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateNiveauxImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (row.ordre && (isNaN(row.ordre) || row.ordre < 0)) {
      errors.push(`Ligne ${rowNumber}: L'ordre doit être un nombre positif`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.nom,
        ordre: row.ordre || 0,
        description: row.description || '',
        is_active: row.is_active !== false
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateDomainesImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.nom,
        description: row.description || '',
        is_active: row.is_active !== false
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateElevesImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (!row.prenom || typeof row.prenom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le prénom est requis`);
    }
    if (!row.email || typeof row.email !== 'string') {
      errors.push(`Ligne ${rowNumber}: L'email est requis`);
    }
    if (!row.date_naissance) {
      errors.push(`Ligne ${rowNumber}: La date de naissance est requise`);
    }
    if (!row.genre || !['M', 'F', 'A'].includes(row.genre)) {
      errors.push(`Ligne ${rowNumber}: Le genre doit être M, F ou A`);
    }

    if (errors.length === 0) {
      validData.push({
        user: {
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          genre: row.genre,
          date_naissance: row.date_naissance,
          lieu_naissance: row.lieu_naissance || '',
          adresse: row.adresse || '',
          tel1: row.tel1 || '',
          tel2: row.tel2 || '',
          whatsapp: row.whatsapp || '',
          photo: row.photo || '',
          is_active: row.is_active !== false
        },
        matricule: row.matricule || `E${new Date().getFullYear()}${String(Date.now()).slice(-3)}`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateTuteursImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (!row.prenom || typeof row.prenom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le prénom est requis`);
    }
    if (!row.email || typeof row.email !== 'string') {
      errors.push(`Ligne ${rowNumber}: L'email est requis`);
    }
    if (!row.genre || !['M', 'F', 'A'].includes(row.genre)) {
      errors.push(`Ligne ${rowNumber}: Le genre doit être M, F ou A`);
    }

    if (errors.length === 0) {
      validData.push({
        user: {
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          genre: row.genre,
          date_naissance: row.date_naissance || '',
          lieu_naissance: row.lieu_naissance || '',
          adresse: row.adresse || '',
          tel1: row.tel1 || '',
          tel2: row.tel2 || '',
          whatsapp: row.whatsapp || '',
          photo: row.photo || '',
          is_active: row.is_active !== false
        },
        profession: row.profession || ''
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

// Template generation functions
export const generateSuccursalesTemplate = () => {
  const data = [
    {
      nom: 'Succursale Centre',
      adresse: '123 Avenue de la République',
      telephone: '+241 01 23 45 67',
      email: 'centre@ecole.ga',
      description: 'Succursale principale au centre-ville',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Succursales');
  XLSX.writeFile(wb, 'template_succursales.xlsx');
};

export const generateBatimentsTemplate = () => {
  const data = [
    {
      nom: 'Bâtiment A',
      succursale_nom: 'Succursale Centre',
      description: 'Bâtiment principal d\'enseignement',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Batiments');
  XLSX.writeFile(wb, 'template_batiments.xlsx');
};

export const generateSallesTemplate = () => {
  const data = [
    {
      nom: 'Salle 101',
      batiment_nom: 'Bâtiment A',
      capacite: 30,
      description: 'Salle de classe standard',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Salles');
  XLSX.writeFile(wb, 'template_salles.xlsx');
};

export const generateInscriptionsTemplate = () => {
  const data = [
    {
      nom_eleve: 'NDONG',
      prenom_eleve: 'Jean',
      email_eleve: 'jean.ndong@email.com',
      classe_nom: '6ème A',
      session_nom: '2024-2025',
      date_inscription: '2024-09-01',
      statut: 'CONFIRME'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inscriptions');
  XLSX.writeFile(wb, 'template_inscriptions.xlsx');
};

export const generateSessionsTemplate = () => {
  const data = [
    {
      nom: '2024-2025',
      date_debut: '2024-09-01',
      date_fin: '2025-06-30',
      description: 'Année scolaire 2024-2025',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sessions');
  XLSX.writeFile(wb, 'template_sessions.xlsx');
};

export const generateNiveauxTemplate = () => {
  const data = [
    {
      nom: '6ème',
      ordre: 1,
      description: 'Classe de sixième',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Niveaux');
  XLSX.writeFile(wb, 'template_niveaux.xlsx');
};

export const generateDomainessTemplate = () => {
  const data = [
    {
      nom: 'Littéraire',
      description: 'Domaine des sciences littéraires',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Domaines');
  XLSX.writeFile(wb, 'template_domaines.xlsx');
};

export const generateElevesTemplate = () => {
  const data = [
    {
      matricule: 'E2024001',
      nom: 'NDONG',
      prenom: 'Jean',
      email: 'jean.ndong@email.com',
      genre: 'M',
      date_naissance: '2010-05-15',
      lieu_naissance: 'Libreville',
      adresse: '123 Rue de la Paix',
      tel1: '+241 01 23 45 67',
      tel2: '',
      whatsapp: '+241 01 23 45 67',
      photo: '',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Élèves');
  XLSX.writeFile(wb, 'template_eleves.xlsx');
};

export const generateTuteursTemplate = () => {
  const data = [
    {
      nom: 'NDONG',
      prenom: 'Marc',
      email: 'marc.ndong@email.com',
      genre: 'M',
      date_naissance: '1980-03-20',
      lieu_naissance: 'Libreville',
      adresse: '123 Rue de la Paix',
      tel1: '+241 01 23 45 67',
      tel2: '',
      whatsapp: '+241 01 23 45 67',
      profession: 'Enseignant',
      photo: '',
      is_active: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tuteurs');
  XLSX.writeFile(wb, 'template_tuteurs.xlsx');
};
