
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import CategoryTable from './CategoryTable';
import CategoryForm from './CategoryForm';

interface CategorySectionProps {
  categories: string[];
  articles: any[]; // Using any to simplify
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  isAddCategoryModalOpen: boolean;
  setIsAddCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingCategory: { id: string, nom: string } | null;
  handleEditCategory: (category: string) => void;
  handleDeleteCategory: (category: string) => void;
  handleSubmitCategory: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  articles,
  newCategory,
  setNewCategory,
  isAddCategoryModalOpen,
  setIsAddCategoryModalOpen,
  editingCategory,
  handleEditCategory,
  handleDeleteCategory,
  handleSubmitCategory
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h3 className="text-lg font-medium">Catégories d'articles</h3>
        <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm 
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              handleSubmit={handleSubmitCategory}
              onClose={() => {
                setNewCategory("");
                setIsAddCategoryModalOpen(false);
              }}
              isEditing={!!editingCategory}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <CategoryTable 
        categories={categories}
        articles={articles}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
    </>
  );
};

export default CategorySection;
