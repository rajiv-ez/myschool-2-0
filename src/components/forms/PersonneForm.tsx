
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Phone, GraduationCap, UserCheck, Camera, Upload } from 'lucide-react';
import { EleveDetail, TuteurDetail } from '@/types/users';

const personneSchema = z.object({
  // Informations personnelles
  nom: z.string().min(1, 'Le nom est requis').max(150, 'Le nom ne peut pas dépasser 150 caractères'),
  prenom: z.string().min(1, 'Le prénom est requis').max(150, 'Le prénom ne peut pas dépasser 150 caractères'),
  email: z.string().email('Email invalide').max(254, 'L\'email ne peut pas dépasser 254 caractères'),
  genre: z.enum(['M', 'F', 'A'], { required_error: 'Le genre est requis' }),
  date_naissance: z.string().min(1, 'La date de naissance est requise').regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  lieu_naissance: z.string().min(1, 'Le lieu de naissance est requis').max(255, 'Le lieu de naissance ne peut pas dépasser 255 caractères'),
  photo: z.string().optional(),
  
  // Informations de contact
  adresse: z.string().min(1, 'L\'adresse est requise'),
  tel1: z.string().min(1, 'Le téléphone principal est requis').regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Format de téléphone invalide'),
  tel2: z.string().optional(),
  whatsapp: z.string().optional(),
  
  // Informations spécifiques
  matricule: z.string().optional(),
  profession: z.string().optional(),
  
  // Statut
  is_active: z.boolean().default(true),
});

type PersonneFormData = z.infer<typeof personneSchema>;

interface PersonneFormProps {
  item?: EleveDetail | TuteurDetail;
  onSubmit: (data: any) => void;
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

  // Improved default values with proper fallbacks and null handling
  const getDefaultValues = (): PersonneFormData => {
    if (item && item.user) {
      const user = item.user;
      console.log('PersonneForm: Setting default values from item:', item);
      console.log('PersonneForm: User data:', user);
      
      return {
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        genre: (user.genre as 'M' | 'F' | 'A') || 'M',
        date_naissance: user.date_naissance || '',
        lieu_naissance: user.lieu_naissance || '',
        photo: user.photo || '',
        adresse: user.adresse || '',
        tel1: user.tel1 || '',
        tel2: user.tel2 || '',
        whatsapp: user.whatsapp || '',
        matricule: 'matricule' in item ? (item.matricule || '') : '',
        profession: 'profession' in item ? (item.profession || '') : '',
        is_active: user.is_active !== undefined ? user.is_active : true,
      };
    }
    
    return {
      nom: '',
      prenom: '',
      email: '',
      genre: 'M',
      date_naissance: '',
      lieu_naissance: '',
      photo: '',
      adresse: '',
      tel1: '',
      tel2: '',
      whatsapp: '',
      matricule: isEleve ? `E${new Date().getFullYear()}${String(Date.now()).slice(-3)}` : '',
      profession: '',
      is_active: true,
    };
  };

  const form = useForm<PersonneFormData>({
    resolver: zodResolver(personneSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;

  // Reset form when item changes with improved handling
  React.useEffect(() => {
    const newDefaults = getDefaultValues();
    console.log('PersonneForm: Resetting form with item:', item);
    console.log('PersonneForm: New defaults:', newDefaults);
    reset(newDefaults);
  }, [item, entityType, reset]);

  const watchedPhoto = watch('photo');
  const watchedGenre = watch('genre');

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  // Enhanced data validation and formatting to match backend expectations
  const validateAndFormatData = (data: PersonneFormData) => {
    console.log('PersonneForm: Validating and formatting data:', data);
    
    // Clean and format user data with ALL required fields
    const baseUserData = {
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      email: data.email.trim().toLowerCase(),
      genre: data.genre,
      date_naissance: data.date_naissance,
      lieu_naissance: data.lieu_naissance.trim(),
      photo: data.photo?.trim() || '', // Use empty string instead of null
      adresse: data.adresse.trim(),
      tel1: data.tel1.trim(),
      tel2: data.tel2?.trim() || '', // Use empty string instead of null
      whatsapp: data.whatsapp?.trim() || '', // Use empty string instead of null
      is_active: data.is_active,
      // Include required backend fields
      is_staff: false,
      is_superuser: false
    };

    // If editing, preserve the existing user ID
    const userData = isEditing && item?.user?.id 
      ? { ...baseUserData, id: item.user.id }
      : baseUserData;

    // Validate required fields
    const requiredFields = ['nom', 'prenom', 'email', 'date_naissance', 'lieu_naissance', 'adresse', 'tel1'];
    for (const field of requiredFields) {
      if (!userData[field as keyof typeof userData]) {
        throw new Error(`Le champ ${field} est requis`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Format d\'email invalide');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(userData.date_naissance)) {
      throw new Error('Format de date invalide (YYYY-MM-DD requis)');
    }

    // Validate phone numbers
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    if (!phoneRegex.test(userData.tel1)) {
      throw new Error('Format de téléphone principal invalide');
    }
    if (userData.tel2 && !phoneRegex.test(userData.tel2)) {
      throw new Error('Format de téléphone secondaire invalide');
    }
    if (userData.whatsapp && !phoneRegex.test(userData.whatsapp)) {
      throw new Error('Format WhatsApp invalide');
    }

    console.log('PersonneForm: Validated user data:', userData);
    return userData;
  };

  const handleFormSubmit = (data: PersonneFormData) => {
    console.log('PersonneForm: Starting form submission with data:', data);
    
    try {
      // Validate and format the data
      const userData = validateAndFormatData(data);
      
      // Transform data to match the expected API format
      const baseTransformedData = {
        user: userData,
        ...(isEleve 
          ? { 
              matricule: data.matricule?.trim() || `E${new Date().getFullYear()}${String(Date.now()).slice(-3)}`,
              tuteurs: item && 'tuteurs' in item ? item.tuteurs : []
            }
          : { 
              profession: data.profession?.trim() || ''
            }
        )
      };

      // If editing, preserve the existing entity ID
      const transformedData = isEditing && item?.id 
        ? { ...baseTransformedData, id: item.id }
        : baseTransformedData;

      console.log('PersonneForm: Final transformed data for submission:', transformedData);
      console.log('PersonneForm: Entity type:', entityType);
      console.log('PersonneForm: Is editing:', isEditing);
      
      onSubmit(transformedData);
    } catch (error) {
      console.error('PersonneForm: Validation error:', error);
      // You could show this error in a toast or form error
      alert(`Erreur de validation: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Personnel</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone size={16} />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="specific" className="flex items-center gap-2">
            {isEleve ? <GraduationCap size={16} /> : <UserCheck size={16} />}
            <span className="hidden sm:inline">{isEleve ? 'Élève' : 'Tuteur'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={watchedPhoto || ''} />
                  <AvatarFallback>
                    {item ? getInitials(item.user.nom, item.user.prenom) : <Camera size={32} />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="photo">Photo de profil</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="photo"
                      {...register('photo')}
                      placeholder="URL de la photo ou chemin local"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" className="flex items-center gap-1">
                      <Upload size={14} />
                      Parcourir
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entrez l'URL d'une photo ou sélectionnez un fichier
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    {...register('nom')}
                    className={errors.nom ? 'border-red-500' : ''}
                    maxLength={150}
                  />
                  {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>}
                </div>

                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    {...register('prenom')}
                    className={errors.prenom ? 'border-red-500' : ''}
                    maxLength={150}
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
                  maxLength={254}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Genre *</Label>
                  <Select 
                    value={watchedGenre} 
                    onValueChange={(value) => setValue('genre', value as 'M' | 'F' | 'A')}
                  >
                    <SelectTrigger className={errors.genre ? 'border-red-500' : ''}>
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
                  maxLength={255}
                />
                {errors.lieu_naissance && <p className="text-sm text-red-500 mt-1">{errors.lieu_naissance.message}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone size={20} />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    placeholder="+241 XX XX XX XX"
                  />
                  {errors.tel1 && <p className="text-sm text-red-500 mt-1">{errors.tel1.message}</p>}
                </div>

                <div>
                  <Label htmlFor="tel2">Téléphone secondaire</Label>
                  <Input
                    id="tel2"
                    {...register('tel2')}
                    className={errors.tel2 ? 'border-red-500' : ''}
                    placeholder="+241 XX XX XX XX"
                  />
                  {errors.tel2 && <p className="text-sm text-red-500 mt-1">{errors.tel2.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  {...register('whatsapp')}
                  placeholder="+241 XX XX XX XX"
                  className={errors.whatsapp ? 'border-red-500' : ''}
                />
                {errors.whatsapp && <p className="text-sm text-red-500 mt-1">{errors.whatsapp.message}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specific" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEleve ? <GraduationCap size={20} /> : <UserCheck size={20} />}
                {isEleve ? 'Informations élève' : 'Informations tuteur'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEleve ? (
                <div>
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input
                    id="matricule"
                    {...register('matricule')}
                    placeholder="Généré automatiquement si vide"
                    className={errors.matricule ? 'border-red-500' : ''}
                  />
                  {errors.matricule && <p className="text-sm text-red-500 mt-1">{errors.matricule.message}</p>}
                  <p className="text-sm text-muted-foreground mt-1">
                    Le matricule sera généré automatiquement si laissé vide
                  </p>
                </div>
              ) : (
                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    {...register('profession')}
                    placeholder="Ex: Enseignant, Médecin, Ingénieur..."
                    className={errors.profession ? 'border-red-500' : ''}
                  />
                  {errors.profession && <p className="text-sm text-red-500 mt-1">{errors.profession.message}</p>}
                  <p className="text-sm text-muted-foreground mt-1">
                    Profession ou activité principale du tuteur
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register('is_active')}
                  className="rounded border-input"
                />
                <Label htmlFor="is_active">Compte actif</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
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
