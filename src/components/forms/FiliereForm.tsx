
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
import { Filiere, Niveau } from "@/types/academic";

interface FiliereFormProps {
  isEditing: boolean;
  selectedFiliere: Filiere | null;
  niveaux: Niveau[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const FiliereForm: React.FC<FiliereFormProps> = ({
  isEditing,
  selectedFiliere,
  niveaux,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedFiliere ? selectedFiliere.nom : '',
      description: isEditing && selectedFiliere ? selectedFiliere.description : '',
      niveau: isEditing && selectedFiliere ? selectedFiliere.niveau.toString() : '',
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      niveau: parseInt(data.niveau)
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
              <FormLabel>Nom de la filière</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Scientifique" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="niveau"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {niveaux.map((niveau) => (
                    <SelectItem key={niveau.id} value={niveau.id.toString()}>
                      {niveau.nom}
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
                <Textarea {...field} placeholder="Description de la filière" />
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

export default FiliereForm;
