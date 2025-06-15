
import { useEffect, useState } from 'react';
import { usersService } from '@/services/usersService';
import { 
  User, Eleve, Tuteur, Staff, RelationEleveTuteur, 
  UserLite, EleveDetail, TuteurDetail, StaffDetail
} from '@/types/users';

export function useUsersData() {
  const [users, setUsers] = useState<User[]>([]);

  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [elevesDetails, setElevesDetails] = useState<EleveDetail[]>([]);

  const [tuteurs, setTuteurs] = useState<Tuteur[]>([]);
  const [tuteursDetails, setTuteursDetails] = useState<TuteurDetail[]>([]);
  
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [staffsDetails, setStaffsDetails] = useState<StaffDetail[]>([]);

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
      
      // Always set data, regardless of fromApi flag
      setUsers(u.data || []);
      setEleves(e.data || []);
      setElevesDetails(ed.data || []);
      setTuteurs(t.data || []);
      setTuteursDetails(td.data || []);
      setStaffs(s.data || []);
      setStaffsDetails(sd.data || []);
      setRelations(r.data || []);
      
      setLoading(false);
    })();
  }, []);

  // User operations (basic)
  const createUser = async (data: Partial<User>) => { 
    const r = await usersService.createUser(data); 
    if (r.data) setUsers(prev => [...prev, r.data]); 
    return r; 
  };
  
  const updateUser = async (id: number, data: Partial<User>) => { 
    const r = await usersService.updateUser(id, data); 
    if (r.data) setUsers(prev => prev.map(u => (u.id === id ? r.data : u))); 
    return r; 
  };
  
  const deleteUser = async (id: number) => { 
    await usersService.deleteUser(id); 
    setUsers(prev => prev.filter(u => u.id !== id)); 
  };

  // EleveDetail operations (preferred for combined User + Eleve operations)
  const createEleveDetail = async (data: Partial<EleveDetail>) => { 
    console.log('useUsersData: Creating eleve with data:', data);
    const r = await usersService.createEleveDetail(data); 
    console.log('useUsersData: Create response:', r);
    
    if (r.data && r.data.user && typeof r.data.user === 'object') {
      setElevesDetails(prev => [...prev, r.data]);
      setUsers(prev => [...prev, r.data.user as User]);
      console.log('useUsersData: Added new eleve to state');
    } else {
      console.error('useUsersData: Invalid response data structure:', r);
    }
    return r; 
  };
  
  const updateEleveDetail = async (id: number, data: Partial<EleveDetail>) => { 
    console.log('useUsersData: Updating eleve with id:', id, 'data:', data);
    const r = await usersService.updateEleveDetail(id, data); 
    console.log('useUsersData: Update response:', r);
    
    if (r.data && r.data.user && typeof r.data.user === 'object') {
      setElevesDetails(prev => prev.map(e => (e.id === id ? r.data : e)));
      setUsers(prev => prev.map(u => u.id === (r.data.user as User).id ? (r.data.user as User) : u));
      console.log('useUsersData: Updated eleve in state');
    } else {
      console.error('useUsersData: Invalid response data structure for update:', r);
    }
    return r; 
  };
  
  const deleteEleveDetail = async (id: number) => { 
    const eleveToDelete = elevesDetails.find(e => e.id === id);
    await usersService.deleteEleveDetail(id); 
    setElevesDetails(prev => prev.filter(e => e.id !== id));
    // Also remove from users if user data is available
    if (eleveToDelete && typeof eleveToDelete.user === 'object') {
      setUsers(prev => prev.filter(u => u.id !== (eleveToDelete.user as User).id));
    }
  };

  // TuteurDetail operations (preferred for combined User + Tuteur operations)
  const createTuteurDetail = async (data: Partial<TuteurDetail>) => { 
    console.log('useUsersData: Creating tuteur with data:', data);
    const r = await usersService.createTuteurDetail(data); 
    console.log('useUsersData: Create response:', r);
    
    if (r.data && r.data.user && typeof r.data.user === 'object') {
      setTuteursDetails(prev => [...prev, r.data]);
      setUsers(prev => [...prev, r.data.user as User]);
      console.log('useUsersData: Added new tuteur to state');
    } else {
      console.error('useUsersData: Invalid response data structure:', r);
    }
    return r; 
  };
  
  const updateTuteurDetail = async (id: number, data: Partial<TuteurDetail>) => { 
    console.log('useUsersData: Updating tuteur with id:', id, 'data:', data);
    const r = await usersService.updateTuteurDetail(id, data); 
    console.log('useUsersData: Update response:', r);
    
    if (r.data && r.data.user && typeof r.data.user === 'object') {
      setTuteursDetails(prev => prev.map(t => (t.id === id ? r.data : t)));
      setUsers(prev => prev.map(u => u.id === (r.data.user as User).id ? (r.data.user as User) : u));
      console.log('useUsersData: Updated tuteur in state');
    } else {
      console.error('useUsersData: Invalid response data structure for update:', r);
    }
    return r; 
  };
  
  const deleteTuteurDetail = async (id: number) => { 
    const tuteurToDelete = tuteursDetails.find(t => t.id === id);
    await usersService.deleteTuteurDetail(id); 
    setTuteursDetails(prev => prev.filter(t => t.id !== id));
    // Also remove from users if user data is available
    if (tuteurToDelete && typeof tuteurToDelete.user === 'object') {
      setUsers(prev => prev.filter(u => u.id !== (tuteurToDelete.user as User).id));
    }
  };

  // StaffDetail operations (preferred for combined User + Staff operations)
  const createStaffDetail = async (data: Partial<StaffDetail>) => { 
    const r = await usersService.createStaffDetail(data); 
    if (r.data) {
      setStaffsDetails(prev => [...prev, r.data]);
      // Also update users if the user data is included
      if (r.data.user && typeof r.data.user === 'object') {
        setUsers(prev => [...prev, r.data.user as User]);
      }
    }
    return r; 
  };
  
  const updateStaffDetail = async (id: number, data: Partial<StaffDetail>) => { 
    const r = await usersService.updateStaffDetail(id, data); 
    if (r.data) {
      setStaffsDetails(prev => prev.map(s => (s.id === id ? r.data : s)));
      // Also update users if the user data is included
      if (r.data.user && typeof r.data.user === 'object') {
        setUsers(prev => prev.map(u => u.id === (r.data.user as User).id ? (r.data.user as User) : u));
      }
    }
    return r; 
  };
  
  const deleteStaffDetail = async (id: number) => { 
    await usersService.deleteStaffDetail(id); 
    const staffToDelete = staffsDetails.find(s => s.id === id);
    setStaffsDetails(prev => prev.filter(s => s.id !== id));
    // Also remove from users if user data is available
    if (staffToDelete && typeof staffToDelete.user === 'object') {
      setUsers(prev => prev.filter(u => u.id !== (staffToDelete.user as User).id));
    }
  };

  // Legacy operations for backward compatibility
  const createTuteur = async (data: Partial<Tuteur>) => { 
    const r = await usersService.createTuteur(data); 
    if (r.data) setTuteurs(prev => [...prev, r.data]); 
    return r; 
  };
  
  const updateTuteur = async (id: number, data: Partial<Tuteur>) => { 
    const r = await usersService.updateTuteur(id, data); 
    if (r.data) setTuteurs(prev => prev.map(t => (t.id === id ? r.data : t))); 
    return r; 
  };
  
  const deleteTuteur = async (id: number) => { 
    await usersService.deleteTuteur(id); 
    setTuteurs(prev => prev.filter(t => t.id !== id)); 
  };
  
  const createEleve = async (data: Partial<Eleve>) => { 
    const r = await usersService.createEleve(data); 
    if (r.data) setEleves(prev => [...prev, r.data]); 
    return r; 
  };
  
  const updateEleve = async (id: number, data: Partial<Eleve>) => { 
    const r = await usersService.updateEleve(id, data); 
    if (r.data) setEleves(prev => prev.map(e => (e.id === id ? r.data : e))); 
    return r; 
  };
  
  const deleteEleve = async (id: number) => { 
    await usersService.deleteEleve(id); 
    setEleves(prev => prev.filter(e => e.id !== id)); 
  };

  const createStaff = async (data: Partial<Staff>) => { 
    const r = await usersService.createStaff(data); 
    if (r.data) setStaffs(prev => [...prev, r.data]); 
    return r; 
  };
  
  const updateStaff = async (id: number, data: Partial<Staff>) => { 
    const r = await usersService.updateStaff(id, data); 
    if (r.data) setStaffs(prev => prev.map(s => (s.id === id ? r.data : s))); 
    return r; 
  };
  
  const deleteStaff = async (id: number) => { 
    await usersService.deleteStaff(id); 
    setStaffs(prev => prev.filter(s => s.id !== id)); 
  };

  // Relations operations
  const createRelation = async (data: Partial<RelationEleveTuteur>) => { 
    const r = await usersService.createRelation(data); 
    if (r.data) setRelations(prev => [...prev, r.data]); 
    return r; 
  };
  
  const updateRelation = async (id: number, data: Partial<RelationEleveTuteur>) => { 
    const r = await usersService.updateRelation(id, data); 
    if (r.data) setRelations(prev => prev.map(rel => (rel.id === id ? r.data : rel))); 
    return r; 
  };
  
  const deleteRelation = async (id: number) => { 
    await usersService.deleteRelation(id); 
    setRelations(prev => prev.filter(rel => rel.id !== id)); 
  };

  return {
    // Primary data
    users, 
    elevesDetails, 
    tuteursDetails, 
    staffsDetails,
    relations,
    loading,

    // Legacy data (for backward compatibility)
    eleves, 
    tuteurs, 
    staffs,
    
    // Preferred operations (using *Detail endpoints)
    createEleveDetail, updateEleveDetail, deleteEleveDetail,
    createTuteurDetail, updateTuteurDetail, deleteTuteurDetail,
    createStaffDetail, updateStaffDetail, deleteStaffDetail,
    
    // Legacy operations (for backward compatibility)
    createUser, updateUser, deleteUser,
    createEleve, updateEleve, deleteEleve,
    createTuteur, updateTuteur, deleteTuteur,
    createStaff, updateStaff, deleteStaff,
    createRelation, updateRelation, deleteRelation,
  };
}
