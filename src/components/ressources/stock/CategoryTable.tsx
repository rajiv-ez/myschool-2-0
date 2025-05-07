
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Tag } from 'lucide-react';

interface CategoryTableProps {
  categories: string[];
  articles: any[]; // Using any to simplify
  onEdit: (category: string) => void;
  onDelete: (category: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  articles,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de la catégorie</TableHead>
            <TableHead>Nombre d'articles</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                Aucune catégorie trouvée
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => {
              const articlesCount = articles.filter(a => a.categorie === category).length;
              return (
                <TableRow key={category}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Tag size={16} className="mr-2 text-gray-500" />
                      {category}
                    </div>
                  </TableCell>
                  <TableCell>{articlesCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(category)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(category)}
                        disabled={articlesCount > 0}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
