
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

const classeSessionSchema = z.object({
  classe: z.number().min(1, 'La classe est requise'),
  session: z.number().min(1, 'La session est requise'),
  capacite: z.number().min(1, 'La capacité doit être supérieure à 0'),
});

type ClasseSessionFormData = z.infer<typeof classeSessionSchema>;

interface ClasseSessionFormProps {
  isEditing?: boolean;
  selectedItem?: any;
  onSubmit: (data: ClasseSessionFormData) => void;
  onCancel: () => void;
  classes: any[];
  sessions: any[];
}

const ClasseSessionForm: React.FC<ClasseSessionFormProps> = ({
  isEditing = false,
  selectedItem,
  onSubmit,
  onCancel,
  classes,
  sessions
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ClasseSessionFormData>({
    resolver: zodResolver(classeSessionSchema),
    defaultValues: selectedItem ? {
      classe: selectedItem.classe,
      session: selectedItem.session,
      capacite: selectedItem.capacite,
    } : {}
  });

  const selectedClasse = watch('classe');
  const selectedSession = watch('session');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Classe *</Label>
        <Select 
          value={selectedClasse?.toString()} 
          onValueChange={(value) => setValue('classe', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            {classes.map(classe => (
              <SelectItem key={classe.id} value={classe.id.toString()}>
                {classe.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.classe && (
          <p className="text-sm text-destructive">{errors.classe.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Session *</Label>
        <Select 
          value={selectedSession?.toString()} 
          onValueChange={(value) => setValue('session', parseInt(value))}
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
        {errors.session && (
          <p className="text-sm text-destructive">{errors.session.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacite">Capacité *</Label>
        <Input
          id="capacite"
          type="number"
          min={1}
          {...register('capacite', { valueAsNumber: true })}
          placeholder="Ex: 30"
        />
        {errors.capacite && (
          <p className="text-sm text-destructive">{errors.capacite.message}</p>
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

export default ClasseSessionForm;
