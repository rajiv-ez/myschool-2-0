
import { useEffect, useState } from 'react';
import { teachingService } from '@/services/teachingService';
import {
    Domaine, UniteEnseignement, Matiere, MatiereGroupee,
    Evenement, FichierEvenement, Exercice, FichierExercice,
    Presence, Note, NoteConfig
} from '@/types/teaching';

export function useTeachingData() {
    const [domaines, setDomaines] = useState<Domaine[]>([]);
    const [unites, setUnites] = useState<UniteEnseignement[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [matGroupes, setMatGroupes] = useState<MatiereGroupee[]>([]);
    const [evenements, setEvenements] = useState<Evenement[]>([]);
    const [fichiersEvenements, setFichiersEvenements] = useState<FichierEvenement[]>([]);
    const [exercices, setExercices] = useState<Exercice[]>([]);
    const [fichiersExercices, setFichiersExercices] = useState<FichierExercice[]>([]);
    const [presences, setPresences] = useState<Presence[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteConfigs, setNoteConfigs] = useState<NoteConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromApi, setFromApi] = useState(false);

    useEffect(() => {
        (async () => {
        const [
            d, u, m, g, e, fe, ex, fx, p, n, nc
        ] = await Promise.all([
            teachingService.getDomaines(), teachingService.getUnites(), teachingService.getMatieres(),
            teachingService.getMatGroupes(), teachingService.getEvenements(), teachingService.getFichiersEvenements(),
            teachingService.getExercices(), teachingService.getFichiersExercices(), teachingService.getPresences(),
            teachingService.getNotes(), teachingService.getNoteConfigs(),
        ]);

        if (d.fromApi) setDomaines(d.data); if (u.fromApi) setUnites(u.data); 
        if (m.fromApi) setMatieres(m.data); if (g.fromApi) setMatGroupes(g.data);
        if (e.fromApi) setEvenements(e.data); if (fe.fromApi) setFichiersEvenements(fe.data);
        if (ex.fromApi) setExercices(ex.data); if (fx.fromApi) setFichiersExercices(fx.data);
        if (p.fromApi) setPresences(p.data); if (n.fromApi) setNotes(n.data);
        if (nc.fromApi) setNoteConfigs(nc.data);

        // Déterminer si au moins une des réponses vient de l'API
        const isFromApi = [d, u, m, g, e, fe, ex, fx, p, n, nc].some(response => response.fromApi);
        setFromApi(isFromApi);

        setLoading(false);
        })();
    }, []);

    const createDomaine = async (data: Partial<Domaine>) => { const r = await teachingService.createDomaine(data); if (r.fromApi) setDomaines(prev => [...prev, r.data]); return r; };
    const updateDomaine = async (id: number, data: Partial<Domaine>) => { const r = await teachingService.updateDomaine(id, data); if (r.fromApi) setDomaines(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteDomaine = async (id: number) => { await teachingService.deleteDomaine(id); setDomaines(prev => prev.filter(s => s.id !== id)); };
    
    const createUnite = async (data: Partial<UniteEnseignement>) => { const r = await teachingService.createUnite(data); if (r.fromApi) setUnites(prev => [...prev, r.data]); return r; };
    const updateUnite = async (id: number, data: Partial<UniteEnseignement>) => { const r = await teachingService.updateUnite(id, data); if (r.fromApi) setUnites(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteUnite = async (id: number) => { await teachingService.deleteUnite(id); setUnites(prev => prev.filter(s => s.id !== id)); };

    const createMatiere = async (data: Partial<Matiere>) => { const r = await teachingService.createMatiere(data); if (r.fromApi) setMatieres(prev => [...prev, r.data]); return r; };
    const updateMatiere = async (id: number, data: Partial<Matiere>) => { const r = await teachingService.updateMatiere(id, data); if (r.fromApi) setMatieres(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteMatiere = async (id: number) => { await teachingService.deleteMatiere(id); setMatieres(prev => prev.filter(s => s.id !== id)); };

    const createMatGroupe = async (data: Partial<MatiereGroupee>) => { const r = await teachingService.createMatGroupe(data); if (r.fromApi) setMatGroupes(prev => [...prev, r.data]); return r; };
    const updateMatGroupe = async (id: number, data: Partial<MatiereGroupee>) => { const r = await teachingService.updateMatGroupe(id, data); if (r.fromApi) setMatGroupes(prev => prev.map(s => (s.id === id ? r.data : s))); return r; }; 
    const deleteMatGroupe = async (id: number) => { await teachingService.deleteMatGroupe(id); setMatGroupes(prev => prev.filter(s => s.id !== id)); };

    const createEvenement = async (data: Partial<Evenement>) => { const r = await teachingService.createEvenement(data); if (r.fromApi) setEvenements(prev => [...prev, r.data]); return r; };
    const updateEvenement = async (id: number, data: Partial<Evenement>) => { const r = await teachingService.updateEvenement(id, data); if (r.fromApi) setEvenements(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteEvenement = async (id: number) => { await teachingService.deleteEvenement(id); setEvenements(prev => prev.filter(s => s.id !== id)); };

    const createFichierEvenement = async (data: Partial<FichierEvenement>) => { const r = await teachingService.createFichierEvenement(data); if (r.fromApi) setFichiersEvenements(prev => [...prev, r.data]); return r; };
    const updateFichierEvenement = async (id: number, data: Partial<FichierEvenement>) => { const r = await teachingService.updateFichierEvenement(id, data); if (r.fromApi) setFichiersEvenements(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteFichierEvenement = async (id: number) => { await teachingService.deleteFichierEvenement(id); setFichiersEvenements(prev => prev.filter(s => s.id !== id)); };

    const createExercice = async (data: Partial<Exercice>) => { const r = await teachingService.createExercice(data); if (r.fromApi) setExercices(prev => [...prev, r.data]); return r; };
    const updateExercice = async (id: number, data: Partial<Exercice>) => { const r = await teachingService.updateExercice(id, data); if (r.fromApi) setExercices(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteExercice = async (id: number) => { await teachingService.deleteExercice(id); setExercices(prev => prev.filter(s => s.id !== id)); };

    const createFichierExercice = async (data: Partial<FichierExercice>) => { const r = await teachingService.createFichierExercice(data); if (r.fromApi) setFichiersExercices(prev => [...prev, r.data]); return r; };
    const updateFichierExercice = async (id: number, data: Partial<FichierExercice>) => { const r = await teachingService.updateFichierExercice(id, data); if (r.fromApi) setFichiersExercices(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteFichierExercice = async (id: number) => { await teachingService.deleteFichierExercice(id); setFichiersExercices(prev => prev.filter(s => s.id !== id)); };

    const createPresence = async (data: Partial<Presence>) => { const r = await teachingService.createPresence(data); if (r.fromApi) setPresences(prev => [...prev, r.data]); return r; };
    const updatePresence = async (id: number, data: Partial<Presence>) => { const r = await teachingService.updatePresence(id, data); if (r.fromApi) setPresences(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deletePresence = async (id: number) => { await teachingService.deletePresence(id); setPresences(prev => prev.filter(s => s.id !== id)); };

    const createNote = async (data: Partial<Note>) => { const r = await teachingService.createNote(data); if (r.fromApi) setNotes(prev => [...prev, r.data]); return r; };
    const updateNote = async (id: number, data: Partial<Note>) => { const r = await teachingService.updateNote(id, data); if (r.fromApi) setNotes(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteNote = async (id: number) => { await teachingService.deleteNote(id); setNotes(prev => prev.filter(s => s.id !== id)); };

    const createNoteConfig = async (data: Partial<NoteConfig>) => { const r = await teachingService.createNoteConfig(data); if (r.fromApi) setNoteConfigs(prev => [...prev, r.data]); return r; };
    const updateNoteConfig = async (id: number, data: Partial<NoteConfig>) => { const r = await teachingService.updateNoteConfig(id, data); if (r.fromApi) setNoteConfigs(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
    const deleteNoteConfig = async (id: number) => { await teachingService.deleteNoteConfig(id); setNoteConfigs(prev => prev.filter(s => s.id !== id)); };
    
    return {
        loading,
        fromApi,
        domaines, createDomaine, updateDomaine, deleteDomaine,
        unites, createUnite, updateUnite, deleteUnite,
        matieres, createMatiere, updateMatiere, deleteMatiere,
        matGroupes, createMatGroupe, updateMatGroupe, deleteMatGroupe,
        evenements, createEvenement, updateEvenement, deleteEvenement,
        fichiersEvenements, createFichierEvenement, updateFichierEvenement, deleteFichierEvenement,
        exercices, createExercice, updateExercice, deleteExercice,
        fichiersExercices, createFichierExercice, updateFichierExercice, deleteFichierExercice,
        presences, createPresence, updatePresence, deletePresence,
        notes, createNote, updateNote, deleteNote,
        noteConfigs, createNoteConfig, updateNoteConfig, deleteNoteConfig
    };
}
