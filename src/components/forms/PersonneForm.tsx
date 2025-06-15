
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { EleveDetail, TuteurDetail } from '@/types/users';

const personneSchema = z.object({
  // Informations personnelles
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  genre: z.enum(['M', 'F', 'A'], { required_error: 'Le genre est requis' }),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(1, 'Le lieu de naissance est requis'),
  
  // Informations de contact
  adresse: z.string().min(1, 'L\'adresse est requise'),
  tel1: z.string().min(1, 'Le téléphone principal est requis'),
  tel2: z.string().optional(),
  whatsapp: z.string().optional(),
  
  // Informations spécifiques
  matricule: z.string().optional(), // Pour les élèves
  profession: z.string().optional(), // Pour les tuteurs
  
  // Statut
  is_active: z.boolean().default(true),
});

type PersonneFormData = z.infer<typeof personneSchema>;

interface PersonneFormProps {
  item?: EleveDetail | TuteurDetail;
  onSubmit: (data: PersonneFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  entityType?: 'eleve' | 'tuteur';
}

export default function PersonneForm({ 
  item, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  entityType = 'eleve'
}: PersonneFormProps) {
  const isEleve = entityType === 'eleve';
  const isEditing = !!item;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PersonneFormData>({
    resolver: zodResolver(personneSchema),
    defaultValues: item ? {
      nom: item.user.nom,
      prenom: item.user.prenom,
      email: item.user.email,
      genre: item.user.genre,
      date_naissance: item.user.date_naissance,
      lieu_naissance: item.user.lieu_naissance,
      adresse: item.user.adresse,
      tel1: item.user.tel1,
      tel2: item.user.tel2 || '',
      whatsapp: item.user.whatsapp || '',
      matricule: 'matricule' in item ? item.matricule : '',
      profession: 'profession' in item ? item.profession : '',
      is_active: item.user.is_active,
    } : {
      genre: 'M',
      is_active: true,
      matricule: isEleve ? `E${new Date().getFullYear()}${String(Date.now()).slice(-3)}` : '',
      profession: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section Informations personnelles */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Informations personnelles</h3>
        </div>
        <Separator />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              {...register('nom')}
              className={errors.nom ? 'border-red-500' : ''}
            />
            {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>}
          </div>

          <div>
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              {...register('prenom')}
              className={errors.prenom ? 'border-red-500' : ''}
            />
            {errors.prenom && <p className="text-sm text-red-500 mt-1">{errors.prenom.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="genre">Genre *</Label>
            <Select onValueChange={(value) => setValue('genre', value as 'M' | 'F' | 'A')} defaultValue={watch('genre')}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
                <SelectItem value="A">Autre</SelectItem>
              </SelectContent>
            </Select>
            {errors.genre && <p className="text-sm text-red-500 mt-1">{errors.genre.message}</p>}
          </div>

          <div>
            <Label htmlFor="date_naissance">Date de naissance *</Label>
            <Input
              id="date_naissance"
              type="date"
              {...register('date_naissance')}
              className={errors.date_naissance ? 'border-red-500' : ''}
            />
            {errors.date_naissance && <p className="text-sm text-red-500 mt-1">{errors.date_naissance.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="lieu_naissance">Lieu de naissance *</Label>
          <Input
            id="lieu_naissance"
            {...register('lieu_naissance')}
            className={errors.lieu_naissance ? 'border-red-500' : ''}
          />
          {errors.lieu_naissance && <p className="text-sm text-red-500 mt-1">{errors.lieu_naissance.message}</p>}
        </div>
      </div>

      {/* Section Informations de contact */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Informations de contact</h3>
        </div>
        <Separator />
        
        <div>
          <Label htmlFor="adresse">Adresse *</Label>
          <Input
            id="adresse"
            {...register('adresse')}
            className={errors.adresse ? 'border-red-500' : ''}
          />
          {errors.adresse && <p className="text-sm text-red-500 mt-1">{errors.adresse.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tel1">Téléphone principal *</Label>
            <Input
              id="tel1"
              {...register('tel1')}
              className={errors.tel1 ? 'border-red-500' : ''}
            />
            {errors.tel1 && <p className="text-sm text-red-500 mt-1">{errors.tel1.message}</p>}
          </div>

          <div>
            <Label htmlFor="tel2">Téléphone secondaire</Label>
            <Input
              id="tel2"
              {...register('tel2')}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            {...register('whatsapp')}
          />
        </div>
      </div>

      {/* Section Informations spécifiques */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">
            {isEleve ? 'Informations élève' : 'Informations tuteur'}
          </h3>
        </div>
        <Separator />
        
        {isEleve ? (
          <div>
            <Label htmlFor="matricule">Matricule</Label>
            <Input
              id="matricule"
              {...register('matricule')}
              placeholder="Généré automatiquement si vide"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              {...register('profession')}
              placeholder="Ex: Enseignant, Médecin, etc."
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
