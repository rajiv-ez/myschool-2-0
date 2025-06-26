
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Paiement } from '@/types/accounting';

const paiementSchema = z.object({
  inscription: z.number().min(1, 'L\'inscription est requise'),
  frais: z.number().min(1, 'Le frais est requis'),
  montant: z.string().min(1, 'Le montant est requis'),
  date: z.string().min(1, 'La date est requise'),
  reference: z.string().optional(),
  tiers_payeur: z.string().optional(),
  statut: z.enum(['EN_ATTENTE', 'PAYE_PARTIELLEMENT', 'PAYE', 'ANNULE', 'REMBOURSE'])
});

type PaiementFormData = z.infer<typeof paiementSchema>;

interface PaiementFormProps {
  item?: Paiement | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PaiementForm: React.FC<PaiementFormProps> = ({ item, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PaiementFormData>({
    resolver: zodResolver(paiementSchema),
    defaultValues: item ? {
      inscription: item.inscription,
      frais: item.frais,
      montant: item.montant,
      date: item.date,
      reference: item.reference || '',
      tiers_payeur: item.tiers_payeur || '',
      statut: item.statut
    } : {
      inscription: 1,
      frais: 1,
      montant: '',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      tiers_payeur: '',
      statut: 'EN_ATTENTE' as const
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="inscription">Inscription *</Label>
          <Input
            id="inscription"
            type="number"
            {...register('inscription', { valueAsNumber: true })}
            placeholder="ID de l'inscription"
          />
          {errors.inscription && <p className="text-sm text-red-500">{errors.inscription.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="frais">Frais *</Label>
          <Input
            id="frais"
            type="number"
            {...register('frais', { valueAsNumber: true })}
            placeholder="ID du frais"
          />
          {errors.frais && <p className="text-sm text-red-500">{errors.frais.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="montant">Montant *</Label>
          <Input
            id="montant"
            {...register('montant')}
            placeholder="Ex: 25000"
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
        <Label htmlFor="reference">Référence</Label>
        <Input
          id="reference"
          {...register('reference')}
          placeholder="Ex: PAY001"
        />
      </div>

      <div>
        <Label htmlFor="tiers_payeur">Tiers payeur</Label>
        <Input
          id="tiers_payeur"
          {...register('tiers_payeur')}
          placeholder="Ex: Famille Martin"
        />
      </div>

      <div>
        <Label htmlFor="statut">Statut *</Label>
        <Select value={watch('statut')} onValueChange={(value) => setValue('statut', value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EN_ATTENTE">En attente</SelectItem>
            <SelectItem value="PAYE_PARTIELLEMENT">Payé partiellement</SelectItem>
            <SelectItem value="PAYE">Payé</SelectItem>
            <SelectItem value="ANNULE">Annulé</SelectItem>
            <SelectItem value="REMBOURSE">Remboursé</SelectItem>
          </SelectContent>
        </Select>
        {errors.statut && <p className="text-sm text-red-500">{errors.statut.message}</p>}
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

export default PaiementForm;
