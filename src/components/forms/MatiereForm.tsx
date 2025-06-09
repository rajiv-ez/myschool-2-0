
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
import { Matiere, UniteEnseignement } from "@/types/teaching";

interface MatiereFormProps {
  isEditing: boolean;
  selectedMatiere: Matiere | null;
  unites: UniteEnseignement[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MatiereForm: React.FC<MatiereFormProps> = ({
  isEditing,
  selectedMatiere,
  unites,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedMatiere ? selectedMatiere.nom : '',
      description: isEditing && selectedMatiere ? selectedMatiere.description : '',
      coefficient: isEditing && selectedMatiere ? selectedMatiere.coefficient.toString() : '',
      unite: isEditing && selectedMatiere ? selectedMatiere.unite.toString() : '',
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      coefficient: parseInt(data.coefficient),
      unite: parseInt(data.unite)
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
              <FormLabel>Nom de la matière</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Algèbre" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unité d'enseignement</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une unité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {unites.map((unite) => (
                    <SelectItem key={unite.id} value={unite.id.toString()}>
                      {unite.nom}
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
          name="coefficient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coefficient</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="3" min="1" max="10" />
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
                <Textarea {...field} placeholder="Description de la matière" />
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

export default MatiereForm;
