
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

interface CategoryFormProps {
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
  onClose: () => void;
  isEditing: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  newCategory,
  setNewCategory,
  handleSubmit,
  onClose,
  isEditing
}) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categoryName" className="text-right">
            Nom
          </Label>
          <Input
            id="categoryName"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </Button>
      </DialogFooter>
    </>
  );
};

export default CategoryForm;
