
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Session } from '@/types/academic';

const sessionSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  debut: z.string().min(1, 'La date de début est requise'),
  fin: z.string().min(1, 'La date de fin est requise'),
  en_cours: z.boolean().default(false),
  auto_activer_palier: z.boolean().default(true),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  session?: Session;
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function SessionForm({ session, onSubmit, onCancel, isSubmitting = false }: SessionFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: session ? {
      nom: session.nom,
      debut: session.debut,
      fin: session.fin,
      en_cours: session.en_cours,
      auto_activer_palier: session.auto_activer_palier,
    } : {
      en_cours: false,
      auto_activer_palier: true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom de la session *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Année scolaire 2024-2025"
          className={errors.nom ? 'border-red-500' : ''}
        />
        {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>}
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

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="en_cours"
            checked={watch('en_cours')}
            onCheckedChange={(checked) => setValue('en_cours', !!checked)}
          />
          <Label htmlFor="en_cours">Session en cours</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="auto_activer_palier"
            checked={watch('auto_activer_palier')}
            onCheckedChange={(checked) => setValue('auto_activer_palier', !!checked)}
          />
          <Label htmlFor="auto_activer_palier">Activer automatiquement les paliers</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : session ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
