
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { ModeleDocument } from '@/types/dms';
import { useToast } from '@/hooks/use-toast';

interface ModeleDocumentFormProps {
  modele: ModeleDocument | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModeleDocumentForm: React.FC<ModeleDocumentFormProps> = ({
  modele,
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    nom: modele?.nom || '',
    description: modele?.description || '',
    template: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ici, on enverrait les données à l'API
      toast({
        title: "Succès",
        description: modele ? "Modèle modifié avec succès" : "Modèle créé avec succès",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, template: file }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {modele ? 'Modifier le modèle' : 'Nouveau modèle de document'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du modèle</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Ex: Attestation de scolarité"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez à quoi sert ce modèle..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Template DOCX</Label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="template-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Cliquez pour télécharger</span> le template
                  </p>
                  <p className="text-xs text-gray-500">Format DOCX uniquement</p>
                </div>
                <input
                  id="template-upload"
                  type="file"
                  className="hidden"
                  accept=".docx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {formData.template && (
              <p className="text-sm text-green-600">
                Fichier sélectionné : {formData.template.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : modele ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
