
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
import { Salle, Batiment } from "@/types/infrastructure";

interface SalleFormProps {
  isEditing: boolean;
  selectedItem: Salle | null;
  batiments: Batiment[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SalleForm: React.FC<SalleFormProps> = ({
  isEditing,
  selectedItem,
  batiments,
  onSubmit,
  onCancel
}) => {
  const selectedSalle = selectedItem as Salle | null;
  
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedSalle ? selectedSalle.nom : '',
      capacite: isEditing && selectedSalle ? selectedSalle.capacite.toString() : '',
      batiment: isEditing && selectedSalle ? selectedSalle.batiment.toString() : '',
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      capacite: parseInt(data.capacite),
      batiment: parseInt(data.batiment)
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
              <FormLabel>Nom de la salle</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Salle 101" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacité</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="30" min="1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="batiment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bâtiment</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un bâtiment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {batiments.map((batiment) => (
                    <SelectItem key={batiment.id} value={batiment.id.toString()}>
                      {batiment.nom}
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

export default SalleForm;
