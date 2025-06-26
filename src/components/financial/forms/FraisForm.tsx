
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FraisScolaire } from '@/types/accounting';
import { useFinancialData } from '@/hooks/useFinancialData';

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
  concerne_toutes_classes: z.boolean(),
  echeance: z.string().optional(),
  classes: z.array(z.number()).default([])
});

type FraisFormData = z.infer<typeof fraisSchema>;

interface FraisFormProps {
  item?: FraisScolaire | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const FraisForm: React.FC<FraisFormProps> = ({ item, onSubmit, onCancel }) => {
  const { sessions, paliers } = useFinancialData();
  const [selectedSession, setSelectedSession] = useState<number | null>(item?.session || null);
  const [echeanceDate, setEcheanceDate] = useState<Date | undefined>(
    item?.echeance ? new Date(item.echeance) : undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
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
      concerne_toutes_classes: item.concerne_toutes_classes,
      echeance: item.echeance || '',
      classes: item.classes || []
    } : {
      nom: '',
      description: '',
      session: 0,
      montant: '',
      quantite: 1,
      est_obligatoire: true,
      est_actif: true,
      est_immateriel: false,
      concerne_toutes_classes: true,
      echeance: '',
      classes: []
    }
  });

  // Filtrer les paliers selon la session sélectionnée
  const filteredPaliers = selectedSession 
    ? paliers.filter(p => p.session === selectedSession)
    : [];

  const handleSessionChange = (sessionId: string) => {
    const sessionNumber = parseInt(sessionId);
    setSelectedSession(sessionNumber);
    setValue('session', sessionNumber);
    setValue('palier', undefined); // Reset palier quand on change de session
  };

  const handleFormSubmit = (data: FraisFormData) => {
    const formattedData = {
      ...data,
      echeance: echeanceDate ? echeanceDate.toISOString().split('T')[0] : null,
      date_creation: new Date().toISOString()
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
          <Select
            value={selectedSession?.toString() || ''}
            onValueChange={handleSessionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map(session => (
                <SelectItem key={session.id} value={session.id.toString()}>
                  {session.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label htmlFor="palier">Palier</Label>
          <Select
            value={watch('palier')?.toString() || ''}
            onValueChange={(value) => setValue('palier', value ? parseInt(value) : undefined)}
            disabled={!selectedSession}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un palier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucun palier</SelectItem>
              {filteredPaliers.map(palier => (
                <SelectItem key={palier.id} value={palier.id.toString()}>
                  {palier.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Échéance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !echeanceDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {echeanceDate ? format(echeanceDate, "dd/MM/yyyy") : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={echeanceDate}
                onSelect={setEcheanceDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
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
