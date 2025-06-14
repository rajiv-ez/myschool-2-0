
import * as XLSX from 'xlsx';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';

export interface ExcelExportOptions {
  filename: string;
  sheetName: string;
}

// Export functions
export const exportSuccursalesToExcel = (succursales: Succursale[], options?: Partial<ExcelExportOptions>) => {
  const data = succursales.map(s => ({
    ID: s.id,
    Nom: s.nom,
    Adresse: s.adresse,
    Ville: s.ville,
    Pays: s.pays,
    'Est Siège': s.est_siege ? 'Oui' : 'Non'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Succursales');
  
  const filename = options?.filename || `succursales_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportBatimentsToExcel = (batiments: Batiment[], succursales: Succursale[], options?: Partial<ExcelExportOptions>) => {
  const data = batiments.map(b => {
    const succursale = succursales.find(s => s.id === b.succursale);
    return {
      ID: b.id,
      Nom: b.nom,
      'ID Succursale': b.succursale,
      'Nom Succursale': succursale?.nom || 'Inconnue'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Bâtiments');
  
  const filename = options?.filename || `batiments_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportSallesToExcel = (salles: Salle[], batiments: Batiment[], options?: Partial<ExcelExportOptions>) => {
  const data = salles.map(s => {
    const batiment = batiments.find(b => b.id === s.batiment);
    return {
      ID: s.id,
      Nom: s.nom,
      Capacité: s.capacite,
      'ID Bâtiment': s.batiment,
      'Nom Bâtiment': batiment?.nom || 'Inconnu'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Salles');
  
  const filename = options?.filename || `salles_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Template generation functions
export const generateSuccursalesTemplate = () => {
  const templateData = [
    {
      Nom: 'Exemple Succursale',
      Adresse: '123 Rue Example',
      Ville: 'Ville Exemple',
      Pays: 'Pays Exemple',
      'Est Siège': 'Non'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Succursales');
  
  XLSX.writeFile(wb, 'template_succursales.xlsx');
};

export const generateBatimentsTemplate = () => {
  const templateData = [
    {
      Nom: 'Exemple Bâtiment',
      'ID Succursale': 1
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Bâtiments');
  
  XLSX.writeFile(wb, 'template_batiments.xlsx');
};

export const generateSallesTemplate = () => {
  const templateData = [
    {
      Nom: 'Exemple Salle',
      Capacité: 30,
      'ID Bâtiment': 1
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Salles');
  
  XLSX.writeFile(wb, 'template_salles.xlsx');
};

// Import validation functions
export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any[];
}

export const validateSuccursalesImport = (data: any[]): ImportValidationResult => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because Excel starts at 1 and we have header
    
    if (!row.Nom || typeof row.Nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis et doit être du texte`);
    }
    
    if (!row.Adresse || typeof row.Adresse !== 'string') {
      errors.push(`Ligne ${rowNumber}: L'adresse est requise et doit être du texte`);
    }
    
    if (!row.Ville || typeof row.Ville !== 'string') {
      errors.push(`Ligne ${rowNumber}: La ville est requise et doit être du texte`);
    }
    
    if (!row.Pays || typeof row.Pays !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le pays est requis et doit être du texte`);
    }
    
    if (row['Est Siège'] && !['Oui', 'Non'].includes(row['Est Siège'])) {
      errors.push(`Ligne ${rowNumber}: "Est Siège" doit être "Oui" ou "Non"`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.Nom,
        adresse: row.Adresse,
        ville: row.Ville,
        pays: row.Pays,
        est_siege: row['Est Siège'] === 'Oui'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateBatimentsImport = (data: any[], succursales: Succursale[]): ImportValidationResult => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.Nom || typeof row.Nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis et doit être du texte`);
    }
    
    if (!row['ID Succursale'] || typeof row['ID Succursale'] !== 'number') {
      errors.push(`Ligne ${rowNumber}: L'ID Succursale est requis et doit être un nombre`);
    } else {
      const succursaleExists = succursales.some(s => s.id === row['ID Succursale']);
      if (!succursaleExists) {
        errors.push(`Ligne ${rowNumber}: La succursale avec l'ID ${row['ID Succursale']} n'existe pas`);
      }
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.Nom,
        succursale: row['ID Succursale']
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateSallesImport = (data: any[], batiments: Batiment[]): ImportValidationResult => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.Nom || typeof row.Nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis et doit être du texte`);
    }
    
    if (!row.Capacité || typeof row.Capacité !== 'number' || row.Capacité <= 0) {
      errors.push(`Ligne ${rowNumber}: La capacité est requise et doit être un nombre positif`);
    }
    
    if (!row['ID Bâtiment'] || typeof row['ID Bâtiment'] !== 'number') {
      errors.push(`Ligne ${rowNumber}: L'ID Bâtiment est requis et doit être un nombre`);
    } else {
      const batimentExists = batiments.some(b => b.id === row['ID Bâtiment']);
      if (!batimentExists) {
        errors.push(`Ligne ${rowNumber}: Le bâtiment avec l'ID ${row['ID Bâtiment']} n'existe pas`);
      }
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.Nom,
        capacite: row.Capacité,
        batiment: row['ID Bâtiment']
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

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
    
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsArrayBuffer(file);
  });
};
