
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

interface UseInscriptionFormStateProps {
  isEditing: boolean;
  selectedInscription: EnrichedInscription | null;
  classesAcademiques: ClasseAcademique[];
  eleves: any[];
  checkIfReinscription: (eleveId: string) => boolean;
  checkClassCapacity: (classeAcademiqueId: string, eleveId: string) => string;
}

export function useInscriptionFormState({
  isEditing,
  selectedInscription,
  classesAcademiques,
  eleves,
  checkIfReinscription,
  checkClassCapacity
}: UseInscriptionFormStateProps) {
  const [selectedClasseAcademique, setSelectedClasseAcademique] = useState<ClasseAcademique | null>(null);
  const [isReinscription, setIsReinscription] = useState(false);
  const [capacityError, setCapacityError] = useState<string>('');

  const form = useForm({
    defaultValues: {
      eleve: '',
      classeAcademiqueId: '',
      est_reinscription: false,
      statut: 'CONFIRMEE',
      date_inscription: new Date().toISOString().split('T')[0]
    }
  });

  // Extract basic inscription properties from enriched object
  const extractBasicInscription = (enrichedInscription: EnrichedInscription): Inscription => {
    return {
      id: enrichedInscription.id,
      eleve: enrichedInscription.eleve,
      classe_session: enrichedInscription.classe_session,
      date_inscription: enrichedInscription.date_inscription,
      est_reinscription: enrichedInscription.est_reinscription,
      statut: enrichedInscription.statut
    };
  };

  // Initialiser les valeurs du formulaire et la classe académique sélectionnée si en mode édition
  useEffect(() => {
    if (isEditing && selectedInscription) {
      console.log('Initializing form for editing:', selectedInscription);
      
      // Extract basic inscription properties
      const basicInscription = extractBasicInscription(selectedInscription);
      
      // Trouver l'élève correspondant pour obtenir son ID d'élève (pas son user ID)
      const eleveRecord = eleves.find(e => e.user === basicInscription.eleve);
      const eleveId = eleveRecord ? eleveRecord.id.toString() : basicInscription.eleve.toString();
      
      // Réinitialiser les valeurs du formulaire
      form.reset({
        eleve: eleveId,
        classeAcademiqueId: basicInscription.classe_session.toString(),
        est_reinscription: basicInscription.est_reinscription,
        statut: basicInscription.statut,
        date_inscription: basicInscription.date_inscription
      });

      // Définir l'état de réinscription
      setIsReinscription(basicInscription.est_reinscription);
      
      // Trouver et définir la classe académique correspondante
      const classeAcademique = classesAcademiques.find(ca => 
        ca.id === basicInscription.classe_session
      );
      
      if (classeAcademique) {
        console.log('Found matching classe academique:', classeAcademique);
        setSelectedClasseAcademique(classeAcademique);
      } else {
        console.warn('No matching classe academique found for id:', basicInscription.classe_session);
      }
    } else {
      // Mode création - réinitialiser le formulaire avec des valeurs par défaut
      console.log('Initializing form for creation');
      form.reset({
        eleve: '',
        classeAcademiqueId: '',
        est_reinscription: false,
        statut: 'CONFIRMEE',
        date_inscription: new Date().toISOString().split('T')[0]
      });
      setSelectedClasseAcademique(null);
      setIsReinscription(false);
      setCapacityError('');
    }
  }, [isEditing, selectedInscription, classesAcademiques, eleves, form]);

  // Surveiller les changements d'élève pour détecter automatiquement la réinscription
  useEffect(() => {
    const eleveId = form.watch('eleve');
    if (eleveId && !isEditing) {
      const isReinscriptionDetected = checkIfReinscription(eleveId);
      setIsReinscription(isReinscriptionDetected);
      form.setValue('est_reinscription', isReinscriptionDetected);
    }
  }, [form.watch('eleve'), checkIfReinscription, isEditing, form]);

  // Surveiller les changements de classe pour vérifier la capacité
  useEffect(() => {
    const classeAcademiqueId = form.watch('classeAcademiqueId');
    const eleveId = form.watch('eleve');
    
    if (classeAcademiqueId) {
      const error = checkClassCapacity(classeAcademiqueId, eleveId);
      setCapacityError(error);
    } else {
      setCapacityError('');
    }
  }, [form.watch('classeAcademiqueId'), form.watch('eleve'), checkClassCapacity, form]);

  return {
    form,
    selectedClasseAcademique,
    setSelectedClasseAcademique,
    isReinscription,
    setIsReinscription,
    capacityError
  };
}
