
import { useInscriptionFormData } from './useInscriptionFormData';
import { useInscriptionValidation } from './useInscriptionValidation';
import { useInscriptionFormState } from './useInscriptionFormState';

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

// Type for enriched inscription that might come from DataManagementPage
interface EnrichedInscription extends Inscription {
  eleveNom?: string;
  classeSessionNom?: string;
  statutLabel?: string;
  statutColor?: string;
  typeLabel?: string;
  typeColor?: string;
  dateFormatted?: string;
}

interface UseInscriptionFormProps {
  isEditing: boolean;
  selectedInscription: EnrichedInscription | null;
  classesAcademiques: ClasseAcademique[];
  onSubmit: (data: any) => void;
}

export function useInscriptionForm({
  isEditing,
  selectedInscription,
  classesAcademiques,
  onSubmit
}: UseInscriptionFormProps) {
  // Get data from external sources
  const { elevesWithUserInfo, allInscriptions, eleves } = useInscriptionFormData();
  
  // Get validation functions
  const { checkIfReinscription, checkClassCapacity, checkForDuplicateEnrollment } = useInscriptionValidation({
    classesAcademiques,
    allInscriptions,
    elevesWithUserInfo,
    isEditing,
    selectedInscriptionId: selectedInscription?.id
  });

  // Get form state management
  const {
    form,
    selectedClasseAcademique,
    setSelectedClasseAcademique,
    isReinscription,
    setIsReinscription,
    capacityError,
    duplicateError
  } = useInscriptionFormState({
    isEditing,
    selectedInscription,
    classesAcademiques,
    eleves,
    checkIfReinscription,
    checkClassCapacity,
    checkForDuplicateEnrollment
  });
  
  const handleClasseAcademiqueChange = (value: string) => {
    console.log('Classe academique changed to:', value);
    const id = parseInt(value);
    const classeAcademique = classesAcademiques.find(ca => ca.id === id);
    setSelectedClasseAcademique(classeAcademique || null);
    form.setValue('classeAcademiqueId', value);
  };

  const handleEleveChange = (value: string) => {
    console.log('Eleve changed to:', value);
    form.setValue('eleve', value);
    
    if (!isEditing) {
      const isReinscriptionDetected = checkIfReinscription(value);
      setIsReinscription(isReinscriptionDetected);
      form.setValue('est_reinscription', isReinscriptionDetected);
    }
  };
  
  const activeClassesAcademiques = classesAcademiques.filter(ca => ca.statut === 'Actif');
  
  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    
    // Vérifier les erreurs avant la soumission
    if (capacityError || duplicateError) {
      console.error('Cannot submit: validation errors');
      return;
    }
    
    if (!selectedClasseAcademique) {
      console.error('No classe academique selected');
      return;
    }
    
    // Trouver l'élève sélectionné pour obtenir son user ID
    const selectedEleve = elevesWithUserInfo.find(e => e.id.toString() === data.eleve);
    const eleveUserId = selectedEleve ? selectedEleve.user : parseInt(data.eleve);
    
    const formData = {
      eleve: eleveUserId, // Utiliser l'user ID de l'élève
      classe_session: selectedClasseAcademique.id,
      est_reinscription: isReinscription,
      statut: data.statut,
      date_inscription: data.date_inscription
    };
    
    console.log('Processed form data:', formData);
    onSubmit(formData);
  };

  return {
    form,
    selectedClasseAcademique,
    elevesWithUserInfo,
    activeClassesAcademiques,
    isReinscription,
    capacityError,
    duplicateError,
    handleClasseAcademiqueChange,
    handleEleveChange,
    handleSubmit
  };
}
