
import React from 'react';
import {
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
import { Control } from "react-hook-form";

interface StatutSelectProps {
  control: Control<any>;
}

const StatutSelect: React.FC<StatutSelectProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="statut"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Statut</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="CONFIRMEE">Confirmée</SelectItem>
              <SelectItem value="EN_ATTENTE">En attente</SelectItem>
              <SelectItem value="ANNULEE">Annulée</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatutSelect;
