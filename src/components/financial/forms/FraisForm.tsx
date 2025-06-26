
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FraisScolaire } from '@/types/accounting';

const fraisSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  session: z.number().min(1, 'La session est requise'),
  palier: z.number().optional(),
  montant: z.string().min(1, 'Le montant est requis'),
  quantite: z.number().min(1, 'La quantité doit être positive'),
  est_obligatoire: z.boolean(),
  est_actif: z.boolean(),
  est_immateriel: z.boolean(),
  concerne_toutes_classes: z.boolean()
});

type FraisFormData = z.infer<typeof fraisSchema>;

interface FraisFormProps {
  item?: FraisScolaire | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const FraisForm: React.FC<FraisFormProps> = ({ item, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FraisFormData>({
    resolver: zodResolver(fraisSchema),
    defaultValues: item ? {
      nom: item.nom || '',
      description: item.description || '',
      session: item.session,
      palier: item.palier || undefined,
      montant: item.montant,
      quantite: item.quantite,
      est_obligatoire: item.est_obligatoire,
      est_actif: item.est_actif,
      est_immateriel: item.est_immateriel,
      concerne_toutes_classes: item.concerne_toutes_classes
    } : {
      nom: '',
      description: '',
      session: 1,
      montant: '',
      quantite: 1,
      est_obligatoire: true,
      est_actif: true,
      est_immateriel: false,
      concerne_toutes_classes: true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            {...register('nom')}
            placeholder="Ex: Frais d'inscription"
          />
          {errors.nom && <p className="text-sm text-red-500">{errors.nom.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="session">Session *</Label>
          <Input
            id="session"
            type="number"
            {...register('session', { valueAsNumber: true })}
            placeholder="Ex: 1"
          />
          {errors.session && <p className="text-sm text-red-500">{errors.session.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description du frais"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="montant">Montant *</Label>
          <Input
            id="montant"
            {...register('montant')}
            placeholder="Ex: 50000"
          />
          {errors.montant && <p className="text-sm text-red-500">{errors.montant.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="quantite">Quantité *</Label>
          <Input
            id="quantite"
            type="number"
            {...register('quantite', { valueAsNumber: true })}
            placeholder="Ex: 1"
          />
          {errors.quantite && <p className="text-sm text-red-500">{errors.quantite.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="palier">Palier</Label>
        <Input
          id="palier"
          type="number"
          {...register('palier', { valueAsNumber: true })}
          placeholder="Ex: 1"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="est_obligatoire"
            {...register('est_obligatoire')}
            defaultChecked={watch('est_obligatoire')}
            onCheckedChange={(checked) => setValue('est_obligatoire', !!checked)}
          />
          <Label htmlFor="est_obligatoire">Obligatoire</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="est_actif"
            {...register('est_actif')}
            defaultChecked={watch('est_actif')}
            onCheckedChange={(checked) => setValue('est_actif', !!checked)}
          />
          <Label htmlFor="est_actif">Actif</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="est_immateriel"
            {...register('est_immateriel')}
            defaultChecked={watch('est_immateriel')}
            onCheckedChange={(checked) => setValue('est_immateriel', !!checked)}
          />
          <Label htmlFor="est_immateriel">Immatériel</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="concerne_toutes_classes"
            {...register('concerne_toutes_classes')}
            defaultChecked={watch('concerne_toutes_classes')}
            onCheckedChange={(checked) => setValue('concerne_toutes_classes', !!checked)}
          />
          <Label htmlFor="concerne_toutes_classes">Concerne toutes les classes</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {item ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default FraisForm;
