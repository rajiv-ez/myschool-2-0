
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Contrat, PersonnelMember, ContractClause } from '../types';
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from 'lucide-react';

const contractClauseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  order: z.number().optional(),
});

const formSchema = z.object({
  personnel_id: z.string().min(1, "Le personnel est requis"),
  nom_complet: z.string().min(1, "Le nom complet est requis"),
  type_contrat: z.string().min(1, "Le type de contrat est requis"),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().optional(),
  salaire: z.string().min(1, "Le salaire est requis"),
  statut: z.enum(["Actif", "Terminé", "Suspendu"]).default("Actif"),
  clauses: z.array(contractClauseSchema).optional(),
});

interface ContratFormProps {
  contrat?: Contrat;
  personnel: PersonnelMember[];
  onSubmit: (data: Contrat) => void;
  onCancel: () => void;
}

// Clauses standard de contrat
const clausesStandard: Omit<ContractClause, "id">[] = [
  {
    title: "Article 1 : Objet du contrat",
    content: "Le présent contrat a pour objet de définir les conditions d'emploi de l'employé(e) au sein de l'établissement scolaire.",
    order: 1,
  },
  {
    title: "Article 2 : Durée du contrat",
    content: "Le présent contrat prend effet à compter de la date de début mentionnée ci-dessus pour une durée indéterminée/déterminée selon le type de contrat sélectionné.",
    order: 2,
  },
  {
    title: "Article 3 : Période d'essai",
    content: "Le présent contrat est soumis à une période d'essai de trois mois à compter de la date d'embauche. Durant cette période, chacune des parties pourra mettre fin au contrat sans préavis ni indemnité.",
    order: 3,
  },
  {
    title: "Article 4 : Rémunération",
    content: "En contrepartie de son travail, l'employé(e) percevra une rémunération mensuelle brute selon le montant indiqué ci-dessus.",
    order: 4,
  },
  {
    title: "Article 5 : Horaires de travail",
    content: "L'employé(e) exercera ses fonctions selon les horaires établis par l'établissement scolaire, conformément au règlement intérieur et au calendrier scolaire en vigueur.",
    order: 5,
  },
  {
    title: "Article 6 : Obligations de l'employé(e)",
    content: "L'employé(e) s'engage à exécuter avec sérieux, loyauté et conscience professionnelle les tâches qui lui sont confiées. Il/Elle s'engage à respecter les règles de fonctionnement de l'établissement et à maintenir la confidentialité des informations dont il/elle pourrait avoir connaissance.",
    order: 6,
  },
];

const typeContrats = [
  "CDI", "CDD", "Stage", "Vacation", "Temps partiel"
];

const ContratForm: React.FC<ContratFormProps> = ({
  contrat,
  personnel,
  onSubmit,
  onCancel
}) => {
  const [clauses, setClauses] = useState<ContractClause[]>(
    contrat?.clauses || clausesStandard.map(clause => ({
      ...clause,
      id: Math.random().toString(36).substring(2, 11),
    }))
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: contrat ? {
      ...contrat,
      clauses: contrat.clauses || []
    } : {
      personnel_id: "",
      nom_complet: "",
      type_contrat: "CDI",
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: "",
      salaire: "",
      statut: "Actif",
      clauses: [],
    }
  });

  const handlePersonnelChange = (personnelId: string) => {
    const selectedPersonnel = personnel.find(p => p.id === personnelId);
    if (selectedPersonnel) {
      form.setValue("nom_complet", `${selectedPersonnel.prenom} ${selectedPersonnel.nom}`);
    }
    form.setValue("personnel_id", personnelId);
  };

  const addClause = () => {
    const newClause: ContractClause = {
      id: Math.random().toString(36).substring(2, 11),
      title: `Article ${clauses.length + 1}`,
      content: "",
      order: clauses.length + 1,
    };
    setClauses([...clauses, newClause]);
  };

  const removeClause = (id: string) => {
    setClauses(clauses.filter(clause => clause.id !== id));
  };

  const updateClause = (id: string, field: keyof ContractClause, value: string) => {
    setClauses(clauses.map(clause => 
      clause.id === id ? { ...clause, [field]: value } : clause
    ));
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: contrat?.id || Math.random().toString(36).substring(2, 11),
      ...values,
      clauses,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="type_contrat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de contrat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeContrats.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin (si CDD)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire</FormLabel>
                    <FormControl>
                      <Input placeholder="Montant en FCFA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut du contrat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                        <SelectItem value="Suspendu">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Clauses du contrat</h3>
                <Button type="button" size="sm" variant="outline" onClick={addClause}>
                  <Plus size={16} className="mr-1" /> Ajouter une clause
                </Button>
              </div>

              <div className="space-y-4 mt-4">
                {clauses.map((clause, index) => (
                  <div key={clause.id} className="space-y-2 border p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <Input
                        placeholder="Titre de la clause"
                        value={clause.title}
                        onChange={(e) => updateClause(clause.id, 'title', e.target.value)}
                        className="font-medium"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeClause(clause.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Contenu de la clause"
                      value={clause.content}
                      onChange={(e) => updateClause(clause.id, 'content', e.target.value)}
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {contrat ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContratForm;
