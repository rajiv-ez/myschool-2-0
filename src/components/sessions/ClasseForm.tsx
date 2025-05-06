
import React from 'react';
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

// Type pour les sessions
interface Session {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  paliers: number;
}

// Type pour les classes académiques
interface ClasseAcademique {
  id: number;
  classe: string;
  session: string;
  enseignant: string;
  eleves: number;
  capacite: number;
  statut: string;
}

interface ClasseFormProps {
  isEditing: boolean;
  selectedItem: ClasseAcademique | null;
  sessions: Session[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ClasseForm: React.FC<ClasseFormProps> = ({
  isEditing,
  selectedItem,
  sessions,
  onSubmit,
  onCancel
}) => {
  // Initialiser le formulaire
  const form = useForm({
    defaultValues: {
      classe: isEditing && selectedItem ? selectedItem.classe : '',
      session: isEditing && selectedItem ? selectedItem.session : sessions.find(s => s.statut === 'Actif')?.nom || '',
      enseignant: isEditing && selectedItem ? selectedItem.enseignant : '',
      capacite: isEditing && selectedItem ? selectedItem.capacite : 30,
      statut: isEditing && selectedItem ? selectedItem.statut : 'Actif'
    }
  });

  // Soumission du formulaire
  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      capacite: parseInt(data.capacite)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="classe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une classe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CP">CP</SelectItem>
                  <SelectItem value="CE1">CE1</SelectItem>
                  <SelectItem value="CE2">CE2</SelectItem>
                  <SelectItem value="CM1">CM1</SelectItem>
                  <SelectItem value="CM2">CM2</SelectItem>
                  <SelectItem value="6ème">6ème</SelectItem>
                  <SelectItem value="5ème">5ème</SelectItem>
                  <SelectItem value="4ème">4ème</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="session"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isEditing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une session" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session.id} value={session.nom}>
                      {session.nom}
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
          name="enseignant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enseignant principal</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'enseignant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="capacite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacité d'accueil</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="100" 
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
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
              <FormLabel>Statut</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ClasseForm;
