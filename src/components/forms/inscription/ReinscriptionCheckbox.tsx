
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control } from "react-hook-form";

interface ReinscriptionCheckboxProps {
  control: Control<any>;
  isReinscription: boolean;
}

const ReinscriptionCheckbox: React.FC<ReinscriptionCheckboxProps> = ({ 
  control, 
  isReinscription 
}) => {
  return (
    <FormField
      control={control}
      name="est_reinscription"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={isReinscription}
              disabled={true}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={isReinscription ? "text-primary font-medium" : ""}>
              Réinscription
            </FormLabel>
            <FormDescription>
              {isReinscription 
                ? "Cet élève a déjà été inscrit précédemment" 
                : "Première inscription de cet élève"
              }
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};

export default ReinscriptionCheckbox;
