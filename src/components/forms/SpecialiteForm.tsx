
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

const specialiteSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  filiere: z.number().min(1, 'La filière est requise'),
  description: z.string().min(1, 'La description est requise'),
});

type SpecialiteFormData = z.infer<typeof specialiteSchema>;

interface SpecialiteFormProps {
  isEditing?: boolean;
  selectedItem?: any;
  onSubmit: (data: SpecialiteFormData) => void;
  onCancel: () => void;
  filieres: any[];
}

const SpecialiteForm: React.FC<SpecialiteFormProps> = ({
  isEditing = false,
  selectedItem,
  onSubmit,
  onCancel,
  filieres
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SpecialiteFormData>({
    resolver: zodResolver(specialiteSchema),
    defaultValues: selectedItem ? {
      nom: selectedItem.nom,
      filiere: selectedItem.filiere,
      description: selectedItem.description,
    } : {}
  });

  const selectedFiliere = watch('filiere');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de la spécialité *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Mathématiques-Physique..."
        />
        {errors.nom && (
          <p className="text-sm text-destructive">{errors.nom.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Filière *</Label>
        <Select 
          value={selectedFiliere?.toString()} 
          onValueChange={(value) => setValue('filiere', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une filière" />
          </SelectTrigger>
          <SelectContent>
            {filieres.map(filiere => (
              <SelectItem key={filiere.id} value={filiere.id.toString()}>
                {filiere.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.filiere && (
          <p className="text-sm text-destructive">{errors.filiere.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description de la spécialité"
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

export default SpecialiteForm;
