
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PaiementSalaire, PersonnelMember } from '../types';
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

const formSchema = z.object({
  personnel_id: z.string().min(1, "Le membre du personnel est requis"),
  nom_complet: z.string().min(1, "Le nom complet est requis"),
  mois: z.string().min(1, "Le mois est requis"),
  annee: z.string().min(1, "L'année est requise"),
  montant_base: z.string().min(1, "Le montant de base est requis"),
  primes: z.string().default("0"),
  deductions: z.string().default("0"),
  methode_paiement: z.string().min(1, "La méthode de paiement est requise"),
  statut: z.enum(["Payé", "En attente", "Annulé"]).default("En attente"),
});

const moisOptions = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" }
];

const getMoisLabel = (value: string) => {
  return moisOptions.find(option => option.value === value)?.label || value;
};

const getYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push(i.toString());
  }
  return years;
};

interface PaiementFormProps {
  paiement?: PaiementSalaire;
  personnel: PersonnelMember[];
  onSubmit: (data: PaiementSalaire) => void;
  onCancel: () => void;
}

const PaiementForm: React.FC<PaiementFormProps> = ({
  paiement,
  personnel,
  onSubmit,
  onCancel
}) => {
  const [montantBase, setMontantBase] = useState(paiement?.montant_base || 0);
  const [primes, setPrimes] = useState(paiement?.primes || 0);
  const [deductions, setDeductions] = useState(paiement?.deductions || 0);
  const [montantFinal, setMontantFinal] = useState(paiement?.montant_final || 0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: paiement ? {
      personnel_id: paiement.personnel_id,
      nom_complet: paiement.nom_complet,
      mois: paiement.mois,
      annee: paiement.annee,
      montant_base: paiement.montant_base.toString(),
      primes: paiement.primes.toString(),
      deductions: paiement.deductions.toString(),
      methode_paiement: paiement.methode_paiement,
      statut: paiement.statut
    } : {
      personnel_id: "",
      nom_complet: "",
      mois: new Date().getMonth().toString().padStart(2, '0'),
      annee: new Date().getFullYear().toString(),
      montant_base: "",
      primes: "0",
      deductions: "0",
      methode_paiement: "Virement",
      statut: "En attente"
    }
  });

  const handlePersonnelChange = (personnelId: string) => {
    const selectedPersonnel = personnel.find(p => p.id === personnelId);
    if (selectedPersonnel) {
      form.setValue("nom_complet", `${selectedPersonnel.prenom} ${selectedPersonnel.nom}`);
    }
    form.setValue("personnel_id", personnelId);
  };

  const updateMontantFinal = (base: number, prime: number, deduction: number) => {
    const final = base + prime - deduction;
    setMontantFinal(final);
  };

  const handleMontantBaseChange = (value: string) => {
    const montant = parseFloat(value) || 0;
    setMontantBase(montant);
    form.setValue("montant_base", value);
    updateMontantFinal(montant, primes, deductions);
  };

  const handlePrimesChange = (value: string) => {
    const prime = parseFloat(value) || 0;
    setPrimes(prime);
    form.setValue("primes", value);
    updateMontantFinal(montantBase, prime, deductions);
  };

  const handleDeductionsChange = (value: string) => {
    const deduction = parseFloat(value) || 0;
    setDeductions(deduction);
    form.setValue("deductions", value);
    updateMontantFinal(montantBase, primes, deduction);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: paiement?.id || Math.random().toString(36).substring(2, 11),
      personnel_id: values.personnel_id,
      nom_complet: values.nom_complet,
      mois: getMoisLabel(values.mois),
      annee: values.annee,
      montant_base: parseFloat(values.montant_base) || 0,
      primes: parseFloat(values.primes) || 0,
      deductions: parseFloat(values.deductions) || 0,
      montant_final: montantFinal,
      date_paiement: values.statut === "Payé" ? new Date().toLocaleDateString('fr-FR') : "",
      methode_paiement: values.methode_paiement,
      statut: values.statut,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="personnel_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personnel</FormLabel>
              <Select 
                onValueChange={(value) => handlePersonnelChange(value)} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une personne" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {personnel.map(personne => (
                    <SelectItem key={personne.id} value={personne.id}>
                      {personne.prenom} {personne.nom}
                    </SelectItem>
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
            name="mois"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mois</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mois" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moisOptions.map((mois) => (
                      <SelectItem key={mois.value} value={mois.value}>
                        {mois.label}
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
            name="annee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Année</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une année" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getYears().map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
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
          name="montant_base"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire de base</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Montant en FCFA" 
                  {...field}
                  onChange={(e) => handleMontantBaseChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="primes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primes</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Montant en FCFA" 
                    {...field}
                    onChange={(e) => handlePrimesChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deductions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Déductions</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Montant en FCFA"
                    {...field}
                    onChange={(e) => handleDeductionsChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Montant final:</span>
            <span className="text-xl font-bold">{montantFinal.toLocaleString()} FCFA</span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="methode_paiement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Méthode de paiement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Virement">Virement bancaire</SelectItem>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Chèque">Chèque</SelectItem>
                  <SelectItem value="Mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut de paiement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Payé">Payé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {paiement ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaiementForm;
