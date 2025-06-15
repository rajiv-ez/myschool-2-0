
import { useMemo } from 'react';

interface ClasseAcademique {
  id: number;
  classe: string;
  session: string;
  enseignant: string;
  eleves: number;
  capacite: number;
  statut: string;
}

interface Inscription {
  id: number;
  eleve: number;
  classe_session: number;
  date_inscription: string;
  est_reinscription: boolean;
  statut: string;
}

interface EleveWithUserInfo {
  id: number;
  user: number;
  nom: string;
  prenom: string;
  fullName: string;
}

interface UseInscriptionValidationProps {
  classesAcademiques: ClasseAcademique[];
  allInscriptions: Inscription[];
  elevesWithUserInfo: EleveWithUserInfo[];
  isEditing: boolean;
  selectedInscriptionId?: number;
}

export function useInscriptionValidation({
  classesAcademiques,
  allInscriptions,
  elevesWithUserInfo,
  isEditing,
  selectedInscriptionId
}: UseInscriptionValidationProps) {
  
  const checkIfReinscription = useMemo(() => {
    return (eleveId: string) => {
      if (!eleveId) return false;
      
      // Trouver l'élève sélectionné pour obtenir son user ID
      const selectedEleve = elevesWithUserInfo.find(e => e.id.toString() === eleveId);
      if (!selectedEleve) return false;

      // Vérifier si cet élève a déjà des inscriptions
      const hasExistingInscriptions = allInscriptions.some(inscription => 
        inscription.eleve === selectedEleve.user && 
        (!isEditing || inscription.id !== selectedInscriptionId)
      );

      return hasExistingInscriptions;
    };
  }, [allInscriptions, elevesWithUserInfo, isEditing, selectedInscriptionId]);

  const checkClassCapacity = useMemo(() => {
    return (classeAcademiqueId: string, eleveId: string) => {
      if (!classeAcademiqueId) return '';

      const classeAcademique = classesAcademiques.find(ca => ca.id.toString() === classeAcademiqueId);
      if (!classeAcademique) return '';

      // Compter les inscriptions actuelles pour cette classe (excluant l'inscription en cours d'édition)
      const currentInscriptions = allInscriptions.filter(inscription => 
        inscription.classe_session === parseInt(classeAcademiqueId) &&
        inscription.statut === 'CONFIRMEE' &&
        (!isEditing || inscription.id !== selectedInscriptionId)
      );

      const currentCount = currentInscriptions.length;
      const capacity = classeAcademique.capacite;

      if (currentCount >= capacity) {
        return `Cette classe a atteint sa capacité maximale (${capacity} élèves).`;
      }

      return '';
    };
  }, [allInscriptions, classesAcademiques, isEditing, selectedInscriptionId]);

  return {
    checkIfReinscription,
    checkClassCapacity
  };
}
