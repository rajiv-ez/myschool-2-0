
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import { ModeleDocument, ChampsModele } from '@/types/dms';
import { dmsService } from '@/services/dmsService';
import { useToast } from '@/hooks/use-toast';

interface ChampsModeleDialogProps {
  modele: ModeleDocument;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChampsModeleDialog: React.FC<ChampsModeleDialogProps> = ({
  modele,
  open,
  onClose,
  onSuccess,
}) => {
  const [champs, setChamps] = useState<ChampsModele[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChamp, setEditingChamp] = useState<ChampsModele | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    type: 'char' as 'char' | 'text',
    tag_name: '',
    options: '',
    help_text: '',
    required: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadChamps();
    }
  }, [open, modele.id]);

  const loadChamps = async () => {
    setLoading(true);
    try {
      const res = await dmsService.getChampsModeles();
      setChamps(res.data.filter(champ => champ.modele_document === modele.id));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les champs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddChamp = () => {
    setEditingChamp(null);
    setFormData({
      label: '',
      type: 'char',
      tag_name: '',
      options: '',
      help_text: '',
      required: false,
    });
    setShowForm(true);
  };

  const handleEditChamp = (champ: ChampsModele) => {
    setEditingChamp(champ);
    setFormData({
      label: champ.label,
      type: champ.type,
      tag_name: champ.tag_name,
      options: champ.options || '',
      help_text: champ.help_text || '',
      required: champ.required,
    });
    setShowForm(true);
  };

  const handleSaveChamp = async () => {
    try {
      // Ici, on enverrait les données à l'API
      toast({
        title: "Succès",
        description: editingChamp ? "Champ modifié" : "Champ ajouté",
      });
      setShowForm(false);
      loadChamps();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChamp = async (champId: number) => {
    try {
      // Ici, on supprimerait le champ via l'API
      toast({
        title: "Succès",
        description: "Champ supprimé",
      });
      loadChamps();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le champ",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Configuration des champs - {modele.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des champs existants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Champs configurés</CardTitle>
                <Button onClick={handleAddChamp} size="sm">
                  <Plus size={16} className="mr-1" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : champs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Aucun champ configuré
                </p>
              ) : (
                <div className="space-y-3">
                  {champs.map((champ) => (
                    <div key={champ.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{champ.label}</span>
                          <Badge variant={champ.type === 'text' ? 'secondary' : 'outline'}>
                            {champ.type}
                          </Badge>
                          {champ.required && (
                            <Badge variant="destructive" className="text-xs">
                              Requis
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tag: {champ.tag_name}
                        </p>
                        {champ.options && (
                          <p className="text-sm text-muted-foreground">
                            Options: {champ.options}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditChamp(champ)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteChamp(champ.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulaire d'ajout/modification */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingChamp ? 'Modifier le champ' : 'Nouveau champ'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Libellé du champ</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Ex: Nom de l'élève"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag_name">Nom du tag</Label>
                  <Input
                    id="tag_name"
                    value={formData.tag_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, tag_name: e.target.value }))}
                    placeholder="Ex: nom_eleve"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de champ</Label>
                  <Select value={formData.type} onValueChange={(value: 'char' | 'text') => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="char">Texte court</SelectItem>
                      <SelectItem value="text">Texte long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="options">Options (séparées par ;)</Label>
                  <Input
                    id="options"
                    value={formData.options}
                    onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                    placeholder="Ex: Passable;Bien;Très bien"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="help_text">Texte d'aide</Label>
                  <Textarea
                    id="help_text"
                    value={formData.help_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, help_text: e.target.value }))}
                    placeholder="Information supplémentaire pour l'utilisateur"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={formData.required}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
                  />
                  <Label htmlFor="required">Champ obligatoire</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveChamp} className="flex-1">
                    {editingChamp ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
