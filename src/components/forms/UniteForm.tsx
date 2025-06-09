
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
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { UniteEnseignement, Domaine } from "@/types/teaching";

interface UniteFormProps {
  isEditing: boolean;
  selectedUnite: UniteEnseignement | null;
  domaines: Domaine[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const UniteForm: React.FC<UniteFormProps> = ({
  isEditing,
  selectedUnite,
  domaines,
  onSubmit,
  onCancel
}) => {
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedUnite ? selectedUnite.nom : '',
      description: isEditing && selectedUnite ? selectedUnite.description : '',
      domaines: isEditing && selectedUnite ? selectedUnite.domaines : [],
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
              <FormLabel>Nom de l'unité</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Mathématiques" />
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
                <Textarea {...field} placeholder="Description de l'unité d'enseignement" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domaines"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Domaines</FormLabel>
              </div>
              {domaines.map((domaine) => (
                <FormField
                  key={domaine.id}
                  control={form.control}
                  name="domaines"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={domaine.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(domaine.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, domaine.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== domaine.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {domaine.nom}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
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

export default UniteForm;
