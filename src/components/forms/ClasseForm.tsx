
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
import { Classe, Specialite } from "@/types/academic";

interface ClasseFormProps {
  isEditing: boolean;
  selectedClasse: Classe | null;
  specialites: Specialite[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ClasseForm: React.FC<ClasseFormProps> = ({
  isEditing,
  selectedClasse,
  specialites,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedClasse ? selectedClasse.nom : '',
      description: isEditing && selectedClasse ? selectedClasse.description : '',
      specialite: isEditing && selectedClasse ? selectedClasse.specialite.toString() : '',
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      specialite: parseInt(data.specialite)
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
              <FormLabel>Nom de la classe</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Terminale S" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spécialité</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {specialites.map((specialite) => (
                    <SelectItem key={specialite.id} value={specialite.id.toString()}>
                      {specialite.nom}
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
                <Textarea {...field} placeholder="Description de la classe" />
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

export default ClasseForm;
