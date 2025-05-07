
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from 'lucide-react';
import ArticleTable from './ArticleTable';
import ArticleForm from './ArticleForm';
import { Article } from './StockTypes';

interface InventorySectionProps {
  articles: Article[];
  categories: string[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  formValues: Omit<Article, 'id'>;
  setFormValues: React.Dispatch<React.SetStateAction<Omit<Article, 'id'>>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentArticle: Article | null;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleEdit: (article: Article) => void;
  handleDelete: (id: string) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({
  articles,
  categories,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  formValues,
  setFormValues,
  isOpen,
  setIsOpen,
  currentArticle,
  resetForm,
  handleSubmit,
  handleEdit,
  handleDelete
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Rechercher un article..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsOpen(true);
            }}>
              <Plus size={16} />
              <span className="ml-2">Ajouter un article</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{currentArticle ? "Modifier un article" : "Ajouter un article"}</DialogTitle>
            </DialogHeader>
            <ArticleForm 
              formValues={formValues}
              setFormValues={setFormValues}
              categories={categories}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
              isEditing={!!currentArticle}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <ArticleTable 
        articles={articles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default InventorySection;
