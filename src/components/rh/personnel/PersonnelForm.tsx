
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PersonnelMember } from '../types';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle2 } from 'lucide-react';

const formSchema = z.object({
  photo: z.string().optional(),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  dateNaissance: z.string(),
  lieuNaissance: z.string(),
  genre: z.enum(["Masculin", "Féminin", "Autre"]),
  adresse: z.string(),
  tel1: z.string().min(1, "Le téléphone principal est requis"),
  tel2: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email invalide"),
  poste: z.string().min(1, "Le poste est requis"),
  matieres: z.array(z.string()).default([]),
  niveaux: z.array(z.string()).default([]),
  statut: z.enum(["Actif", "En congé", "Suspendu", "Inactif"]).default("Actif"),
  date_embauche: z.string(),
});

interface PersonnelFormProps {
  personnel?: PersonnelMember;
  onSubmit: (data: PersonnelMember) => void;
  onCancel: () => void;
}

const postes = [
  "Enseignant", "Directeur", "Secrétaire", "Comptable", 
  "Surveillant", "Agent d'entretien", "Bibliothécaire", 
  "Conseiller pédagogique", "Informaticien"
];

const matieres = [
  "Mathématiques", "Français", "Anglais", "Histoire-Géographie", 
  "Sciences", "Physique-Chimie", "SVT", "Informatique", 
  "Éducation physique", "Arts plastiques", "Musique", "Philosophie"
];

const niveaux = [
  "Maternelle", "CP", "CE1", "CE2", "CM1", "CM2",
  "6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale",
  "Primaire", "Collège", "Lycée"
];

const PersonnelForm: React.FC<PersonnelFormProps> = ({
  personnel,
  onSubmit,
  onCancel
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: personnel ? {
      ...personnel,
      matieres: personnel.matieres || [],
      niveaux: personnel.niveaux || []
    } : {
      nom: "",
      prenom: "",
      dateNaissance: "",
      lieuNaissance: "",
      genre: "Masculin",
      adresse: "",
      tel1: "",
      tel2: "",
      whatsapp: "",
      email: "",
      poste: "",
      matieres: [],
      niveaux: [],
      statut: "Actif",
      date_embauche: new Date().toISOString().split('T')[0],
    }
  });

  const isEnseignant = form.watch("poste") === "Enseignant";

  const handleSelectMultiple = (field: "matieres" | "niveaux", value: string) => {
    const currentValues = form.getValues(field);
    if (currentValues.includes(value)) {
      form.setValue(field, currentValues.filter(v => v !== value));
    } else {
      form.setValue(field, [...currentValues, value]);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Make sure all required fields are included with proper types
    onSubmit({
      id: personnel?.id || Math.random().toString(36).substring(2, 11),
      nom: values.nom,
      prenom: values.prenom,
      dateNaissance: values.dateNaissance,
      lieuNaissance: values.lieuNaissance,
      genre: values.genre,
      adresse: values.adresse,
      tel1: values.tel1,
      tel2: values.tel2,
      whatsapp: values.whatsapp,
      email: values.email,
      poste: values.poste,
      matieres: values.matieres,
      niveaux: values.niveaux,
      statut: values.statut,
      date_embauche: values.date_embauche,
      photo: values.photo,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs defaultValue="infos" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="poste">Poste & Compétences</TabsTrigger>
          </TabsList>

          <TabsContent value="infos" className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-2">
                <UserCircle2 className="h-16 w-16 text-muted-foreground" />
              </div>
              <Button type="button" variant="outline" size="sm">Changer la photo</Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateNaissance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lieuNaissance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu de naissance</FormLabel>
                    <FormControl>
                      <Input placeholder="Lieu de naissance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Masculin">Masculin</SelectItem>
                      <SelectItem value="Féminin">Féminin</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tel1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone principal</FormLabel>
                    <FormControl>
                      <Input placeholder="074 XX XX XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tel2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone secondaire (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="066 XX XX XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro WhatsApp (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro WhatsApp avec indicatif" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="poste" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="poste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un poste" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {postes.map(poste => (
                          <SelectItem key={poste} value={poste}>{poste}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_embauche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'embauche</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEnseignant && (
              <>
                <FormField
                  control={form.control}
                  name="matieres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matières enseignées</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {matieres.map(matiere => (
                          <Button
                            key={matiere}
                            type="button"
                            variant={field.value.includes(matiere) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSelectMultiple("matieres", matiere)}
                          >
                            {matiere}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="niveaux"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveaux enseignés</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {niveaux.map(niveau => (
                          <Button
                            key={niveau}
                            type="button"
                            variant={field.value.includes(niveau) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSelectMultiple("niveaux", niveau)}
                          >
                            {niveau}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="En congé">En congé</SelectItem>
                      <SelectItem value="Suspendu">Suspendu</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {personnel ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonnelForm;
