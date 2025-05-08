
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { FraisScolaire, Session, Palier } from './FraisScolaireTypes';

interface FraisFormProps {
  formValues: Omit<FraisScolaire, 'id'>;
  setFormValues: React.Dispatch<React.SetStateAction<Omit<FraisScolaire, 'id'>>>;
  sessions: Session[];
  selectedSessionId: string;
  setSelectedSessionId: React.Dispatch<React.SetStateAction<string>>;
  filteredPaliers: Palier[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
}

const FraisForm: React.FC<FraisFormProps> = ({
  formValues,
  setFormValues,
  sessions,
  selectedSessionId,
  setSelectedSessionId,
  filteredPaliers,
  onSubmit,
  onClose,
  isEditing
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nom" className="text-right">
            Nom*
          </Label>
          <Input
            id="nom"
            value={formValues.nom}
            onChange={(e) => setFormValues({...formValues, nom: e.target.value})}
            className="col-span-3"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description*
          </Label>
          <Textarea
            id="description"
            value={formValues.description}
            onChange={(e) => setFormValues({...formValues, description: e.target.value})}
            className="col-span-3"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="session" className="text-right">
            Session*
          </Label>
          <Select 
            value={formValues.sessionId}
            onValueChange={(value) => {
              setFormValues({...formValues, sessionId: value, palierId: undefined});
              setSelectedSessionId(value);
            }}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionner une session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map(session => (
                <SelectItem key={session.id} value={session.id}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="palier" className="text-right">
            Trimestre
          </Label>
          <Select 
            value={formValues.palierId}
            onValueChange={(value) => setFormValues({...formValues, palierId: value === "no-palier" ? undefined : value})}
            disabled={!formValues.sessionId}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionner un trimestre (optionnel)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-palier">Aucun trimestre spécifique</SelectItem>
              {filteredPaliers.map(palier => (
                <SelectItem key={palier.id} value={palier.id}>
                  {palier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantite" className="text-right">
            Quantité en stock
          </Label>
          <Input
            id="quantite"
            type="number"
            value={formValues.quantite || ''}
            onChange={(e) => setFormValues({...formValues, quantite: e.target.value ? parseInt(e.target.value) : undefined})}
            className="col-span-3"
            placeholder="Optionnel"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="montant" className="text-right">
            Montant*
          </Label>
          <Input
            id="montant"
            type="number"
            value={formValues.montant}
            onChange={(e) => setFormValues({...formValues, montant: parseFloat(e.target.value) || 0})}
            className="col-span-3"
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default FraisForm;
