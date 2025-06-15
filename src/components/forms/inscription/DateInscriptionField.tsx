
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface DateInscriptionFieldProps {
  control: Control<any>;
}

const DateInscriptionField: React.FC<DateInscriptionFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="date_inscription"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date d'inscription</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateInscriptionField;
