
import * as XLSX from 'xlsx';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';
import { Inscription, Session, Palier, ClasseSession, Niveau, Filiere, Specialite, Classe } from '@/types/academic';
import { Domaine, UniteEnseignement, Matiere } from '@/types/teaching';

export interface ExcelExportOptions {
  filename: string;
  sheetName: string;
}

// Export functions for infrastructure
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

// Export functions for inscriptions
export const exportInscriptionsToExcel = (inscriptions: any[], options?: Partial<ExcelExportOptions>) => {
  const data = inscriptions.map(i => ({
    ID: i.id,
    'Nom Élève': i.eleveNom || 'Inconnu',
    'Classe/Session': i.classeSessionNom || 'Inconnue',
    'Date Inscription': i.dateFormatted || i.date_inscription,
    Type: i.typeLabel || (i.est_reinscription ? 'Réinscription' : 'Nouvelle'),
    Statut: i.statutLabel || i.statut
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Inscriptions');
  
  const filename = options?.filename || `inscriptions_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Export functions for sessions
export const exportSessionsToExcel = (sessions: Session[], options?: Partial<ExcelExportOptions>) => {
  const data = sessions.map(s => ({
    ID: s.id,
    Nom: s.nom,
    Début: s.debut,
    Fin: s.fin,
    'En Cours': s.en_cours ? 'Oui' : 'Non',
    'Auto Activer Palier': s.auto_activer_palier ? 'Oui' : 'Non'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Sessions');
  
  const filename = options?.filename || `sessions_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportPaliersToExcel = (paliers: Palier[], sessions: Session[], options?: Partial<ExcelExportOptions>) => {
  const data = paliers.map(p => {
    const session = sessions.find(s => s.id === p.session);
    return {
      ID: p.id,
      Nom: p.nom,
      'ID Session': p.session,
      'Nom Session': session?.nom || 'Inconnue',
      Début: p.debut,
      Fin: p.fin,
      'En Cours': p.en_cours ? 'Oui' : 'Non'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Paliers');
  
  const filename = options?.filename || `paliers_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportClasseSessionsToExcel = (classeSessions: any[], options?: Partial<ExcelExportOptions>) => {
  const data = classeSessions.map(cs => ({
    ID: cs.id,
    Classe: cs.classeData?.nom || 'Inconnue',
    Session: cs.sessionData?.nom || 'Inconnue',
    Capacité: cs.capacite,
    Description: cs.classeData?.description || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Classes');
  
  const filename = options?.filename || `classe_sessions_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Export functions for academic entities
export const exportNiveauxToExcel = (niveaux: Niveau[], options?: Partial<ExcelExportOptions>) => {
  const data = niveaux.map(n => ({
    ID: n.id,
    Nom: n.nom,
    Description: n.description || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Niveaux');
  
  const filename = options?.filename || `niveaux_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportFilieresToExcel = (filieres: Filiere[], niveaux: Niveau[], options?: Partial<ExcelExportOptions>) => {
  const data = filieres.map(f => {
    const niveau = niveaux.find(n => n.id === f.niveau);
    return {
      ID: f.id,
      Nom: f.nom,
      'ID Niveau': f.niveau,
      'Nom Niveau': niveau?.nom || 'Inconnu',
      Description: f.description || ''
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Filières');
  
  const filename = options?.filename || `filieres_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportSpecialitesToExcel = (specialites: Specialite[], filieres: Filiere[], options?: Partial<ExcelExportOptions>) => {
  const data = specialites.map(s => {
    const filiere = filieres.find(f => f.id === s.filiere);
    return {
      ID: s.id,
      Nom: s.nom,
      'ID Filière': s.filiere,
      'Nom Filière': filiere?.nom || 'Inconnue',
      Description: s.description || ''
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Spécialités');
  
  const filename = options?.filename || `specialites_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportClassesToExcel = (classes: Classe[], specialites: Specialite[], options?: Partial<ExcelExportOptions>) => {
  const data = classes.map(c => {
    const specialite = specialites.find(s => s.id === c.specialite);
    return {
      ID: c.id,
      Nom: c.nom,
      'ID Spécialité': c.specialite,
      'Nom Spécialité': specialite?.nom || 'Inconnue',
      Description: c.description || ''
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Classes');
  
  const filename = options?.filename || `classes_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Export functions for teaching entities
export const exportDomainesToExcel = (domaines: Domaine[], options?: Partial<ExcelExportOptions>) => {
  const data = domaines.map(d => ({
    ID: d.id,
    Nom: d.nom,
    Description: d.description || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Domaines');
  
  const filename = options?.filename || `domaines_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportUnitesToExcel = (unites: UniteEnseignement[], domaines: Domaine[], options?: Partial<ExcelExportOptions>) => {
  const data = unites.map(u => ({
    ID: u.id,
    Nom: u.nom,
    Description: u.description || '',
    'Domaines IDs': u.domaines.join(', '),
    'Domaines Noms': u.domaines.map(id => domaines.find(d => d.id === id)?.nom || 'Inconnu').join(', ')
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Unités');
  
  const filename = options?.filename || `unites_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

export const exportMatieresToExcel = (matieres: Matiere[], unites: UniteEnseignement[], options?: Partial<ExcelExportOptions>) => {
  const data = matieres.map(m => {
    const unite = unites.find(u => u.id === m.unite);
    return {
      ID: m.id,
      Nom: m.nom,
      'ID Unité': m.unite,
      'Nom Unité': unite?.nom || 'Inconnue',
      Coefficient: m.coefficient,
      Description: m.description || ''
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || 'Matières');
  
  const filename = options?.filename || `matieres_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
};

// Generic export function
export const exportToExcel = (data: any[], entityType: string, options?: Partial<ExcelExportOptions>) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options?.sheetName || entityType);
  
  const filename = options?.filename || `${entityType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
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

export const generateInscriptionsTemplate = () => {
  const templateData = [
    {
      'ID Élève': 1,
      'ID Classe Session': 1,
      'Date Inscription': '2024-01-01',
      'Est Réinscription': 'Non',
      'Statut': 'CONFIRMEE'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Inscriptions');
  
  XLSX.writeFile(wb, 'template_inscriptions.xlsx');
};

// New template functions for academic entities
export const generateSessionsTemplate = () => {
  const templateData = [
    {
      Nom: 'Année scolaire 2024-2025',
      Début: '2024-09-01',
      Fin: '2025-06-30',
      'En Cours': 'Oui',
      'Auto Activer Palier': 'Oui'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Sessions');
  
  XLSX.writeFile(wb, 'template_sessions.xlsx');
};

export const generateNiveauxTemplate = () => {
  const templateData = [
    {
      Nom: 'Primaire',
      Description: 'Enseignement primaire'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Niveaux');
  
  XLSX.writeFile(wb, 'template_niveaux.xlsx');
};

export const generateDomainessTemplate = () => {
  const templateData = [
    {
      Nom: 'Sciences',
      Description: 'Domaine scientifique'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Domaines');
  
  XLSX.writeFile(wb, 'template_domaines.xlsx');
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

export const validateInscriptionsImport = (data: any[]): ImportValidationResult => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row['ID Élève'] || typeof row['ID Élève'] !== 'number') {
      errors.push(`Ligne ${rowNumber}: L'ID Élève est requis et doit être un nombre`);
    }
    
    if (!row['ID Classe Session'] || typeof row['ID Classe Session'] !== 'number') {
      errors.push(`Ligne ${rowNumber}: L'ID Classe Session est requis et doit être un nombre`);
    }
    
    if (!row['Date Inscription']) {
      errors.push(`Ligne ${rowNumber}: La date d'inscription est requise`);
    }
    
    if (row['Est Réinscription'] && !['Oui', 'Non'].includes(row['Est Réinscription'])) {
      errors.push(`Ligne ${rowNumber}: "Est Réinscription" doit être "Oui" ou "Non"`);
    }
    
    if (row.Statut && !['CONFIRMEE', 'EN_ATTENTE', 'ANNULEE'].includes(row.Statut)) {
      errors.push(`Ligne ${rowNumber}: Le statut doit être "CONFIRMEE", "EN_ATTENTE" ou "ANNULEE"`);
    }

    if (errors.length === 0) {
      validData.push({
        eleve: row['ID Élève'],
        classe_session: row['ID Classe Session'],
        date_inscription: row['Date Inscription'],
        est_reinscription: row['Est Réinscription'] === 'Oui',
        statut: row.Statut || 'CONFIRMEE'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

// New validation functions for academic entities
export const validateSessionsImport = (data: any[]): ImportValidationResult => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.Nom || typeof row.Nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis et doit être du texte`);
    }
    
    if (!row.Début) {
      errors.push(`Ligne ${rowNumber}: La date de début est requise`);
    }
    
    if (!row.Fin) {
      errors.push(`Ligne ${rowNumber}: La date de fin est requise`);
    }
    
    if (row['En Cours'] && !['Oui', 'Non'].includes(row['En Cours'])) {
      errors.push(`Ligne ${rowNumber}: "En Cours" doit être "Oui" ou "Non"`);
    }
    
    if (row['Auto Activer Palier'] && !['Oui', 'Non'].includes(row['Auto Activer Palier'])) {
      errors.push(`Ligne ${rowNumber}: "Auto Activer Palier" doit être "Oui" ou "Non"`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.Nom,
        debut: row.Début,
        fin: row.Fin,
        en_cours: row['En Cours'] === 'Oui',
        auto_activer_palier: row['Auto Activer Palier'] === 'Oui'
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateNiveauxImport = (data: any[]): ImportValidationResult => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.Nom || typeof row.Nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis et doit être du texte`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.Nom,
        description: row.Description || ''
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateDomainesImport = (data: any[]): ImportValidationResult => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.Nom || typeof row.Nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis et doit être du texte`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.Nom,
        description: row.Description || ''
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
