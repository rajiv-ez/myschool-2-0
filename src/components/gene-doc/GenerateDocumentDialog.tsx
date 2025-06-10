
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Wand2 } from 'lucide-react';
import { ModeleDocument, ChampsModele, DocumentGenere } from '@/types/dms';
import { dmsService } from '@/services/dmsService';
import { useToast } from '@/hooks/use-toast';

interface GenerateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GenerateDocumentDialog: React.FC<GenerateDocumentDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [modeles, setModeles] = useState<ModeleDocument[]>([]);
  const [champs, setChamps] = useState<ChampsModele[]>([]);
  const [selectedModeleId, setSelectedModeleId] = useState<number | null>(null);
  const [donnees, setDonnees] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadModeles();
    }
  }, [open]);

  useEffect(() => {
    if (selectedModeleId) {
      loadChamps();
    } else {
      setChamps([]);
      setDonnees({});
    }
  }, [selectedModeleId]);

  const loadModeles = async () => {
    try {
      const res = await dmsService.getModelesDocuments();
      setModeles(res.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les modèles",
        variant: "destructive",
      });
    }
  };

  const loadChamps = async () => {
    try {
      const res = await dmsService.getChampsModeles();
      const modelChamps = res.data.filter(champ => champ.modele_document === selectedModeleId);
      setChamps(modelChamps);
      
      // Initialiser les données avec des valeurs vides
      const initialData: Record<string, string> = {};
      modelChamps.forEach(champ => {
        initialData[champ.tag_name] = '';
      });
      setDonnees(initialData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les champs",
        variant: "destructive",
      });
    }
  };

  const handleDataChange = (tagName: string, value: string) => {
    setDonnees(prev => ({ ...prev, [tagName]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedModeleId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle",
        variant: "destructive",
      });
      return;
    }

    // Vérifier les champs obligatoires
    const missingRequired = champs.filter(champ => 
      champ.required && !donnees[champ.tag_name]?.trim()
    );

    if (missingRequired.length > 0) {
      toast({
        title: "Champs manquants",
        description: `Veuillez remplir: ${missingRequired.map(c => c.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<DocumentGenere> = {
        modele: selectedModeleId,
        donnees: donnees,
      };

      await dmsService.createDocumentGenere(payload);
      
      toast({
        title: "Document généré !",
        description: "Le document a été généré avec succès",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedModele = modeles.find(m => m.id === selectedModeleId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            Générer un document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection du modèle */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label htmlFor="modele">Modèle de document</Label>
                <Select 
                  value={selectedModeleId?.toString() || ''} 
                  onValueChange={(value) => setSelectedModeleId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un modèle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {modeles.map((modele) => (
                      <SelectItem key={modele.id} value={modele.id.toString()}>
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          {modele.nom}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedModele && (
                  <p className="text-sm text-muted-foreground">
                    {selectedModele.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulaire des champs */}
          {champs.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-medium">Données à remplir</h3>
                    <Badge variant="secondary">{champs.length} champs</Badge>
                  </div>
                  
                  {champs.map((champ) => (
                    <div key={champ.id} className="space-y-2">
                      <Label htmlFor={champ.tag_name} className="flex items-center gap-2">
                        {champ.label}
                        {champ.required && (
                          <Badge variant="destructive" className="text-xs">
                            Requis
                          </Badge>
                        )}
                      </Label>
                      
                      {champ.options ? (
                        <Select 
                          value={donnees[champ.tag_name] || ''} 
                          onValueChange={(value) => handleDataChange(champ.tag_name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisissez une option..." />
                          </SelectTrigger>
                          <SelectContent>
                            {champ.options.split(';').map((option, index) => (
                              <SelectItem key={index} value={option.trim()}>
                                {option.trim()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : champ.type === 'text' ? (
                        <Textarea
                          id={champ.tag_name}
                          value={donnees[champ.tag_name] || ''}
                          onChange={(e) => handleDataChange(champ.tag_name, e.target.value)}
                          placeholder={champ.help_text || `Saisissez ${champ.label.toLowerCase()}`}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={champ.tag_name}
                          value={donnees[champ.tag_name] || ''}
                          onChange={(e) => handleDataChange(champ.tag_name, e.target.value)}
                          placeholder={champ.help_text || `Saisissez ${champ.label.toLowerCase()}`}
                        />
                      )}
                      
                      {champ.help_text && (
                        <p className="text-xs text-muted-foreground">
                          {champ.help_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !selectedModeleId}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                <Wand2 size={16} className="mr-2" />
                Générer le document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
