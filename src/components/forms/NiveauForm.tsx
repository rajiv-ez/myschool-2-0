
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
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Niveau } from "@/types/academic";

interface NiveauFormProps {
  isEditing: boolean;
  selectedNiveau: Niveau | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NiveauForm: React.FC<NiveauFormProps> = ({
  isEditing,
  selectedNiveau,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedNiveau ? selectedNiveau.nom : '',
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
              <FormLabel>Nom du niveau</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Primaire" />
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

export default NiveauForm;
