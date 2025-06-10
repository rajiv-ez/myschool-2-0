
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Image, Building2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OrganisationSettings: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: 'Collège Saint-Louis',
    description: 'Un établissement d\'excellence pour la formation de la jeunesse gabonaise.',
    adresse: '123 Avenue de l\'Indépendance, Libreville',
    telephone: '+241 01 23 45 67',
    email: 'contact@csleguide.ga',
    logo: null as File | null,
    modele_bulletin: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSave = () => {
    // Ici, on enverrait les données à l'API
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de l'organisation ont été mis à jour avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Organisation</h3>
        <p className="text-sm text-muted-foreground">
          Gérez les paramètres par défaut de votre établissement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 size={20} />
            Informations générales
          </CardTitle>
          <CardDescription>
            Configurez les informations de base de votre établissement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'établissement</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez votre établissement..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image size={20} />
            Logo de l'établissement
          </CardTitle>
          <CardDescription>
            Téléchargez le logo qui apparaîtra sur les documents officiels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour télécharger</span> le logo
                </p>
                <p className="text-xs text-gray-500">PNG, JPG ou SVG (MAX. 2MB)</p>
              </div>
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
              />
            </label>
          </div>
          {formData.logo && (
            <p className="mt-2 text-sm text-green-600">
              Fichier sélectionné : {formData.logo.name}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Modèle de bulletin par défaut
          </CardTitle>
          <CardDescription>
            Téléchargez le modèle de bulletin de notes au format DOCX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="bulletin-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour télécharger</span> le modèle
                </p>
                <p className="text-xs text-gray-500">Format DOCX uniquement</p>
              </div>
              <input
                id="bulletin-upload"
                type="file"
                className="hidden"
                accept=".docx"
                onChange={(e) => handleFileChange('modele_bulletin', e.target.files?.[0] || null)}
              />
            </label>
          </div>
          {formData.modele_bulletin && (
            <p className="mt-2 text-sm text-green-600">
              Fichier sélectionné : {formData.modele_bulletin.name}
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={16} />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};

export default OrganisationSettings;
