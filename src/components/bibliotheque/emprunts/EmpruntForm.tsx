
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Emprunt, Livre } from '../types';

const formSchema = z.object({
  livre_id: z.number(),
  titre: z.string(),
  emprunteur: z.string().min(1, "Le nom de l'emprunteur est requis"),
  classe: z.string().min(1, "La classe est requise"),
  date_emprunt: z.string().min(1, "La date d'emprunt est requise"),
  date_retour_prevue: z.string().min(1, "La date de retour prévue est requise"),
});

const classes = [
  "CP", "CE1", "CE2", "CM1", "CM2", 
  "6ème", "5ème", "4ème", "3ème", 
  "Seconde", "Première", "Terminale",
  "Personnel"
];

interface EmpruntFormProps {
  emprunt?: Emprunt;
  livres: Livre[];
  onSubmit: (data: Emprunt) => void;
  onCancel: () => void;
}

const EmpruntForm: React.FC<EmpruntFormProps> = ({
  emprunt,
  livres,
  onSubmit,
  onCancel
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: emprunt ? {
      livre_id: emprunt.livre_id,
      titre: emprunt.titre,
      emprunteur: emprunt.emprunteur,
      classe: emprunt.classe,
      date_emprunt: emprunt.date_emprunt,
      date_retour_prevue: emprunt.date_retour_prevue,
    } : {
      livre_id: 0,
      titre: "",
      emprunteur: "",
      classe: "",
      date_emprunt: format(new Date(), "yyyy-MM-dd"),
      date_retour_prevue: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    }
  });

  const handleLivreChange = (livreId: string) => {
    const id = parseInt(livreId);
    const selectedLivre = livres.find(l => l.id === id);
    if (selectedLivre) {
      form.setValue("livre_id", id);
      form.setValue("titre", selectedLivre.titre);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: emprunt?.id || Math.floor(Math.random() * 10000),
      livre_id: values.livre_id,
      titre: values.titre,
      emprunteur: values.emprunteur,
      classe: values.classe,
      date_emprunt: values.date_emprunt,
      date_retour_prevue: values.date_retour_prevue,
      date_retour_reelle: emprunt?.date_retour_reelle || null,
      statut: emprunt?.statut || 'En cours',
    });
  };

  // Filter only available books
  const availableLivres = emprunt 
    ? [...livres.filter(l => l.disponible), ...(livres.filter(l => l.id === emprunt.livre_id))]
    : livres.filter(l => l.disponible);

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
                onValueChange={(value) => handleLivreChange(value)} 
                defaultValue={field.value ? field.value.toString() : undefined}
                disabled={emprunt !== undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un livre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableLivres.map(livre => (
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
          name="emprunteur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'emprunteur</FormLabel>
              <FormControl>
                <Input placeholder="Nom et prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="classe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map(classe => (
                    <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_emprunt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date d'emprunt</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={
                          "pl-3 text-left font-normal flex justify-between items-center"
                        }
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date_retour_prevue"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de retour prévue</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={
                          "pl-3 text-left font-normal flex justify-between items-center"
                        }
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {emprunt ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmpruntForm;
