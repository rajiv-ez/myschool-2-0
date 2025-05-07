
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Article } from './StockTypes';

interface ArticleFormProps {
  formValues: Omit<Article, 'id'>;
  setFormValues: React.Dispatch<React.SetStateAction<Omit<Article, 'id'>>>;
  categories: string[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  formValues,
  setFormValues,
  categories,
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
          <Label htmlFor="categorie" className="text-right">
            Catégorie*
          </Label>
          <Select 
            value={formValues.categorie}
            onValueChange={(value) => setFormValues({...formValues, categorie: value})}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantite" className="text-right">
            Quantité*
          </Label>
          <Input
            id="quantite"
            type="number"
            value={formValues.quantite}
            onChange={(e) => setFormValues({...formValues, quantite: parseInt(e.target.value) || 0})}
            className="col-span-3"
            required
            min={0}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dateAchat" className="text-right">
            Date d'achat
          </Label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {formValues.dateAchat ? (
                    format(formValues.dateAchat, "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formValues.dateAchat}
                  onSelect={(date) => date && setFormValues({...formValues, dateAchat: date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="etat" className="text-right">
            État*
          </Label>
          <Select 
            value={formValues.etat}
            onValueChange={(value) => setFormValues({
              ...formValues, 
              etat: value as 'Neuf' | 'Bon état' | 'Utilisé' | 'À réparer' | 'Hors service'
            })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionner l'état" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Neuf">Neuf</SelectItem>
              <SelectItem value="Bon état">Bon état</SelectItem>
              <SelectItem value="Utilisé">Utilisé</SelectItem>
              <SelectItem value="À réparer">À réparer</SelectItem>
              <SelectItem value="Hors service">Hors service</SelectItem>
            </SelectContent>
          </Select>
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

export default ArticleForm;
