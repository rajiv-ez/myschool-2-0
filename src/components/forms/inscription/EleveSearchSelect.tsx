
import React, { useState } from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

interface EleveWithUserInfo {
  id: number;
  user: number;
  matricule: string;
  nom: string;
  prenom: string;
  fullName: string;
}

interface EleveSearchSelectProps {
  control: Control<any>;
  elevesWithUserInfo: EleveWithUserInfo[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const EleveSearchSelect: React.FC<EleveSearchSelectProps> = ({
  control,
  elevesWithUserInfo,
  onValueChange,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="eleve"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Élève</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? elevesWithUserInfo.find(
                        (eleve) => eleve.id.toString() === field.value
                      )?.fullName + " (" + elevesWithUserInfo.find(
                        (eleve) => eleve.id.toString() === field.value
                      )?.matricule + ")"
                    : "Sélectionner un élève..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un élève..." />
                <CommandList>
                  <CommandEmpty>Aucun élève trouvé.</CommandEmpty>
                  <CommandGroup>
                    {elevesWithUserInfo.map((eleve) => (
                      <CommandItem
                        key={eleve.id}
                        value={`${eleve.fullName} ${eleve.matricule}`}
                        onSelect={() => {
                          const value = eleve.id.toString();
                          field.onChange(value);
                          onValueChange(value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === eleve.id.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{eleve.fullName}</span>
                          <span className="text-sm text-muted-foreground">
                            Matricule: {eleve.matricule}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Recherchez par nom, prénom ou matricule
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EleveSearchSelect;
