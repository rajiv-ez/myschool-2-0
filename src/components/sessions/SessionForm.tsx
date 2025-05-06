
import React from 'react';
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

// Type pour les sessions
interface Session {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  paliers: number;
}

interface SessionFormProps {
  isEditing: boolean;
  selectedItem: Session | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  isEditing,
  selectedItem,
  onSubmit,
  onCancel
}) => {
  // Initialiser le formulaire
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedItem ? selectedItem.nom : '',
      dateDebut: isEditing && selectedItem ? selectedItem.dateDebut.split('/').reverse().join('-') : '',
      dateFin: isEditing && selectedItem ? selectedItem.dateFin.split('/').reverse().join('-') : '',
      statut: isEditing && selectedItem ? selectedItem.statut : 'Actif'
    }
  });

  // Soumission du formulaire
  const handleSubmit = (data: any) => {
    // Convertir les dates au format DD/MM/YYYY pour l'affichage
    const formattedData = {
      ...data,
      dateDebut: data.dateDebut.split('-').reverse().join('/'),
      dateFin: data.dateFin.split('-').reverse().join('/')
    };
    
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la session</FormLabel>
              <FormControl>
                <Input placeholder="ex: Année scolaire 2024-2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateDebut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateFin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="statut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default SessionForm;
