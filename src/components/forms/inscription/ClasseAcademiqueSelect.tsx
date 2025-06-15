
import React from 'react';
import {
  FormControl,
  FormDescription,
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
import { Control } from "react-hook-form";

interface ClasseAcademique {
  id: number;
  classe: string;
  session: string;
  enseignant: string;
  eleves: number;
  capacite: number;
  statut: string;
}

interface ClasseAcademiqueSelectProps {
  control: Control<any>;
  activeClassesAcademiques: ClasseAcademique[];
  onValueChange: (value: string) => void;
}

const ClasseAcademiqueSelect: React.FC<ClasseAcademiqueSelectProps> = ({
  control,
  activeClassesAcademiques,
  onValueChange
}) => {
  return (
    <FormField
      control={control}
      name="classeAcademiqueId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Classe académique</FormLabel>
          <Select 
            onValueChange={onValueChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe académique" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {activeClassesAcademiques.map((ca) => (
                <SelectItem key={ca.id} value={ca.id.toString()}>
                  {ca.classe} - {ca.session} ({ca.eleves}/{ca.capacite})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Sélectionnez la classe et la session pour cette inscription
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ClasseAcademiqueSelect;
