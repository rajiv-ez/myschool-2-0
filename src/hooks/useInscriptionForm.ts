
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';

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
  
  // Récupérer les données des utilisateurs et élèves
  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  });

  const { data: elevesResponse } = useQuery({
    queryKey: ['eleves'],
    queryFn: () => usersService.getEleves(),
  });

  const users = usersResponse?.data || [];
  const eleves = elevesResponse?.data || [];

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
    }
  }, [isEditing, selectedInscription, classesAcademiques, eleves, form]);
  
  const handleClasseAcademiqueChange = (value: string) => {
    console.log('Classe academique changed to:', value);
    const id = parseInt(value);
    const classeAcademique = classesAcademiques.find(ca => ca.id === id);
    setSelectedClasseAcademique(classeAcademique || null);
    form.setValue('classeAcademiqueId', value);
  };
  
  const activeClassesAcademiques = classesAcademiques.filter(ca => ca.statut === 'Actif');
  
  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
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
      est_reinscription: data.est_reinscription,
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
    handleClasseAcademiqueChange,
    handleSubmit
  };
}
