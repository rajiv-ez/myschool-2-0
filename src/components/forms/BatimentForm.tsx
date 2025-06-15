
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Batiment, Succursale } from "@/types/infrastructure";

interface BatimentFormProps {
  isEditing: boolean;
  selectedItem: Batiment | null;
  succursales: Succursale[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BatimentForm: React.FC<BatimentFormProps> = ({
  isEditing,
  selectedItem,
  succursales,
  onSubmit,
  onCancel
}) => {
  const selectedBatiment = selectedItem as Batiment | null;
  
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedBatiment ? selectedBatiment.nom : '',
      succursale: isEditing && selectedBatiment ? selectedBatiment.succursale.toString() : '',
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      succursale: parseInt(data.succursale)
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
              <FormLabel>Nom du bâtiment</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Bâtiment A" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="succursale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Succursale</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une succursale" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {succursales.map((succursale) => (
                    <SelectItem key={succursale.id} value={succursale.id.toString()}>
                      {succursale.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default BatimentForm;
