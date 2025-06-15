
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';
import { academicService } from '@/services/academicService';

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
  const [selectedClasseAcademique, setSelectedClasseAcademique] = useState<ClasseAcademique | null>(null);
  const [isReinscription, setIsReinscription] = useState(false);
  const [capacityError, setCapacityError] = useState<string>('');
  
  // Récupérer les données des utilisateurs et élèves
  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  });

  const { data: elevesResponse } = useQuery({
    queryKey: ['eleves'],
    queryFn: () => usersService.getEleves(),
  });

  // Récupérer toutes les inscriptions pour vérifier les réinscriptions
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

  // Fonction pour vérifier si un élève a déjà été inscrit
  const checkIfReinscription = (eleveId: string) => {
    if (!eleveId) return false;
    
    // Trouver l'élève sélectionné pour obtenir son user ID
    const selectedEleve = elevesWithUserInfo.find(e => e.id.toString() === eleveId);
    if (!selectedEleve) return false;

    // Vérifier si cet élève a déjà des inscriptions
    const hasExistingInscriptions = allInscriptions.some(inscription => 
      inscription.eleve === selectedEleve.user && 
      (!isEditing || inscription.id !== selectedInscription?.id)
    );

    return hasExistingInscriptions;
  };

  // Fonction pour vérifier la capacité de la classe
  const checkClassCapacity = (classeAcademiqueId: string, eleveId: string) => {
    if (!classeAcademiqueId) return '';

    const classeAcademique = classesAcademiques.find(ca => ca.id.toString() === classeAcademiqueId);
    if (!classeAcademique) return '';

    // Compter les inscriptions actuelles pour cette classe (excluant l'inscription en cours d'édition)
    const currentInscriptions = allInscriptions.filter(inscription => 
      inscription.classe_session === parseInt(classeAcademiqueId) &&
      inscription.statut === 'CONFIRMEE' &&
      (!isEditing || inscription.id !== selectedInscription?.id)
    );

    const currentCount = currentInscriptions.length;
    const capacity = classeAcademique.capacite;

    if (currentCount >= capacity) {
      return `Cette classe a atteint sa capacité maximale (${capacity} élèves).`;
    }

    return '';
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
  }, [form.watch('eleve'), allInscriptions, elevesWithUserInfo, isEditing]);

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
  }, [form.watch('classeAcademiqueId'), form.watch('eleve'), allInscriptions, classesAcademiques, isEditing]);
  
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
    
    // Vérifier la capacité avant la soumission
    if (capacityError) {
      console.error('Cannot submit: capacity error');
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
    handleClasseAcademiqueChange,
    handleEleveChange,
    handleSubmit
  };
}
