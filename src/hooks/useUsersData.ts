
import { useEffect, useState } from 'react';
import { usersService } from '@/services/usersService';
import { User, Eleve, Tuteur, Staff, RelationEleveTuteur } from '@/types/users';

export function useUsersData() {
  const [users, setUsers] = useState<User[]>([]);

  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [elevesDetails, setElevesDetails] = useState<Eleve[]>([]);

  const [tuteurs, setTuteurs] = useState<Tuteur[]>([]);
  const [tuteursDetails, setTuteursDetails] = useState<Tuteur[]>([]);
  
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [staffsDetails, setStaffsDetails] = useState<Staff[]>([]);

  const [relations, setRelations] = useState<RelationEleveTuteur[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [u, e, ed, t, td, s, sd, r] = await Promise.all([
        usersService.getUsers(),
        usersService.getEleves(),
        usersService.getElevesDetails(),
        usersService.getTuteurs(),
        usersService.getTuteursDetails(),
        usersService.getStaffs(),
        usersService.getStaffsDetails(),
        usersService.getRelations(),
      ]);
      
      if (u.fromApi) setUsers(u.data);

      if (e.fromApi) setEleves(e.data);
      if (ed.fromApi) setElevesDetails(ed.data);
      
      if (t.fromApi) setTuteurs(t.data);
      if (td.fromApi) setTuteursDetails(td.data);
      
      if (s.fromApi) setStaffs(s.data);
      if (sd.fromApi) setStaffsDetails(sd.data);

      if (r.fromApi) setRelations(r.data);
      
      // Filter tuteurs from users (assuming tuteurs are users with certain criteria)
      // const tuteursData = u.data.filter(user => user.is_staff === false).map(user => ({
      //   id: user.id,
      //   user: user.id,
      //   profession: 'Non spécifiée'
      // }));
      // setTuteurs(tuteursData);
      
      setLoading(false);
    })();
  }, []);

  const createUser = async (data: Partial<User>) => { const r = await usersService.createUser(data); if (r.fromApi) setUsers(prev => [...prev, r.data]); return r; };
  const updateUser = async (id: number, data: Partial<User>) => { const r = await usersService.updateUser(id, data); if (r.fromApi) setUsers(prev => prev.map(u => (u.id === id ? r.data : u))); return r; };
  const deleteUser = async (id: number) => { await usersService.deleteUser(id); setUsers(prev => prev.filter(s => s.id !== id)); };

  const createTuteur = async (data: Partial<Tuteur>) => { const r = await usersService.createTuteur(data); if (r.fromApi) setTuteurs(prev => [...prev, r.data]); return r; };
  const updateTuteur = async (id: number, data: Partial<Tuteur>) => { const r = await usersService.updateTuteur(id, data); if (r.fromApi) setTuteurs(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteTuteur = async (id: number) => { await usersService.deleteTuteur(id); setTuteurs(prev => prev.filter(s => s.id !== id)); };
  
  const createEleve = async (data: Partial<Eleve>) => { const r = await usersService.createEleve(data); if (r.fromApi) setEleves(prev => [...prev, r.data]); return r; };
  const updateEleve = async (id: number, data: Partial<Eleve>) => { const r = await usersService.updateEleve(id, data); if (r.fromApi) setEleves(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteEleve = async (id: number) => { await usersService.deleteEleve(id); setEleves(prev => prev.filter(s => s.id !== id)); };

  const createStaff = async (data: Partial<Staff>) => { const r = await usersService.createStaff(data); if (r.fromApi) setStaffs(prev => [...prev, r.data]); return r; };
  const updateStaff = async (id: number, data: Partial<Staff>) => { const r = await usersService.updateStaff(id, data); if (r.fromApi) setStaffs(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteStaff = async (id: number) => { await usersService.deleteStaff(id); setStaffs(prev => prev.filter(s => s.id !== id)); };
  

  const createTuteurDetail = async (data: Partial<Tuteur>) => { const r = await usersService.createTuteurDetail(data); if (r.fromApi) setTuteursDetails(prev => [...prev, r.data]); return r; };
  const updateTuteurDetail = async (id: number, data: Partial<Tuteur>) => { const r = await usersService.updateTuteurDetail(id, data); if (r.fromApi) setTuteursDetails(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteTuteurDetail = async (id: number) => { await usersService.deleteTuteurDetail(id); setTuteursDetails(prev => prev.filter(s => s.id !== id)); };
  
  const createEleveDetail = async (data: Partial<Eleve>) => { const r = await usersService.createEleveDetail(data); if (r.fromApi) setElevesDetails(prev => [...prev, r.data]); return r; };
  const updateEleveDetail = async (id: number, data: Partial<Eleve>) => { const r = await usersService.updateEleveDetail(id, data); if (r.fromApi) setElevesDetails(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteEleveDetail = async (id: number) => { await usersService.deleteEleveDetail(id); setElevesDetails(prev => prev.filter(s => s.id !== id)); };

  const createStaffDetail = async (data: Partial<Staff>) => { const r = await usersService.createStaffDetail(data); if (r.fromApi) setStaffsDetails(prev => [...prev, r.data]); return r; };
  const updateStaffDetail = async (id: number, data: Partial<Staff>) => { const r = await usersService.updateStaffDetail(id, data); if (r.fromApi) setStaffsDetails(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteStaffDetail = async (id: number) => { await usersService.deleteStaffDetail(id); setStaffsDetails(prev => prev.filter(s => s.id !== id)); };

  
  const createRelation = async (data: Partial<RelationEleveTuteur>) => { const r = await usersService.createRelation(data); if (r.fromApi) setRelations(prev => [...prev, r.data]); return r; };
  const updateRelation = async (id: number, data: Partial<RelationEleveTuteur>) => { const r = await usersService.updateRelation(id, data); if (r.fromApi) setRelations(prev => prev.map(s => (s.id === id ? r.data : s))); return r; };
  const deleteRelation = async (id: number) => { await usersService.deleteRelation(id); setStaffsDetails(prev => prev.filter(s => s.id !== id)); };


  return {
    users, createUser, updateUser, deleteUser,

    eleves, createEleve, updateEleve, deleteEleve,
    elevesDetails, createEleveDetail, updateEleveDetail, deleteEleveDetail,

    tuteurs, createTuteur, updateTuteur, deleteTuteur,
    tuteursDetails, createTuteurDetail, updateTuteurDetail, deleteTuteurDetail,

    staffs, createStaff, updateStaff, deleteStaff,
    staffsDetails, createStaffDetail, updateStaffDetail, deleteStaffDetail,
    
    relations, createRelation, updateRelation, deleteRelation,
    loading,
    
  };
}
