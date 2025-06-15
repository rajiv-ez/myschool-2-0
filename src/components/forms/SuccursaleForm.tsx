
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
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Succursale } from "@/types/infrastructure";

interface SuccursaleFormProps {
  isEditing: boolean;
  selectedItem: Succursale | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SuccursaleForm: React.FC<SuccursaleFormProps> = ({
  isEditing,
  selectedItem,
  onSubmit,
  onCancel
}) => {
  const selectedSuccursale = selectedItem as Succursale | null;
  
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedSuccursale ? selectedSuccursale.nom : '',
      adresse: isEditing && selectedSuccursale ? selectedSuccursale.adresse : '',
      ville: isEditing && selectedSuccursale ? selectedSuccursale.ville : '',
      pays: isEditing && selectedSuccursale ? selectedSuccursale.pays : 'Gabon',
      est_siege: isEditing && selectedSuccursale ? selectedSuccursale.est_siege : false,
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la succursale</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Campus Principal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123 Avenue de l'Éducation" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ville"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Libreville" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Gabon" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="est_siege"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Siège social</FormLabel>
              </div>
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

export default SuccursaleForm;
