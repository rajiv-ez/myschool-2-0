
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';

const uniteSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  domaines: z.array(z.number()).min(1, 'Au moins un domaine doit être sélectionné'),
});

type UniteFormData = z.infer<typeof uniteSchema>;

interface UniteFormProps {
  isEditing?: boolean;
  selectedItem?: any;
  onSubmit: (data: UniteFormData) => void;
  onCancel: () => void;
  domaines: any[];
}

const UniteForm: React.FC<UniteFormProps> = ({
  isEditing = false,
  selectedItem,
  onSubmit,
  onCancel,
  domaines
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UniteFormData>({
    resolver: zodResolver(uniteSchema),
    defaultValues: selectedItem ? {
      nom: selectedItem.nom,
      description: selectedItem.description,
      domaines: selectedItem.domaines || [],
    } : {
      domaines: [],
    }
  });

  const selectedDomaines = watch('domaines') || [];

  const handleDomaineChange = (domaineId: number, checked: boolean) => {
    const currentDomaines = selectedDomaines;
    if (checked) {
      setValue('domaines', [...currentDomaines, domaineId]);
    } else {
      setValue('domaines', currentDomaines.filter(id => id !== domaineId));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom de l'unité *</Label>
        <Input
          id="nom"
          {...register('nom')}
          placeholder="Ex: Mathématiques, Sciences Physiques..."
        />
        {errors.nom && (
          <p className="text-sm text-destructive">{errors.nom.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description de l'unité d'enseignement"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Domaines *</Label>
        <div className="space-y-2">
          {domaines.map(domaine => (
            <div key={domaine.id} className="flex items-center space-x-2">
              <Checkbox
                id={`domaine-${domaine.id}`}
                checked={selectedDomaines.includes(domaine.id)}
                onCheckedChange={(checked) => handleDomaineChange(domaine.id, checked as boolean)}
              />
              <Label htmlFor={`domaine-${domaine.id}`} className="text-sm font-normal">
                {domaine.nom}
              </Label>
            </div>
          ))}
        </div>
        {errors.domaines && (
          <p className="text-sm text-destructive">{errors.domaines.message}</p>
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

export default UniteForm;
