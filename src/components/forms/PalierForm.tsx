
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Palier, Session } from '@/types/academic';

const palierSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  session: z.number().min(1, 'La session est requise'),
  debut: z.string().min(1, 'La date de début est requise'),
  fin: z.string().min(1, 'La date de fin est requise'),
  en_cours: z.boolean().default(false),
});

type PalierFormData = z.infer<typeof palierSchema>;

interface PalierFormProps {
  palier?: Palier;
  sessions: Session[];
  onSubmit: (data: PalierFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function PalierForm({ palier, sessions, onSubmit, onCancel, isSubmitting = false }: PalierFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PalierFormData>({
    resolver: zodResolver(palierSchema),
    defaultValues: palier ? {
      nom: palier.nom,
      session: palier.session,
      debut: palier.debut,
      fin: palier.fin,
      en_cours: palier.en_cours,
    } : {
      en_cours: false,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom du palier *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Trimestre 1"
          className={errors.nom ? 'border-red-500' : ''}
        />
        {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>}
      </div>

      <div>
        <Label htmlFor="session">Session *</Label>
        <Select onValueChange={(value) => setValue('session', parseInt(value))} defaultValue={watch('session')?.toString()}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une session" />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((session) => (
              <SelectItem key={session.id} value={session.id.toString()}>
                {session.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.session && <p className="text-sm text-red-500 mt-1">{errors.session.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="debut">Date de début *</Label>
          <Input
            id="debut"
            type="date"
            {...register('debut')}
            className={errors.debut ? 'border-red-500' : ''}
          />
          {errors.debut && <p className="text-sm text-red-500 mt-1">{errors.debut.message}</p>}
        </div>

        <div>
          <Label htmlFor="fin">Date de fin *</Label>
          <Input
            id="fin"
            type="date"
            {...register('fin')}
            className={errors.fin ? 'border-red-500' : ''}
          />
          {errors.fin && <p className="text-sm text-red-500 mt-1">{errors.fin.message}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="en_cours"
          checked={watch('en_cours')}
          onCheckedChange={(checked) => setValue('en_cours', !!checked)}
        />
        <Label htmlFor="en_cours">Palier en cours</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : palier ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
