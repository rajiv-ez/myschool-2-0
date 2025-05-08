
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DemandeEmprunt, Livre } from '../types';

const formSchema = z.object({
  livre_id: z.number().min(1, "Le livre est requis"),
  raison: z.string().min(1, "La raison est requise"),
});

const classes = [
  "CP", "CE1", "CE2", "CM1", "CM2", 
  "6ème", "5ème", "4ème", "3ème", 
  "Seconde", "Première", "Terminale"
];

interface DemandeEmpruntFormProps {
  livres: Livre[];
  onSubmit: (data: DemandeEmprunt) => void;
  onCancel: () => void;
}

const DemandeEmpruntForm: React.FC<DemandeEmpruntFormProps> = ({
  livres,
  onSubmit,
  onCancel
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      livre_id: 0,
      raison: "",
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedLivre = livres.find(l => l.id === values.livre_id);
    
    onSubmit({
      id: Math.floor(Math.random() * 10000),
      livre_id: values.livre_id,
      titre: selectedLivre ? selectedLivre.titre : "",
      eleve_id: "E001", // In a real app, this would be the logged-in user ID
      eleve_nom: "Marie Ndongo", // In a real app, this would be the logged-in user's name
      classe: "3ème", // In a real app, this would be the logged-in user's class
      date_demande: new Date().toISOString().split('T')[0],
      raison: values.raison,
      statut: "En attente",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="livre_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Livre</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value ? field.value.toString() : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un livre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {livres.map(livre => (
                    <SelectItem key={livre.id} value={livre.id.toString()}>
                      {livre.titre} - {livre.auteur}
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
          name="raison"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raison de l'emprunt</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Expliquez pourquoi vous souhaitez emprunter ce livre" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Envoyer la demande
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DemandeEmpruntForm;
