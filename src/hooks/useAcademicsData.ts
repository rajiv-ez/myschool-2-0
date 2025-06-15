import { useState, useEffect } from 'react';
import { academicService } from '@/services/academicService';
import { Niveau, Filiere, Specialite, Classe } from '@/types/academic';

// Données fictives étendues
const niveauxData: (Niveau & { description?: string })[] = [
  { id: 1, nom: 'Maternelle', ordre: 1, description: 'De 3 à 5 ans', is_active: true },
  { id: 2, nom: 'Primaire', ordre: 2, description: 'De 6 à 11 ans', is_active: true },
  { id: 3, nom: 'Collège', ordre: 3, description: 'De 12 à 15 ans', is_active: true },
  { id: 4, nom: 'Lycée', ordre: 4, description: 'De 16 à 18 ans', is_active: true },
];

const filieresData: Filiere[] = [
  { id: 1, niveau: 2, nom: 'Générale Primaire', description: 'Formation générale du primaire', is_active: true },
  { id: 2, niveau: 3, nom: 'Générale Collège', description: 'Formation générale du collège', is_active: true },
  { id: 3, niveau: 4, nom: 'Scientifique', description: 'Formation scientifique', is_active: true },
  { id: 4, niveau: 4, nom: 'Littéraire', description: 'Formation littéraire', is_active: true },
  { id: 5, niveau: 4, nom: 'Économique et Social', description: 'Formation économique et sociale', is_active: true },
];

const specialitesData: Specialite[] = [
  { id: 1, filiere: 1, nom: 'Standard', description: 'Spécialité standard primaire', is_active: true },
  { id: 2, filiere: 2, nom: 'Standard', description: 'Spécialité standard collège', is_active: true },
  { id: 3, filiere: 3, nom: 'Mathématiques-Physique', description: 'Spécialité maths-physique', is_active: true },
  { id: 4, filiere: 3, nom: 'Sciences Naturelles', description: 'Spécialité sciences naturelles', is_active: true },
  { id: 5, filiere: 4, nom: 'Philosophie', description: 'Spécialité philosophie', is_active: true },
  { id: 6, filiere: 4, nom: 'Lettres Classiques', description: 'Spécialité lettres classiques', is_active: true },
  { id: 7, filiere: 5, nom: 'Économie-Gestion', description: 'Spécialité économie-gestion', is_active: true },
];

const classesData: Classe[] = [
  { id: 1, specialite: 1, nom: 'CP', description: 'Cours Préparatoire', is_active: true },
  { id: 2, specialite: 1, nom: 'CE1', description: 'Cours Élémentaire 1ère année', is_active: true },
  { id: 3, specialite: 1, nom: 'CE2', description: 'Cours Élémentaire 2ème année', is_active: true },
  { id: 4, specialite: 1, nom: 'CM1', description: 'Cours Moyen 1ère année', is_active: true },
  { id: 5, specialite: 1, nom: 'CM2', description: 'Cours Moyen 2ème année', is_active: true },
  { id: 6, specialite: 2, nom: '6ème', description: 'Sixième', is_active: true },
  { id: 7, specialite: 2, nom: '5ème', description: 'Cinquième', is_active: true },
  { id: 8, specialite: 2, nom: '4ème', description: 'Quatrième', is_active: true },
  { id: 9, specialite: 2, nom: '3ème', description: 'Troisième', is_active: true },
  { id: 10, specialite: 3, nom: 'Seconde S', description: 'Seconde Scientifique', is_active: true },
  { id: 11, specialite: 3, nom: 'Première S', description: 'Première Scientifique', is_active: true },
  { id: 12, specialite: 3, nom: 'Terminale S', description: 'Terminale Scientifique', is_active: true },
];

export function useAcademicsData() {
  const [niveaux, setNiveaux] = useState(niveauxData);
  const [filieres, setFilieres] = useState(filieresData);
  const [specialites, setSpecialites] = useState(specialitesData);
  const [classes, setClasses] = useState(classesData);
  const [loading, setLoading] = useState(false);
  const [fromApi, setFromApi] = useState(false);

  
    useEffect(() => {
      (async () => {
        setLoading(true);
        const [n, f, s, c] = await Promise.all([
          academicService.getNiveaux(),
          academicService.getFilieres(),
          academicService.getSpecialites(),
          academicService.getClasses(),
        ]);
  
        if (n.fromApi) setNiveaux(n.data);
        if (f.fromApi) setFilieres(f.data);
        if (s.fromApi) setSpecialites(s.data);
        if (c.fromApi) setClasses(c.data);
  
        // Déterminer si au moins une des réponses vient de l'API
        const isFromApi = [n, f, s, c].some(response => response.fromApi);
        setFromApi(isFromApi);
  
        setLoading(false);
      })();
    }, []);

  const createNiveau = async (data: Partial<Niveau>) => { const r = await academicService.createNiveau(data); if (r.fromApi) setNiveaux(prev => [...prev, r.data]); return r; };
  const updateNiveau = async (id: number, data: Partial<Niveau>) => { const r = await academicService.updateNiveau(id, data); if (r.fromApi) setNiveaux(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteNiveau = async (id: number) => { await academicService.deleteNiveau(id); setNiveaux(prev => prev.filter(s => s.id !== id)); };
  
  const createFiliere = async (data: Partial<Filiere>) => { const r = await academicService.createFiliere(data); if (r.fromApi) setFilieres(prev => [...prev, r.data]); return r; };
  const updateFiliere = async (id: number, data: Partial<Filiere>) => { const r = await academicService.updateFiliere(id, data); if (r.fromApi) setFilieres(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteFiliere = async (id: number) => { await academicService.deleteFiliere(id); setFilieres(prev => prev.filter(s => s.id !== id)); };
  
  const createSpecialite = async (data: Partial<Specialite>) => { const r = await academicService.createSpecialite(data); if (r.fromApi) setSpecialites(prev => [...prev, r.data]); return r; };
  const updateSpecialite = async (id: number, data: Partial<Specialite>) => { const r = await academicService.updateSpecialite(id, data); if (r.fromApi) setSpecialites(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteSpecialite = async (id: number) => { await academicService.deleteSpecialite(id); setSpecialites(prev => prev.filter(s => s.id !== id)); };

  const createClasse = async (data: Partial<Classe>) => { const r = await academicService.createClasse(data); if (r.fromApi) setClasses(prev => [...prev, r.data]); return r; };
  const updateClasse = async (id: number, data: Partial<Classe>) => { const r = await academicService.updateClasse(id, data); if (r.fromApi) setClasses(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteClasse = async (id: number) => { await academicService.deleteClasse(id); setClasses(prev => prev.filter(s => s.id !== id)); };
  
  return {
    niveaux, createNiveau, updateNiveau, deleteNiveau,
    filieres, createFiliere, updateFiliere, deleteFiliere,
    specialites, createSpecialite, updateSpecialite, deleteSpecialite,
    classes, createClasse, updateClasse, deleteClasse,
    loading,
    fromApi,
  };
}
