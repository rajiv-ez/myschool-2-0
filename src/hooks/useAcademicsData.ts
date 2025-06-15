
import { useState, useEffect } from 'react';
import { Niveau, Filiere, Specialite, Classe } from '@/types/academic';

// Données fictives étendues
const niveauxData: (Niveau & { description?: string })[] = [
  { id: 1, nom: 'Maternelle', description: 'De 3 à 5 ans' },
  { id: 2, nom: 'Primaire', description: 'De 6 à 11 ans' },
  { id: 3, nom: 'Collège', description: 'De 12 à 15 ans' },
  { id: 4, nom: 'Lycée', description: 'De 16 à 18 ans' },
];

const filieresData: Filiere[] = [
  { id: 1, niveau: 2, nom: 'Générale Primaire', description: 'Formation générale du primaire' },
  { id: 2, niveau: 3, nom: 'Générale Collège', description: 'Formation générale du collège' },
  { id: 3, niveau: 4, nom: 'Scientifique', description: 'Formation scientifique' },
  { id: 4, niveau: 4, nom: 'Littéraire', description: 'Formation littéraire' },
  { id: 5, niveau: 4, nom: 'Économique et Social', description: 'Formation économique et sociale' },
];

const specialitesData: Specialite[] = [
  { id: 1, filiere: 1, nom: 'Standard', description: 'Spécialité standard primaire' },
  { id: 2, filiere: 2, nom: 'Standard', description: 'Spécialité standard collège' },
  { id: 3, filiere: 3, nom: 'Mathématiques-Physique', description: 'Spécialité maths-physique' },
  { id: 4, filiere: 3, nom: 'Sciences Naturelles', description: 'Spécialité sciences naturelles' },
  { id: 5, filiere: 4, nom: 'Philosophie', description: 'Spécialité philosophie' },
  { id: 6, filiere: 4, nom: 'Lettres Classiques', description: 'Spécialité lettres classiques' },
  { id: 7, filiere: 5, nom: 'Économie-Gestion', description: 'Spécialité économie-gestion' },
];

const classesData: Classe[] = [
  { id: 1, specialite: 1, nom: 'CP', description: 'Cours Préparatoire' },
  { id: 2, specialite: 1, nom: 'CE1', description: 'Cours Élémentaire 1ère année' },
  { id: 3, specialite: 1, nom: 'CE2', description: 'Cours Élémentaire 2ème année' },
  { id: 4, specialite: 1, nom: 'CM1', description: 'Cours Moyen 1ère année' },
  { id: 5, specialite: 1, nom: 'CM2', description: 'Cours Moyen 2ème année' },
  { id: 6, specialite: 2, nom: '6ème', description: 'Sixième' },
  { id: 7, specialite: 2, nom: '5ème', description: 'Cinquième' },
  { id: 8, specialite: 2, nom: '4ème', description: 'Quatrième' },
  { id: 9, specialite: 2, nom: '3ème', description: 'Troisième' },
  { id: 10, specialite: 3, nom: 'Seconde S', description: 'Seconde Scientifique' },
  { id: 11, specialite: 3, nom: 'Première S', description: 'Première Scientifique' },
  { id: 12, specialite: 3, nom: 'Terminale S', description: 'Terminale Scientifique' },
];

export function useAcademicsData() {
  const [niveaux, setNiveaux] = useState(niveauxData);
  const [filieres, setFilieres] = useState(filieresData);
  const [specialites, setSpecialites] = useState(specialitesData);
  const [classes, setClasses] = useState(classesData);
  const [loading, setLoading] = useState(false);
  const [fromApi, setFromApi] = useState(false);

  // Fonctions CRUD pour niveaux
  const createNiveau = async (data: Omit<typeof niveauxData[0], 'id'>) => {
    const newNiveau = { ...data, id: Date.now() };
    setNiveaux(prev => [...prev, newNiveau]);
    return { data: newNiveau, fromApi: false };
  };

  const updateNiveau = async (id: number, data: Partial<typeof niveauxData[0]>) => {
    setNiveaux(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    return { data: { id, ...data }, fromApi: false };
  };

  const deleteNiveau = async (id: number) => {
    setNiveaux(prev => prev.filter(item => item.id !== id));
  };

  // Fonctions CRUD pour filières
  const createFiliere = async (data: Omit<Filiere, 'id'>) => {
    const newFiliere = { ...data, id: Date.now() };
    setFilieres(prev => [...prev, newFiliere]);
    return { data: newFiliere, fromApi: false };
  };

  const updateFiliere = async (id: number, data: Partial<Filiere>) => {
    setFilieres(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    return { data: { id, ...data }, fromApi: false };
  };

  const deleteFiliere = async (id: number) => {
    setFilieres(prev => prev.filter(item => item.id !== id));
  };

  // Fonctions CRUD pour spécialités
  const createSpecialite = async (data: Omit<Specialite, 'id'>) => {
    const newSpecialite = { ...data, id: Date.now() };
    setSpecialites(prev => [...prev, newSpecialite]);
    return { data: newSpecialite, fromApi: false };
  };

  const updateSpecialite = async (id: number, data: Partial<Specialite>) => {
    setSpecialites(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    return { data: { id, ...data }, fromApi: false };
  };

  const deleteSpecialite = async (id: number) => {
    setSpecialites(prev => prev.filter(item => item.id !== id));
  };

  // Fonctions CRUD pour classes
  const createClasse = async (data: Omit<Classe, 'id'>) => {
    const newClasse = { ...data, id: Date.now() };
    setClasses(prev => [...prev, newClasse]);
    return { data: newClasse, fromApi: false };
  };

  const updateClasse = async (id: number, data: Partial<Classe>) => {
    setClasses(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    return { data: { id, ...data }, fromApi: false };
  };

  const deleteClasse = async (id: number) => {
    setClasses(prev => prev.filter(item => item.id !== id));
  };

  return {
    niveaux,
    filieres,
    specialites,
    classes,
    loading,
    fromApi,
    createNiveau,
    updateNiveau,
    deleteNiveau,
    createFiliere,
    updateFiliere,
    deleteFiliere,
    createSpecialite,
    updateSpecialite,
    deleteSpecialite,
    createClasse,
    updateClasse,
    deleteClasse,
  };
}
