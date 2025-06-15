
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';
import { academicService } from '@/services/academicService';

export function useInscriptionFormData() {
  // Récupérer les données des utilisateurs et élèves
  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  });

  const { data: elevesResponse } = useQuery({
    queryKey: ['eleves'],
    queryFn: () => usersService.getEleves(),
  });

  // Récupérer toutes les inscriptions depuis l'API pour vérifier les réinscriptions
  const { data: inscriptionsResponse } = useQuery({
    queryKey: ['inscriptions'],
    queryFn: () => academicService.getInscriptions(),
  });

  const users = usersResponse?.data || [];
  const eleves = elevesResponse?.data || [];
  const allInscriptions = inscriptionsResponse?.data || [];

  // Créer une liste d'élèves avec leurs informations utilisateur
  const elevesWithUserInfo = eleves.map(eleve => {
    // Ensure user is always a number (user ID)
    const userId = typeof eleve.user === 'number' ? eleve.user : eleve.user.id;
    const user = users.find(u => u.id === userId);
    
    return {
      ...eleve,
      user: userId, // Always store as number (user ID)
      nom: user?.nom || 'Inconnu',
      prenom: user?.prenom || 'Inconnu',
      fullName: user ? `${user.prenom} ${user.nom}` : 'Inconnu'
    };
  });

  return {
    users,
    eleves,
    allInscriptions,
    elevesWithUserInfo
  };
}
