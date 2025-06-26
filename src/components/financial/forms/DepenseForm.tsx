
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Depense } from '@/types/accounting';

const depenseSchema = z.object({
  montant: z.string().min(1, 'Le montant est requis'),
  date: z.string().min(1, 'La date est requise'),
  beneficiaire: z.string().optional(),
  reference: z.string().optional(),
  description: z.string().min(1, 'La description est requise'),
  categorie: z.enum(['MATERIEL', 'MAINTENANCE', 'SALAIRES', 'CHARGES', 'TRANSPORT', 'ALIMENTATION', 'AUTRES'])
});

type DepenseFormData = z.infer<typeof depenseSchema>;

interface DepenseFormProps {
  item?: Depense | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DepenseForm: React.FC<DepenseFormProps> = ({ item, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DepenseFormData>({
    resolver: zodResolver(depenseSchema),
    defaultValues: item ? {
      montant: item.montant,
      date: item.date,
      beneficiaire: item.beneficiaire || '',
      reference: item.reference || '',
      description: item.description,
      categorie: item.categorie
    } : {
      montant: '',
      date: new Date().toISOString().split('T')[0],
      beneficiaire: '',
      reference: '',
      description: '',
      categorie: 'AUTRES' as const
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Description de la dépense"
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="montant">Montant *</Label>
          <Input
            id="montant"
            {...register('montant')}
            placeholder="Ex: 20000"
          />
          {errors.montant && <p className="text-sm text-red-500">{errors.montant.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="beneficiaire">Bénéficiaire</Label>
        <Input
          id="beneficiaire"
          {...register('beneficiaire')}
          placeholder="Ex: Librairie Papeterie Moderne"
        />
      </div>

      <div>
        <Label htmlFor="reference">Référence</Label>
        <Input
          id="reference"
          {...register('reference')}
          placeholder="Ex: DEP001"
        />
      </div>

      <div>
        <Label htmlFor="categorie">Catégorie *</Label>
        <Select value={watch('categorie')} onValueChange={(value) => setValue('categorie', value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MATERIEL">Matériel</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="SALAIRES">Salaires</SelectItem>
            <SelectItem value="CHARGES">Charges</SelectItem>
            <SelectItem value="TRANSPORT">Transport</SelectItem>
            <SelectItem value="ALIMENTATION">Alimentation</SelectItem>
            <SelectItem value="AUTRES">Autres</SelectItem>
          </SelectContent>
        </Select>
        {errors.categorie && <p className="text-sm text-red-500">{errors.categorie.message}</p>}
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

export default DepenseForm;
