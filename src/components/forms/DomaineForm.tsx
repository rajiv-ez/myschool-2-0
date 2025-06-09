
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Domaine } from "@/types/teaching";

interface DomaineFormProps {
  isEditing: boolean;
  selectedDomaine: Domaine | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DomaineForm: React.FC<DomaineFormProps> = ({
  isEditing,
  selectedDomaine,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedDomaine ? selectedDomaine.nom : '',
      description: isEditing && selectedDomaine ? selectedDomaine.description : '',
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du domaine</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Sciences Exactes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description du domaine d'enseignement" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DomaineForm;
