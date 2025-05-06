
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

// Type pour les classes académiques
interface ClasseAcademique {
  id: number;
  classe: string;
  session: string;
  enseignant: string;
  eleves: number;
  capacite: number;
  statut: string;
}

// Type pour l'inscription
interface Inscription {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  session: string;
  statut: string;
  date: string;
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
  
  // Initialiser le formulaire avec les valeurs par défaut
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedInscription ? selectedInscription.nom : '',
      prenom: isEditing && selectedInscription ? selectedInscription.prenom : '',
      classeAcademiqueId: '',
      statut: isEditing && selectedInscription ? selectedInscription.statut : 'Nouvelle',
      date: isEditing && selectedInscription 
        ? selectedInscription.date.split('/').reverse().join('-')
        : new Date().toISOString().split('T')[0]
    }
  });
  
  // Initialiser la classe académique sélectionnée si en mode édition
  useEffect(() => {
    if (isEditing && selectedInscription) {
      const classeAcademique = classesAcademiques.find(ca => 
        ca.classe === selectedInscription.classe && 
        ca.session === selectedInscription.session
      );
      
      if (classeAcademique) {
        setSelectedClasseAcademique(classeAcademique);
        form.setValue('classeAcademiqueId', classeAcademique.id.toString());
      }
    }
  }, [isEditing, selectedInscription, classesAcademiques, form]);
  
  // Suivre les changements de classe académique
  const handleClasseAcademiqueChange = (value: string) => {
    const id = parseInt(value);
    const classeAcademique = classesAcademiques.find(ca => ca.id === id);
    setSelectedClasseAcademique(classeAcademique || null);
    form.setValue('classeAcademiqueId', value);
  };
  
  // Filtrer les classes académiques actives uniquement
  const activeClassesAcademiques = classesAcademiques.filter(ca => ca.statut === 'Actif');
  
  // Gérer la soumission du formulaire
  const handleSubmit = (data: any) => {
    if (!selectedClasseAcademique) return;
    
    const formData = {
      ...data,
      classe: selectedClasseAcademique.classe,
      session: selectedClasseAcademique.session,
      date: data.date.split('-').reverse().join('/')
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Nouvelle">Nouvelle</SelectItem>
                  <SelectItem value="Réinscription">Réinscription</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
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
            disabled={!selectedClasseAcademique}
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default InscriptionForm;
