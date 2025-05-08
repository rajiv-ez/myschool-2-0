
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
import { Input } from "@/components/ui/input";
import { Livre } from '../types';

const formSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  auteur: z.string().min(1, "L'auteur est requis"),
  categorie: z.string().min(1, "La catégorie est requise"),
  isbn: z.string().optional(),
  etat: z.string().min(1, "L'état est requis"),
});

const categories = [
  "Roman", "Conte", "Fantasy", "Jeunesse", "Référence", "Science-fiction", 
  "Policier", "Histoire", "Biographie", "Poésie", "Théâtre", "Essai"
];

const etats = ["Neuf", "Bon état", "Usé", "Abîmé"];

interface LivreFormProps {
  livre?: Livre;
  onSubmit: (data: Livre) => void;
  onCancel: () => void;
}

const LivreForm: React.FC<LivreFormProps> = ({
  livre,
  onSubmit,
  onCancel
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: livre ? {
      titre: livre.titre,
      auteur: livre.auteur,
      categorie: livre.categorie,
      isbn: livre.isbn,
      etat: livre.etat,
    } : {
      titre: "",
      auteur: "",
      categorie: "",
      isbn: "",
      etat: "Bon état",
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: livre?.id || Math.floor(Math.random() * 10000),
      titre: values.titre,
      auteur: values.auteur,
      categorie: values.categorie,
      isbn: values.isbn || "",
      etat: values.etat,
      date_ajout: livre?.date_ajout || new Date().toLocaleDateString('fr-FR'),
      disponible: livre?.disponible !== undefined ? livre.disponible : true,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du livre</FormLabel>
              <FormControl>
                <Input placeholder="Titre du livre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="auteur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'auteur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categorie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(categorie => (
                      <SelectItem key={categorie} value={categorie}>{categorie}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="etat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>État</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {etats.map(etat => (
                      <SelectItem key={etat} value={etat}>{etat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Numéro ISBN" {...field} />
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
            {livre ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LivreForm;
