
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

interface EleveWithUserInfo {
  id: number;
  user: number;
  matricule: string;
  nom: string;
  prenom: string;
  fullName: string;
}

interface EleveSelectProps {
  control: Control<any>;
  elevesWithUserInfo: EleveWithUserInfo[];
}

const EleveSelect: React.FC<EleveSelectProps> = ({
  control,
  elevesWithUserInfo
}) => {
  return (
    <FormField
      control={control}
      name="eleve"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Élève</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élève" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {elevesWithUserInfo.map((eleve) => (
                <SelectItem key={eleve.id} value={eleve.id.toString()}>
                  {eleve.fullName} ({eleve.matricule})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Sélectionnez l'élève à inscrire
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EleveSelect;
