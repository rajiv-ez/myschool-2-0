
import { useEffect, useState } from 'react';
import { usersService } from '@/services/usersService';
import { User, Eleve, Tuteur } from '@/types/users';

export function useUsersData() {
  const [users, setUsers] = useState<User[]>([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [tuteurs, setTuteurs] = useState<Tuteur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [u, e] = await Promise.all([
        usersService.getUsers(),
        usersService.getEleves(),
      ]);
      
      if (u.fromApi) setUsers(u.data);
      if (e.fromApi) setEleves(e.data);
      
      // Filter tuteurs from users (assuming tuteurs are users with certain criteria)
      const tuteursData = u.data.filter(user => user.is_staff === false).map(user => ({
        id: user.id,
        user: user.id,
        profession: 'Non spécifiée'
      }));
      setTuteurs(tuteursData);
      
      setLoading(false);
    })();
  }, []);

  const createUser = async (data: Partial<User>) => {
    const r = await usersService.createUser(data);
    if (r.fromApi) setUsers(prev => [...prev, r.data]);
    return r;
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    const r = await usersService.updateUser(id, data);
    if (r.fromApi) setUsers(prev => prev.map(u => (u.id === id ? r.data : u)));
    return r;
  };

  const deleteUser = async (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setEleves(prev => prev.filter(e => e.user !== id));
  };

  return {
    users,
    eleves,
    tuteurs,
    loading,
    createUser,
    updateUser,
    deleteUser,
  };
}
