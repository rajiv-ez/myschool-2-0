
import { useEffect, useState } from 'react';
import { academicService } from '@/services/academicService';
import { Session, Palier, Niveau, Filiere, Classe, ClasseSession } from '@/types/academic';

export function useAcademicData() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [paliers, setPaliers] = useState<Palier[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [classeSessions, setClasseSessions] = useState<ClasseSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [s, p, n, f, c, cs] = await Promise.all([
        academicService.getSessions(),
        academicService.getPaliers(),
        academicService.getNiveaux(),
        academicService.getFilieres(),
        academicService.getClasses(),
        academicService.getClasseSessions(),
      ]);

      if (s.fromApi) setSessions(s.data);
      if (p.fromApi) setPaliers(p.data);
      if (n.fromApi) setNiveaux(n.data);
      if (f.fromApi) setFilieres(f.data);
      if (c.fromApi) setClasses(c.data);
      if (cs.fromApi) setClasseSessions(cs.data);

      // Déterminer si au moins une des réponses vient de l'API
      const isFromApi = [s, p, n, f, c, cs].some(response => response.fromApi);
      setFromApi(isFromApi);

      setLoading(false);
    })();
  }, []);

  const createSession = async (data: Partial<Session>) => { const r = await academicService.createSession(data); if (r.fromApi) setSessions(prev => [...prev, r.data]); return r; };
  const updateSession = async (id: number, data: Partial<Session>) => { const r = await academicService.updateSession(id, data); if (r.fromApi) setSessions(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteSession = async (id: number) => { await academicService.deleteSession(id); setSessions(prev => prev.filter(s => s.id !== id)); };

  const createPalier = async (data: Partial<Palier>) => { const r = await academicService.createPalier(data); if (r.fromApi) setPaliers(prev => [...prev, r.data]); return r; };
  const updatePalier = async (id: number, data: Partial<Palier>) => { const r = await academicService.updatePalier(id, data); if (r.fromApi) setPaliers(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deletePalier = async (id: number) => { await academicService.deletePalier(id); setPaliers(prev => prev.filter(s => s.id !== id)); };

  const createNiveau = async (data: Partial<Niveau>) => { const r = await academicService.createNiveau(data); if (r.fromApi) setNiveaux(prev => [...prev, r.data]); return r; };
  const updateNiveau = async (id: number, data: Partial<Niveau>) => { const r = await academicService.updateNiveau(id, data); if (r.fromApi) setNiveaux(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteNiveau = async (id: number) => { await academicService.deleteNiveau(id); setNiveaux(prev => prev.filter(s => s.id !== id)); };
  
  const createFiliere = async (data: Partial<Filiere>) => { const r = await academicService.createFiliere(data); if (r.fromApi) setFilieres(prev => [...prev, r.data]); return r; };
  const updateFiliere = async (id: number, data: Partial<Filiere>) => { const r = await academicService.updateFiliere(id, data); if (r.fromApi) setFilieres(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteFiliere = async (id: number) => { await academicService.deleteFiliere(id); setFilieres(prev => prev.filter(s => s.id !== id)); };
  
  const createClasse = async (data: Partial<Classe>) => { const r = await academicService.createClasse(data); if (r.fromApi) setClasses(prev => [...prev, r.data]); return r; };
  const updateClasse = async (id: number, data: Partial<Classe>) => { const r = await academicService.updateClasse(id, data); if (r.fromApi) setClasses(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteClasse = async (id: number) => { await academicService.deleteClasse(id); setClasses(prev => prev.filter(s => s.id !== id)); };

  const createClasseSession = async (data: Partial<ClasseSession>) => { const r = await academicService.createClasseSession(data); if (r.fromApi) setClasseSessions(prev => [...prev, r.data]); return r; };
  const updateClasseSession = async (id: number, data: Partial<ClasseSession>) => { const r = await academicService.updateClasseSession(id, data); if (r.fromApi) setClasseSessions(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteClasseSession = async (id: number) => { await academicService.deleteClasseSession(id); setClasseSessions(prev => prev.filter(s => s.id !== id)); };

  return {
    sessions, createSession, updateSession, deleteSession,
    paliers, createPalier, updatePalier, deletePalier,
    niveaux, createNiveau, updateNiveau, deleteNiveau,
    filieres, createFiliere, updateFiliere, deleteFiliere,
    classes, createClasse, updateClasse, deleteClasse,
    classeSessions, createClasseSession, updateClasseSession, deleteClasseSession,
    loading,
    fromApi,
  };
}
