
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Specialite, Filiere } from "@/types/academic";

interface SpecialiteFormProps {
  isEditing: boolean;
  selectedSpecialite: Specialite | null;
  filieres: Filiere[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SpecialiteForm: React.FC<SpecialiteFormProps> = ({
  isEditing,
  selectedSpecialite,
  filieres,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedSpecialite ? selectedSpecialite.nom : '',
      description: isEditing && selectedSpecialite ? selectedSpecialite.description : '',
      filiere: isEditing && selectedSpecialite ? selectedSpecialite.filiere.toString() : '',
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      filiere: parseInt(data.filiere)
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la spécialité</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Mathématiques-Physique" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filiere"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filière</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une filière" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filieres.map((filiere) => (
                    <SelectItem key={filiere.id} value={filiere.id.toString()}>
                      {filiere.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Textarea {...field} placeholder="Description de la spécialité" />
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

export default SpecialiteForm;
