
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';

const sessionSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  debut: z.string().min(1, 'La date de début est requise'),
  fin: z.string().min(1, 'La date de fin est requise'),
  en_cours: z.boolean(),
  auto_activer_palier: z.boolean(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  isEditing?: boolean;
  selectedItem?: any;
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  isEditing = false,
  selectedItem,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: selectedItem ? {
      nom: selectedItem.nom,
      debut: selectedItem.debut,
      fin: selectedItem.fin,
      en_cours: selectedItem.en_cours || false,
      auto_activer_palier: selectedItem.auto_activer_palier || false,
    } : {
      en_cours: false,
      auto_activer_palier: false,
    }
  });

  const enCours = watch('en_cours');
  const autoActiverPalier = watch('auto_activer_palier');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de la session *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Année scolaire 2024-2025"
        />
        {errors.nom && (
          <p className="text-sm text-destructive">{errors.nom.message}</p>
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

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="en_cours"
            checked={enCours}
            onCheckedChange={(checked) => setValue('en_cours', checked as boolean)}
          />
          <Label htmlFor="en_cours" className="text-sm font-normal">
            Session en cours
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="auto_activer_palier"
            checked={autoActiverPalier}
            onCheckedChange={(checked) => setValue('auto_activer_palier', checked as boolean)}
          />
          <Label htmlFor="auto_activer_palier" className="text-sm font-normal">
            Auto-activation des paliers
          </Label>
        </div>
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

export default SessionForm;
