
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';
import { User, Eleve } from '@/types/users';
import { Inscription, ClasseSession, Session, Classe, Specialite, Filiere, Niveau } from '@/types/academic';

// Données fictives basées sur les vrais types
const sessionsData: Session[] = [
  { id: 1, nom: '2024-2025', debut: '2024-09-01', fin: '2025-06-30', en_cours: true, auto_activer_palier: true },
  { id: 2, nom: '2023-2024', debut: '2023-09-01', fin: '2024-06-30', en_cours: false, auto_activer_palier: false },
];

const niveauxData: Niveau[] = [
  { id: 1, nom: 'Primaire' },
  { id: 2, nom: 'Collège' },
  { id: 3, nom: 'Lycée' },
];

const filieresData: Filiere[] = [
  { id: 1, niveau: 1, nom: 'Générale', description: 'Formation générale primaire' },
  { id: 2, niveau: 2, nom: 'Générale', description: 'Formation générale collège' },
  { id: 3, niveau: 3, nom: 'Scientifique', description: 'Formation scientifique' },
  { id: 4, niveau: 3, nom: 'Littéraire', description: 'Formation littéraire' },
];

const specialitesData: Specialite[] = [
  { id: 1, filiere: 1, nom: 'Standard', description: 'Formation standard primaire' },
  { id: 2, filiere: 2, nom: 'Standard', description: 'Formation standard collège' },
  { id: 3, filiere: 3, nom: 'Mathématiques', description: 'Spécialité mathématiques' },
  { id: 4, filiere: 4, nom: 'Philosophie', description: 'Spécialité philosophie' },
];

const classesData: Classe[] = [
  { id: 1, specialite: 1, nom: 'CP', description: 'Cours Préparatoire' },
  { id: 2, specialite: 1, nom: 'CE1', description: 'Cours Élémentaire 1' },
  { id: 3, specialite: 2, nom: '6ème', description: 'Sixième' },
  { id: 4, specialite: 3, nom: 'Terminale S', description: 'Terminale Scientifique' },
];

const classeSessionsData: ClasseSession[] = [
  { id: 1, classe: 1, session: 1, capacite: 30 },
  { id: 2, classe: 2, session: 1, capacite: 28 },
  { id: 3, classe: 3, session: 1, capacite: 25 },
  { id: 4, classe: 4, session: 1, capacite: 32 },
];

const inscriptionsData: Inscription[] = [
  { 
    id: 1, 
    eleve: 1, 
    classe_session: 1, 
    date_inscription: '2024-08-12', 
    est_reinscription: false, 
    statut: 'CONFIRMEE' 
  },
  { 
    id: 2, 
    eleve: 2, 
    classe_session: 2, 
    date_inscription: '2024-08-15', 
    est_reinscription: true, 
    statut: 'CONFIRMEE' 
  },
  { 
    id: 3, 
    eleve: 3, 
    classe_session: 3, 
    date_inscription: '2024-08-10', 
    est_reinscription: false, 
    statut: 'EN_ATTENTE' 
  },
  { 
    id: 4, 
    eleve: 4, 
    classe_session: 4, 
    date_inscription: '2024-08-18', 
    est_reinscription: true, 
    statut: 'CONFIRMEE' 
  },
];

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

  const users = usersResponse?.data || [];
  const eleves = elevesResponse?.data || [];
  const fromApi = usersResponse?.fromApi && elevesResponse?.fromApi;

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
      case 'CONFIRMEE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'CONFIRMEE': return 'Confirmée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  };

  // Données enrichies pour les inscriptions avec informations complètes
  const enrichedInscriptions = inscriptionsData.map(inscription => ({
    ...inscription,
    eleveNom: getEleveFullName(inscription.eleve),
    classeSessionNom: getClasseSessionName(inscription.classe_session),
    statutLabel: getStatutLabel(inscription.statut),
    statutColor: getStatutColor(inscription.statut),
    typeLabel: inscription.est_reinscription ? 'Réinscription' : 'Nouvelle',
    typeColor: inscription.est_reinscription ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800',
    dateFormatted: new Date(inscription.date_inscription).toLocaleDateString('fr-FR')
  }));

  // Classes académiques pour le formulaire
  const classesAcademiques = classeSessionsData.map(cs => {
    const classe = classesData.find(c => c.id === cs.classe);
    const session = sessionsData.find(s => s.id === cs.session);
    return {
      id: cs.id,
      classe: classe?.nom || 'Inconnue',
      session: session?.nom || 'Inconnue',
      enseignant: 'M. Dupont', // Données fictives
      eleves: Math.floor(Math.random() * cs.capacite),
      capacite: cs.capacite,
      statut: 'Actif'
    };
  });

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
    isLoading: usersLoading || elevesLoading,
    fromApi
  };
}
