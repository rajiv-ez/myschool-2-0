
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { Article } from './StockTypes';
import { format } from "date-fns";

interface ArticleTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  onEdit,
  onDelete
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>État</TableHead>
            <TableHead>Date d'achat</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Aucun article trouvé
              </TableCell>
            </TableRow>
          ) : (
            articles.map(article => (
              <TableRow key={article.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{article.nom}</div>
                    <div className="text-sm text-gray-500">{article.description}</div>
                  </div>
                </TableCell>
                <TableCell>{article.categorie}</TableCell>
                <TableCell>
                  <Badge variant={article.quantite <= 0 ? "destructive" : article.quantite < 5 ? "outline" : "default"}>
                    {article.quantite}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    article.etat === 'Neuf' ? "default" : 
                    article.etat === 'Bon état' ? "secondary" : 
                    article.etat === 'Utilisé' ? "outline" : 
                    article.etat === 'À réparer' ? "destructive" : 
                    "destructive"
                  }>
                    {article.etat}
                  </Badge>
                </TableCell>
                <TableCell>{format(article.dateAchat, "dd/MM/yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(article)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(article.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArticleTable;
