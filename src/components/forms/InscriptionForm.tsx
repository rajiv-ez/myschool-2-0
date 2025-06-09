
import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
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

interface InscriptionFormProps {
  isEditing: boolean;
  selectedInscription: Inscription | null;
  classesAcademiques: ClasseAcademique[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const InscriptionForm: React.FC<InscriptionFormProps> = ({
  isEditing,
  selectedInscription,
  classesAcademiques,
  onSubmit,
  onCancel
}) => {
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
    const user = users.find(u => u.id === eleve.user);
    return {
      ...eleve,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="eleve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Élève</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un élève" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {elevesWithUserInfo.map((eleve) => (
                    <SelectItem key={eleve.id} value={eleve.user.toString()}>
                      {eleve.fullName} ({eleve.matricule})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Sélectionnez l'élève à inscrire
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="classeAcademiqueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe académique</FormLabel>
              <Select 
                onValueChange={handleClasseAcademiqueChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe académique" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activeClassesAcademiques.map((ca) => (
                    <SelectItem key={ca.id} value={ca.id.toString()}>
                      {ca.classe} - {ca.session} ({ca.eleves}/{ca.capacite})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Sélectionnez la classe et la session pour cette inscription
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="statut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CONFIRMEE">Confirmée</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="ANNULEE">Annulée</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="est_reinscription"
            {...form.register('est_reinscription')}
            className="rounded"
          />
          <label htmlFor="est_reinscription" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Réinscription
          </label>
        </div>
        
        <FormField
          control={form.control}
          name="date_inscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'inscription</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button 
            type="submit"
            disabled={!selectedClasseAcademique || !form.watch('eleve')}
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default InscriptionForm;
