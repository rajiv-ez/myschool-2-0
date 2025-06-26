
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';
import { academicService } from '@/services/academicService';
import { User, Eleve } from '@/types/users';
import { Inscription, ClasseSession, Session, Classe, Specialite, Filiere, Niveau } from '@/types/academic';

export function useInscriptionsData() {
  // Récupérer les données des utilisateurs et élèves
  const { data: usersResponse, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  });

  const { data: elevesResponse, isLoading: elevesLoading } = useQuery({
    queryKey: ['eleves'],
    queryFn: () => usersService.getEleves(),
  });

  // Récupérer toutes les données académiques depuis l'API
  const { data: inscriptionsResponse, isLoading: inscriptionsLoading } = useQuery({
    queryKey: ['inscriptions'],
    queryFn: () => academicService.getInscriptions(),
  });

  const { data: sessionsResponse, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => academicService.getSessions(),
  });

  const { data: classeSessionsResponse, isLoading: classeSessionsLoading } = useQuery({
    queryKey: ['classe-sessions'],
    queryFn: () => academicService.getClasseSessions(),
  });

  const { data: classesResponse, isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => academicService.getClasses(),
  });

  const { data: specialitesResponse, isLoading: specialitesLoading } = useQuery({
    queryKey: ['specialites'],
    queryFn: () => academicService.getSpecialites(),
  });

  const { data: filieresResponse, isLoading: filieresLoading } = useQuery({
    queryKey: ['filieres'],
    queryFn: () => academicService.getFilieres(),
  });

  const { data: niveauxResponse, isLoading: niveauxLoading } = useQuery({
    queryKey: ['niveaux'],
    queryFn: () => academicService.getNiveaux(),
  });

  const users = usersResponse?.data || [];
  const eleves = elevesResponse?.data || [];
  const inscriptionsApiData = inscriptionsResponse?.data || [];
  const sessionsData = sessionsResponse?.data || [];
  const classeSessionsData = classeSessionsResponse?.data || [];
  const classesData = classesResponse?.data || [];
  const specialitesData = specialitesResponse?.data || [];
  const filieresData = filieresResponse?.data || [];
  const niveauxData = niveauxResponse?.data || [];

  const fromApi = usersResponse?.fromApi && 
                 elevesResponse?.fromApi && 
                 inscriptionsResponse?.fromApi &&
                 sessionsResponse?.fromApi &&
                 classeSessionsResponse?.fromApi &&
                 classesResponse?.fromApi;

  // Fonctions utilitaires
  const getEleveFullName = (eleveId: number) => {
    const eleve = eleves.find(e => e.user === eleveId);
    if (!eleve) return 'Élève inconnu';
    
    const user = users.find(u => u.id === eleve.user);
    return user ? `${user.prenom} ${user.nom}` : 'Élève inconnu';
  };

  const getClasseSessionName = (classeSessionId: number) => {
    const classeSession = classeSessionsData.find(cs => cs.id === classeSessionId);
    if (!classeSession) return 'Inconnue';
    
    const classe = classesData.find(c => c.id === classeSession.classe);
    const session = sessionsData.find(s => s.id === classeSession.session);
    return `${classe?.nom || 'Inconnue'} (${session?.nom || 'Inconnue'})`;
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'CONFIRME': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ANNULE': return 'bg-red-100 text-red-800';
      case 'SUSPENDU': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'CONFIRME': return 'Confirmée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULE': return 'Annulée';
      case 'SUSPENDU': return 'Suspendue';
      default: return statut;
    }
  };

  // Données enrichies pour les inscriptions avec informations complètes
  const enrichedInscriptions = inscriptionsApiData.map(inscription => ({
    ...inscription,
    eleveNom: getEleveFullName(inscription.eleve),
    classeSessionNom: getClasseSessionName(inscription.classe_session),
    statutLabel: getStatutLabel(inscription.statut),
    statutColor: getStatutColor(inscription.statut),
    typeLabel: inscription.est_reinscription ? 'Réinscription' : 'Nouvelle',
    typeColor: inscription.est_reinscription ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800',
    dateFormatted: new Date(inscription.date_inscription).toLocaleDateString('fr-FR')
  }));

  // Construire les classes académiques avec la hiérarchie complète depuis l'API
  const classesAcademiques = classeSessionsData.map(cs => {
    const classe = classesData.find(c => c.id === cs.classe);
    const session = sessionsData.find(s => s.id === cs.session);
    
    // Construire le nom complet de la classe avec la hiérarchie
    let classeNom = classe?.nom || 'Inconnue';
    
    if (classe) {
      const specialite = specialitesData.find(sp => sp.id === classe.specialite);
      if (specialite) {
        const filiere = filieresData.find(f => f.id === specialite.filiere);
        if (filiere) {
          const niveau = niveauxData.find(n => n.id === filiere.niveau);
          if (niveau) {
            classeNom = `${niveau.nom} - ${filiere.nom} - ${specialite.nom} - ${classe.nom}`;
          }
        }
      }
    }
    
    // Compter les inscriptions actuelles pour cette classe session
    const currentInscriptions = inscriptionsApiData.filter(i => 
      i.classe_session === cs.id && i.statut === 'CONFIRME'
    );
    
    return {
      id: cs.id,
      classe: classeNom,
      session: session?.nom || 'Inconnue',
      enseignant: 'M. Dupont', // TODO: À récupérer depuis l'API quand disponible
      eleves: currentInscriptions.length,
      capacite: cs.capacite,
      statut: 'Actif'
    };
  });

  const isLoading = usersLoading || 
                   elevesLoading || 
                   inscriptionsLoading ||
                   sessionsLoading ||
                   classeSessionsLoading ||
                   classesLoading ||
                   specialitesLoading ||
                   filieresLoading ||
                   niveauxLoading;

  return {
    inscriptions: enrichedInscriptions,
    users,
    eleves,
    sessions: sessionsData,
    classes: classesData,
    classeSessionsData,
    classesAcademiques,
    getEleveFullName,
    getClasseSessionName,
    getStatutLabel,
    getStatutColor,
    isLoading,
    fromApi
  };
}
