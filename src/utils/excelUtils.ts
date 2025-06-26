import * as XLSX from 'xlsx';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';
import { Niveau, Filiere, Specialite, Classe, Session, Palier, ClasseSession, Inscription } from '@/types/academic';
import { Domaine, UniteEnseignement, Matiere } from '@/types/teaching';
import { FraisScolaire, Paiement, Depense } from '@/types/financial';

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

// Export functions for Infrastructure
export const exportSuccursalesToExcel = (items: Succursale[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Nom': item.nom,
    'Adresse': item.adresse,
    'Ville': item.ville,
    'Pays': item.pays,
    'Téléphone': item.telephone,
    'Email': item.email,
    'Siège': item.est_siege ? 'Oui' : 'Non',
    'Description': item.description
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Succursales');
  XLSX.writeFile(wb, 'succursales.xlsx');
};

export const exportBatimentsToExcel = (items: Batiment[], succursales: Succursale[]) => {
  const data = items.map(item => {
    const succursale = succursales.find(s => s.id === item.succursale);
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Succursale': succursale?.nom || 'Inconnue',
      'Description': item.description
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bâtiments');
  XLSX.writeFile(wb, 'batiments.xlsx');
};

export const exportSallesToExcel = (items: Salle[], batiments: Batiment[]) => {
  const data = items.map(item => {
    const batiment = batiments.find(b => b.id === item.batiment);
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Bâtiment': batiment?.nom || 'Inconnu',
      'Capacité': item.capacite,
      'Description': item.description
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Salles');
  XLSX.writeFile(wb, 'salles.xlsx');
};

// Export functions for Academic structure
export const exportNiveauxToExcel = (items: Niveau[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Nom': item.nom,
    'Ordre': item.ordre,
    'Description': item.description,
    'Actif': item.is_active ? 'Oui' : 'Non'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Niveaux');
  XLSX.writeFile(wb, 'niveaux.xlsx');
};

export const exportFilieresToExcel = (items: Filiere[], niveaux: Niveau[]) => {
  const data = items.map(item => {
    const niveau = niveaux.find(n => n.id === item.niveau);
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Niveau': niveau?.nom || 'Inconnu',
      'Description': item.description,
      'Actif': item.is_active ? 'Oui' : 'Non'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Filières');
  XLSX.writeFile(wb, 'filieres.xlsx');
};

export const exportSpecialitesToExcel = (items: Specialite[], filieres: Filiere[]) => {
  const data = items.map(item => {
    const filiere = filieres.find(f => f.id === item.filiere);
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Filière': filiere?.nom || 'Inconnue',
      'Description': item.description,
      'Actif': item.is_active ? 'Oui' : 'Non'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Spécialités');
  XLSX.writeFile(wb, 'specialites.xlsx');
};

export const exportClassesToExcel = (items: Classe[], specialites: Specialite[]) => {
  const data = items.map(item => {
    const specialite = specialites.find(s => s.id === item.specialite);
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Spécialité': specialite?.nom || 'Inconnue',
      'Description': item.description,
      'Actif': item.is_active ? 'Oui' : 'Non'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Classes');
  XLSX.writeFile(wb, 'classes.xlsx');
};

// Export functions for Teaching
export const exportDomainesToExcel = (items: Domaine[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Nom': item.nom,
    'Description': item.description
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Domaines');
  XLSX.writeFile(wb, 'domaines.xlsx');
};

export const exportUnitesToExcel = (items: UniteEnseignement[], domaines: Domaine[]) => {
  const data = items.map(item => {
    const domaineNames = item.domaines.map(id => 
      domaines.find(d => d.id === id)?.nom || 'Inconnu'
    ).join(', ');
    
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Domaines': domaineNames,
      'Description': item.description
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Unités');
  XLSX.writeFile(wb, 'unites.xlsx');
};

export const exportMatieresToExcel = (items: Matiere[], unites: UniteEnseignement[]) => {
  const data = items.map(item => {
    const unite = unites.find(u => u.id === item.unite);
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Unité': unite?.nom || 'Inconnue',
      'Coefficient': item.coefficient,
      'Description': item.description
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Matières');
  XLSX.writeFile(wb, 'matieres.xlsx');
};

// Export functions for Sessions
export const exportSessionsToExcel = (items: Session[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Nom': item.nom,
    'Date début': new Date(item.debut).toLocaleDateString(),
    'Date fin': new Date(item.fin).toLocaleDateString(),
    'En cours': item.en_cours ? 'Oui' : 'Non',
    'Auto-activation': item.auto_activer_palier ? 'Oui' : 'Non',
    'Description': item.description,
    'Actif': item.is_active ? 'Oui' : 'Non'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sessions');
  XLSX.writeFile(wb, 'sessions.xlsx');
};

export const exportPaliersToExcel = (items: Palier[], sessions: Session[]) => {
  const data = items.map(item => {
    const session = sessions.find(s => s.id === item.session);
    return {
      'ID': item.id,
      'Nom': item.nom,
      'Session': session?.nom || 'Inconnue',
      'Date début': new Date(item.debut).toLocaleDateString(),
      'Date fin': new Date(item.fin).toLocaleDateString(),
      'En cours': item.en_cours ? 'Oui' : 'Non',
      'Description': item.description,
      'Actif': item.is_active ? 'Oui' : 'Non'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Paliers');
  XLSX.writeFile(wb, 'paliers.xlsx');
};

export const exportClasseSessionsToExcel = (items: ClasseSession[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Classe': item.classe,
    'Session': item.session,
    'Capacité': item.capacite,
    'Actif': item.is_active ? 'Oui' : 'Non'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Classes Sessions');
  XLSX.writeFile(wb, 'classe_sessions.xlsx');
};

// Export function for Inscriptions
export const exportInscriptionsToExcel = (items: any[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Élève': item.eleveNom,
    'Classe/Session': item.classeSessionNom,
    'Date inscription': item.dateFormatted,
    'Type': item.typeLabel,
    'Statut': item.statutLabel,
    'Réinscription': item.est_reinscription ? 'Oui' : 'Non'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inscriptions');
  XLSX.writeFile(wb, 'inscriptions.xlsx');
};

// Export functions for Financial data
export const exportFraisToExcel = (items: FraisScolaire[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Nom': item.nom,
    'Description': item.description,
    'Session': item.session,
    'Palier': item.palier,
    'Montant': item.montant,
    'Quantité': item.quantite,
    'Obligatoire': item.est_obligatoire ? 'Oui' : 'Non',
    'Actif': item.est_actif ? 'Oui' : 'Non',
    'Immatériel': item.est_immateriel ? 'Oui' : 'Non',
    'Toutes classes': item.concerne_toutes_classes ? 'Oui' : 'Non',
    'Date création': item.date_creation
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Frais Scolaires');
  XLSX.writeFile(wb, 'frais_scolaires.xlsx');
};

export const exportPaiementsToExcel = (items: Paiement[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Inscription': item.inscription,
    'Frais': item.frais,
    'Montant': item.montant,
    'Date': item.date,
    'Référence': item.reference,
    'Payeur': item.tiers_payeur,
    'Statut': item.statut
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Paiements');
  XLSX.writeFile(wb, 'paiements.xlsx');
};

export const exportDepensesToExcel = (items: Depense[]) => {
  const data = items.map(item => ({
    'ID': item.id,
    'Montant': item.montant,
    'Date': item.date,
    'Bénéficiaire': item.beneficiaire,
    'Référence': item.reference,
    'Description': item.description,
    'Catégorie': item.categorie
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dépenses');
  XLSX.writeFile(wb, 'depenses.xlsx');
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
        description: row.description || ''
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
        description: row.description || ''
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
        description: row.description || ''
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
        description: row.description || ''
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

// Validation functions for financial data
export const validateFraisImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.nom || typeof row.nom !== 'string') {
      errors.push(`Ligne ${rowNumber}: Le nom est requis`);
    }
    if (!row.session || isNaN(row.session) || row.session < 1) {
      errors.push(`Ligne ${rowNumber}: La session doit être un nombre positif`);
    }
    if (!row.montant || isNaN(parseFloat(row.montant))) {
      errors.push(`Ligne ${rowNumber}: Le montant doit être un nombre`);
    }
    if (!row.quantite || isNaN(row.quantite) || row.quantite < 1) {
      errors.push(`Ligne ${rowNumber}: La quantité doit être un nombre positif`);
    }

    if (errors.length === 0) {
      validData.push({
        nom: row.nom,
        description: row.description || '',
        session: parseInt(row.session),
        palier: row.palier ? parseInt(row.palier) : null,
        montant: row.montant.toString(),
        quantite: parseInt(row.quantite),
        est_obligatoire: row.est_obligatoire !== false,
        est_actif: row.est_actif !== false,
        est_immateriel: row.est_immateriel === true,
        concerne_toutes_classes: row.concerne_toutes_classes !== false,
        date_creation: new Date().toISOString(),
        echeance: row.echeance || null,
        classes: []
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validatePaiementsImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.inscription || isNaN(row.inscription)) {
      errors.push(`Ligne ${rowNumber}: L'inscription doit être un nombre`);
    }
    if (!row.frais || isNaN(row.frais)) {
      errors.push(`Ligne ${rowNumber}: Le frais doit être un nombre`);
    }
    if (!row.montant || isNaN(parseFloat(row.montant))) {
      errors.push(`Ligne ${rowNumber}: Le montant doit être un nombre`);
    }
    if (!row.date) {
      errors.push(`Ligne ${rowNumber}: La date est requise`);
    }
    if (!row.statut || !['EN_ATTENTE', 'PAYE_PARTIELLEMENT', 'PAYE', 'ANNULE', 'REMBOURSE'].includes(row.statut)) {
      errors.push(`Ligne ${rowNumber}: Le statut doit être valide`);
    }

    if (errors.length === 0) {
      validData.push({
        inscription: parseInt(row.inscription),
        frais: parseInt(row.frais),
        montant: row.montant.toString(),
        date: row.date,
        reference: row.reference || null,
        user_payeur: row.user_payeur ? parseInt(row.user_payeur) : null,
        tiers_payeur: row.tiers_payeur || null,
        statut: row.statut
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData
  };
};

export const validateDepensesImport = (data: any[]) => {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    
    if (!row.montant || isNaN(parseFloat(row.montant))) {
      errors.push(`Ligne ${rowNumber}: Le montant doit être un nombre`);
    }
    if (!row.date) {
      errors.push(`Ligne ${rowNumber}: La date est requise`);
    }
    if (!row.description || typeof row.description !== 'string') {
      errors.push(`Ligne ${rowNumber}: La description est requise`);
    }
    if (!row.categorie || !['MATERIEL', 'MAINTENANCE', 'SALAIRES', 'CHARGES', 'TRANSPORT', 'ALIMENTATION', 'AUTRES'].includes(row.categorie)) {
      errors.push(`Ligne ${rowNumber}: La catégorie doit être valide`);
    }

    if (errors.length === 0) {
      validData.push({
        montant: row.montant.toString(),
        date: row.date,
        beneficiaire: row.beneficiaire || null,
        reference: row.reference || null,
        description: row.description,
        categorie: row.categorie
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
      description: 'Succursale principale au centre-ville'
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
      description: 'Bâtiment principal d\'enseignement'
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
      description: 'Salle de classe standard'
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
      description: 'Domaine des sciences littéraires'
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

export const generateFraisTemplate = () => {
  const data = [
    {
      nom: 'Frais d\'inscription',
      description: 'Frais d\'inscription pour l\'année scolaire',
      session: 1,
      palier: null,
      montant: '50000',
      quantite: 1,
      est_obligatoire: true,
      est_actif: true,
      est_immateriel: false,
      concerne_toutes_classes: true
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Frais');
  XLSX.writeFile(wb, 'template_frais.xlsx');
};

export const generatePaiementsTemplate = () => {
  const data = [
    {
      inscription: 1,
      frais: 1,
      montant: '25000',
      date: '2024-12-01',
      reference: 'PAY001',
      user_payeur: null,
      tiers_payeur: 'Famille Martin',
      statut: 'EN_ATTENTE'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Paiements');
  XLSX.writeFile(wb, 'template_paiements.xlsx');
};

export const generateDepensesTemplate = () => {
  const data = [
    {
      montant: '20000',
      date: '2024-11-20',
      beneficiaire: 'Librairie Papeterie Moderne',
      reference: 'DEP001',
      description: 'Achat cahiers et fournitures scolaires',
      categorie: 'MATERIEL'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dépenses');
  XLSX.writeFile(wb, 'template_depenses.xlsx');
};
