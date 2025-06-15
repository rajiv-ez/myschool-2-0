
import { useState, useEffect } from 'react';
import { academicService } from '@/services/academicService';
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
