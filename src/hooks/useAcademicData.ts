
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

      setLoading(false);
    })();
  }, []);

  const createSession = async (data: Omit<Session, 'id'>) => {
    const r = await academicService.createSession(data);
    if (r.fromApi) setSessions(prev => [...prev, r.data]);
    return r;
  };

  const updateSession = async (id: number, data: Partial<Session>) => {
    setSessions(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSession = async (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setPaliers(prev => prev.filter(p => p.session !== id));
  };

  const createPalier = async (data: Omit<Palier, 'id'>) => {
    const newPalier: Palier = { ...data, id: Date.now() };
    setPaliers(prev => [...prev, newPalier]);
    return { data: newPalier, fromApi: false };
  };

  const updatePalier = async (id: number, data: Partial<Palier>) => {
    setPaliers(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePalier = async (id: number) => {
    setPaliers(prev => prev.filter(p => p.id !== id));
  };

  const createClasseSession = async (data: Omit<ClasseSession, 'id'>) => {
    const newClasseSession: ClasseSession = { ...data, id: Date.now() };
    setClasseSessions(prev => [...prev, newClasseSession]);
    return { data: newClasseSession, fromApi: false };
  };

  const updateClasseSession = async (id: number, data: Partial<ClasseSession>) => {
    setClasseSessions(prev => prev.map(cs => (cs.id === id ? { ...cs, ...data } : cs)));
  };

  const deleteClasseSession = async (id: number) => {
    setClasseSessions(prev => prev.filter(cs => cs.id !== id));
  };

  return {
    sessions,
    paliers,
    niveaux,
    filieres,
    classes,
    classeSessions,
    loading,
    createSession,
    updateSession,
    deleteSession,
    createPalier,
    updatePalier,
    deletePalier,
    createClasseSession,
    updateClasseSession,
    deleteClasseSession,
  };
}
