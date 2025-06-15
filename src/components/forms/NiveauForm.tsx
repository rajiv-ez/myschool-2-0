
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';

const niveauSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
});

type NiveauFormData = z.infer<typeof niveauSchema>;

interface NiveauFormProps {
  isEditing?: boolean;
  selectedItem?: any;
  onSubmit: (data: NiveauFormData) => void;
  onCancel: () => void;
}

const NiveauForm: React.FC<NiveauFormProps> = ({
  isEditing = false,
  selectedItem,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NiveauFormData>({
    resolver: zodResolver(niveauSchema),
    defaultValues: selectedItem ? {
      nom: selectedItem.nom,
      description: selectedItem.description || '',
    } : {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom du niveau *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Maternelle, Primaire..."
        />
        {errors.nom && (
          <p className="text-sm text-destructive">{errors.nom.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description du niveau d'enseignement"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
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

export default NiveauForm;
