
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

const palierSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  session: z.number().min(1, 'La session est requise'),
  debut: z.string().min(1, 'La date de début est requise'),
  fin: z.string().min(1, 'La date de fin est requise'),
  en_cours: z.boolean(),
});

type PalierFormData = z.infer<typeof palierSchema>;

interface PalierFormProps {
  isEditing?: boolean;
  selectedItem?: any;
  onSubmit: (data: PalierFormData) => void;
  onCancel: () => void;
  sessions: any[];
}

const PalierForm: React.FC<PalierFormProps> = ({
  isEditing = false,
  selectedItem,
  onSubmit,
  onCancel,
  sessions
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PalierFormData>({
    resolver: zodResolver(palierSchema),
    defaultValues: selectedItem ? {
      nom: selectedItem.nom,
      session: selectedItem.session,
      debut: selectedItem.debut,
      fin: selectedItem.fin,
      en_cours: selectedItem.en_cours || false,
    } : {
      en_cours: false,
    }
  });

  const selectedSession = watch('session');
  const enCours = watch('en_cours');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom du palier *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Trimestre 1, Semestre 1..."
        />
        {errors.nom && (
          <p className="text-sm text-destructive">{errors.nom.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Session *</Label>
        <Select 
          value={selectedSession?.toString()} 
          onValueChange={(value) => setValue('session', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une session" />
          </SelectTrigger>
          <SelectContent>
            {sessions.map(session => (
              <SelectItem key={session.id} value={session.id.toString()}>
                {session.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.session && (
          <p className="text-sm text-destructive">{errors.session.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="debut">Date de début *</Label>
          <Input
            id="debut"
            type="date"
            {...register('debut')}
          />
          {errors.debut && (
            <p className="text-sm text-destructive">{errors.debut.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fin">Date de fin *</Label>
          <Input
            id="fin"
            type="date"
            {...register('fin')}
          />
          {errors.fin && (
            <p className="text-sm text-destructive">{errors.fin.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="en_cours"
          checked={enCours}
          onCheckedChange={(checked) => setValue('en_cours', checked as boolean)}
        />
        <Label htmlFor="en_cours" className="text-sm font-normal">
          Palier en cours
        </Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {isEditing ? 'Modifier' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PalierForm;
