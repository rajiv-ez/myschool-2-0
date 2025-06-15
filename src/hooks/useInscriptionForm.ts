
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

interface UseInscriptionFormProps {
  isEditing: boolean;
  selectedInscription: Inscription | null;
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
      eleve: isEditing && selectedInscription ? selectedInscription.eleve.toString() : '',
      classeAcademiqueId: '',
      est_reinscription: isEditing && selectedInscription ? selectedInscription.est_reinscription : false,
      statut: isEditing && selectedInscription ? selectedInscription.statut : 'CONFIRMEE',
      date_inscription: isEditing && selectedInscription 
        ? selectedInscription.date_inscription
        : new Date().toISOString().split('T')[0]
    }
  });
  
  // Initialiser la classe académique sélectionnée si en mode édition
  useEffect(() => {
    if (isEditing && selectedInscription) {
      const classeAcademique = classesAcademiques.find(ca => 
        ca.id === selectedInscription.classe_session
      );
      
      if (classeAcademique) {
        setSelectedClasseAcademique(classeAcademique);
        form.setValue('classeAcademiqueId', classeAcademique.id.toString());
      }
    }
  }, [isEditing, selectedInscription, classesAcademiques, form]);
  
  const handleClasseAcademiqueChange = (value: string) => {
    const id = parseInt(value);
    const classeAcademique = classesAcademiques.find(ca => ca.id === id);
    setSelectedClasseAcademique(classeAcademique || null);
    form.setValue('classeAcademiqueId', value);
  };
  
  const activeClassesAcademiques = classesAcademiques.filter(ca => ca.statut === 'Actif');
  
  const handleSubmit = (data: any) => {
    if (!selectedClasseAcademique) return;
    
    const formData = {
      eleve: parseInt(data.eleve),
      classe_session: selectedClasseAcademique.id,
      est_reinscription: data.est_reinscription,
      statut: data.statut,
      date_inscription: data.date_inscription
    };
    
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
