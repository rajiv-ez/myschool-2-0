
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

const matiereSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  unite: z.number().min(1, 'L\'unité est requise'),
  coefficient: z.number().min(1, 'Le coefficient doit être supérieur à 0').max(10, 'Le coefficient ne peut pas dépasser 10'),
  description: z.string().min(1, 'La description est requise'),
});

type MatiereFormData = z.infer<typeof matiereSchema>;

interface MatiereFormProps {
  isEditing?: boolean;
  selectedItem?: any;
  onSubmit: (data: MatiereFormData) => void;
  onCancel: () => void;
  unites: any[];
}

const MatiereForm: React.FC<MatiereFormProps> = ({
  isEditing = false,
  selectedItem,
  onSubmit,
  onCancel,
  unites
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MatiereFormData>({
    resolver: zodResolver(matiereSchema),
    defaultValues: selectedItem ? {
      nom: selectedItem.nom,
      unite: selectedItem.unite,
      coefficient: selectedItem.coefficient,
      description: selectedItem.description,
    } : {}
  });

  const selectedUnite = watch('unite');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de la matière *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Algèbre, Géométrie..."
        />
        {errors.nom && (
          <p className="text-sm text-destructive">{errors.nom.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Unité d'enseignement *</Label>
        <Select 
          value={selectedUnite?.toString()} 
          onValueChange={(value) => setValue('unite', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une unité" />
          </SelectTrigger>
          <SelectContent>
            {unites.map(unite => (
              <SelectItem key={unite.id} value={unite.id.toString()}>
                {unite.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unite && (
          <p className="text-sm text-destructive">{errors.unite.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coefficient">Coefficient *</Label>
        <Input
          id="coefficient"
          type="number"
          min={1}
          max={10}
          {...register('coefficient', { valueAsNumber: true })}
          placeholder="Ex: 3"
        />
        {errors.coefficient && (
          <p className="text-sm text-destructive">{errors.coefficient.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description de la matière"
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

export default MatiereForm;
