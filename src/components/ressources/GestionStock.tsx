
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Search, Plus, Edit, Trash2, FileText } from 'lucide-react';

interface ArticleStock {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  quantite: number;
  dateAcquisition: string;
  assigneA?: string;
}

interface Utilisateur {
  id: string;
  nom: string;
  role: string;
}

interface DemandeArticle {
  id: string;
  articleId: string;
  utilisateurId: string;
  dateDemande: string;
  quantite: number;
  motif: string;
  status: 'en_attente' | 'approuvee' | 'refusee';
}

const GestionStock: React.FC = () => {
  const { toast } = useToast();
  
  // Articles de stock
  const [articles, setArticles] = useState<ArticleStock[]>([
    {
      id: '1',
      nom: 'Ordinateur portable Dell',
      description: 'Laptop Dell Latitude 5520',
      categorie: 'Informatique',
      quantite: 5,
      dateAcquisition: '2023-09-15',
    },
    {
      id: '2',
      nom: 'Marqueurs tableau blanc',
      description: 'Boîte de 12 marqueurs effaçables',
      categorie: 'Fournitures scolaires',
      quantite: 20,
      dateAcquisition: '2023-08-20',
    },
    {
      id: '3',
      nom: 'Minibus Toyota',
      description: 'Minibus 15 places pour transport scolaire',
      categorie: 'Transport',
      quantite: 1,
      dateAcquisition: '2022-05-10',
      assigneA: '2',
    },
  ]);

  // Utilisateurs pour l'assignation
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([
    { id: '1', nom: 'Jean Kouassi', role: 'Enseignant' },
    { id: '2', nom: 'Marie Okemba', role: 'Chauffeur' },
    { id: '3', nom: 'Paul Diallo', role: 'Administrateur' },
  ]);

  // Demandes d'articles
  const [demandes, setDemandes] = useState<DemandeArticle[]>([
    {
      id: '1',
      articleId: '1',
      utilisateurId: '1',
      dateDemande: '2023-10-20',
      quantite: 1,
      motif: 'Pour préparation de cours',
      status: 'en_attente',
    },
    {
      id: '2',
      articleId: '2',
      utilisateurId: '1',
      dateDemande: '2023-10-18',
      quantite: 2,
      motif: 'Pour tableau de classe',
      status: 'approuvee',
    },
  ]);

  // États pour le formulaire et le filtrage
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isDemandeDialogOpen, setIsDemandeDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorieFilter, setCategorieFilter] = useState<string>('');
  
  // État actuel pour l'édition
  const [currentArticle, setCurrentArticle] = useState<ArticleStock | null>(null);
  const [currentDemande, setCurrentDemande] = useState<DemandeArticle | null>(null);

  // Valeurs du formulaire pour les articles
  const [articleForm, setArticleForm] = useState<Omit<ArticleStock, 'id'>>({
    nom: '',
    description: '',
    categorie: '',
    quantite: 0,
    dateAcquisition: new Date().toISOString().split('T')[0],
  });

  // Valeurs du formulaire pour les demandes
  const [demandeForm, setDemandeForm] = useState<Omit<DemandeArticle, 'id' | 'status'>>({
    articleId: '',
    utilisateurId: '',
    dateDemande: new Date().toISOString().split('T')[0],
    quantite: 1,
    motif: '',
  });

  // Réinitialiser les formulaires
  const resetArticleForm = () => {
    setArticleForm({
      nom: '',
      description: '',
      categorie: '',
      quantite: 0,
      dateAcquisition: new Date().toISOString().split('T')[0],
    });
    setCurrentArticle(null);
  };

  const resetDemandeForm = () => {
    setDemandeForm({
      articleId: '',
      utilisateurId: '',
      dateDemande: new Date().toISOString().split('T')[0],
      quantite: 1,
      motif: '',
    });
    setCurrentDemande(null);
  };

  // Obtenir toutes les catégories uniques
  const categories = [...new Set(articles.map(a => a.categorie))];

  // Filtrer les articles par recherche et catégorie
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategorie = !categorieFilter || article.categorie === categorieFilter;
    return matchesSearch && matchesCategorie;
  });

  // Obtenir le nom d'un article par son ID
  const getArticleName = (id: string) => {
    return articles.find(a => a.id === id)?.nom || '';
  };

  // Obtenir le nom d'un utilisateur par son ID
  const getUserName = (id?: string) => {
    if (!id) return '-';
    return utilisateurs.find(u => u.id === id)?.nom || '';
  };

  // Gérer la soumission du formulaire d'article
  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!articleForm.nom || !articleForm.categorie || articleForm.quantite <= 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (currentArticle) {
      // Mettre à jour un article existant
      setArticles(prev => prev.map(a => 
        a.id === currentArticle.id ? { ...articleForm, id: currentArticle.id, assigneA: currentArticle.assigneA } : a
      ));
      toast({
        title: "Article mis à jour",
        description: `${articleForm.nom} a été mis à jour avec succès`
      });
    } else {
      // Créer un nouvel article
      const newArticle: ArticleStock = {
        ...articleForm,
        id: uuidv4()
      };
      setArticles(prev => [...prev, newArticle]);
      toast({
        title: "Article ajouté",
        description: `${articleForm.nom} a été ajouté à l'inventaire`
      });
    }

    setIsArticleDialogOpen(false);
    resetArticleForm();
  };

  // Gérer la soumission du formulaire de demande
  const handleDemandeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!demandeForm.articleId || !demandeForm.utilisateurId || !demandeForm.motif || demandeForm.quantite <= 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la disponibilité de l'article
    const article = articles.find(a => a.id === demandeForm.articleId);
    if (!article || article.quantite < demandeForm.quantite) {
      toast({
        title: "Quantité insuffisante",
        description: `La quantité demandée n'est pas disponible en stock`,
        variant: "destructive"
      });
      return;
    }

    const newDemande: DemandeArticle = {
      ...demandeForm,
      id: uuidv4(),
      status: 'en_attente'
    };
    
    setDemandes(prev => [...prev, newDemande]);
    toast({
      title: "Demande envoyée",
      description: `Votre demande a été enregistrée avec succès`
    });

    setIsDemandeDialogOpen(false);
    resetDemandeForm();
  };

  // Gérer l'assignation d'un article à un utilisateur
  const handleAssign = (articleId: string, utilisateurId: string) => {
    setArticles(prev => prev.map(a => 
      a.id === articleId ? { ...a, assigneA: utilisateurId === 'none' ? undefined : utilisateurId } : a
    ));

    const article = articles.find(a => a.id === articleId);
    const utilisateur = utilisateurId === 'none' 
      ? { nom: 'personne' } 
      : utilisateurs.find(u => u.id === utilisateurId);

    toast({
      title: "Article assigné",
      description: `${article?.nom} a été assigné à ${utilisateur?.nom}`
    });
  };

  // Gérer les actions sur les demandes
  const handleDemandeAction = (demandeId: string, action: 'approuvee' | 'refusee') => {
    const demande = demandes.find(d => d.id === demandeId);
    
    if (!demande) return;
    
    if (action === 'approuvee') {
      // Mettre à jour le stock si la demande est approuvée
      const article = articles.find(a => a.id === demande.articleId);
      if (article && article.quantite >= demande.quantite) {
        setArticles(prev => prev.map(a => 
          a.id === demande.articleId ? { ...a, quantite: a.quantite - demande.quantite } : a
        ));
      } else {
        toast({
          title: "Stock insuffisant",
          description: "La quantité demandée n'est plus disponible en stock",
          variant: "destructive"
        });
        return;
      }
    }
    
    setDemandes(prev => prev.map(d => 
      d.id === demandeId ? { ...d, status: action } : d
    ));
    
    toast({
      title: action === 'approuvee' ? "Demande approuvée" : "Demande refusée",
      description: `La demande de ${getUserName(demande.utilisateurId)} a été ${action === 'approuvee' ? 'approuvée' : 'refusée'}`
    });
  };

  // Gérer la suppression d'un article
  const handleDeleteArticle = (id: string) => {
    // Vérifier si l'article est associé à des demandes
    const hasRelatedDemands = demandes.some(d => d.articleId === id);
    
    if (hasRelatedDemands) {
      toast({
        title: "Suppression impossible",
        description: "Cet article est associé à des demandes",
        variant: "destructive"
      });
      return;
    }
    
    const articleToDelete = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(a => a.id !== id));
    
    toast({
      title: "Article supprimé",
      description: `${articleToDelete?.nom} a été supprimé de l'inventaire`
    });
  };

  return (
    <div>
      <Tabs defaultValue="inventaire">
        <TabsList className="mb-4">
          <TabsTrigger value="inventaire">Inventaire</TabsTrigger>
          <TabsTrigger value="demandes">
            Demandes
            {demandes.filter(d => d.status === 'en_attente').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {demandes.filter(d => d.status === 'en_attente').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Onglet Inventaire */}
        <TabsContent value="inventaire" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
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
              <Select value={categorieFilter} onValueChange={setCategorieFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetArticleForm();
                  setIsArticleDialogOpen(true);
                }}>
                  <Plus size={16} />
                  <span>Ajouter un article</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{currentArticle ? "Modifier un article" : "Ajouter un article"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleArticleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nom" className="text-right">
                        Nom*
                      </Label>
                      <Input
                        id="nom"
                        value={articleForm.nom}
                        onChange={(e) => setArticleForm({...articleForm, nom: e.target.value})}
                        className="col-span-3"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={articleForm.description}
                        onChange={(e) => setArticleForm({...articleForm, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categorie" className="text-right">
                        Catégorie*
                      </Label>
                      <Select 
                        value={articleForm.categorie}
                        onValueChange={(value) => setArticleForm({...articleForm, categorie: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 && (
                            categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))
                          )}
                          <SelectItem value="Nouvelle">
                            <div className="flex items-center">
                              <Plus size={14} className="mr-2" />
                              <Input
                                placeholder="Nouvelle catégorie"
                                className="w-36"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setArticleForm({...articleForm, categorie: e.target.value})}
                              />
                            </div>
                          </SelectItem>
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
                        min="1"
                        value={articleForm.quantite}
                        onChange={(e) => setArticleForm({...articleForm, quantite: parseInt(e.target.value) || 0})}
                        className="col-span-3"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dateAcquisition" className="text-right">
                        Date d'acquisition*
                      </Label>
                      <Input
                        id="dateAcquisition"
                        type="date"
                        value={articleForm.dateAcquisition}
                        onChange={(e) => setArticleForm({...articleForm, dateAcquisition: e.target.value})}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsArticleDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {currentArticle ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Date d'acquisition</TableHead>
                  <TableHead>Assigné à</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun article trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map(article => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.nom}</TableCell>
                      <TableCell>{article.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{article.categorie}</Badge>
                      </TableCell>
                      <TableCell>{article.quantite}</TableCell>
                      <TableCell>{new Date(article.dateAcquisition).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select 
                          value={article.assigneA || 'none'} 
                          onValueChange={(value) => handleAssign(article.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Non assigné" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Non assigné</SelectItem>
                            {utilisateurs.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.nom} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setCurrentArticle(article);
                              setArticleForm({
                                nom: article.nom,
                                description: article.description,
                                categorie: article.categorie,
                                quantite: article.quantite,
                                dateAcquisition: article.dateAcquisition,
                                assigneA: article.assigneA,
                              });
                              setIsArticleDialogOpen(true);
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteArticle(article.id)}
                          >
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
          
          <Dialog open={isDemandeDialogOpen} onOpenChange={setIsDemandeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText size={16} className="mr-2" />
                <span>Faire une demande d'article</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Demande d'article</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDemandeSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="article" className="text-right">
                      Article*
                    </Label>
                    <Select 
                      value={demandeForm.articleId}
                      onValueChange={(value) => setDemandeForm({...demandeForm, articleId: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un article" />
                      </SelectTrigger>
                      <SelectContent>
                        {articles
                          .filter(a => a.quantite > 0)
                          .map(article => (
                            <SelectItem key={article.id} value={article.id}>
                              {article.nom} (Dispo: {article.quantite})
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="utilisateur" className="text-right">
                      Demandeur*
                    </Label>
                    <Select 
                      value={demandeForm.utilisateurId}
                      onValueChange={(value) => setDemandeForm({...demandeForm, utilisateurId: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un demandeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {utilisateurs.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nom} ({user.role})
                          </SelectItem>
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
                      min="1"
                      value={demandeForm.quantite}
                      onChange={(e) => setDemandeForm({...demandeForm, quantite: parseInt(e.target.value) || 1})}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="motif" className="text-right">
                      Motif*
                    </Label>
                    <Textarea
                      id="motif"
                      value={demandeForm.motif}
                      onChange={(e) => setDemandeForm({...demandeForm, motif: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsDemandeDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Envoyer la demande
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Onglet Demandes */}
        <TabsContent value="demandes" className="space-y-6">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Date de demande</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune demande trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  demandes.map(demande => (
                    <TableRow key={demande.id}>
                      <TableCell className="font-medium">{getArticleName(demande.articleId)}</TableCell>
                      <TableCell>{getUserName(demande.utilisateurId)}</TableCell>
                      <TableCell>{new Date(demande.dateDemande).toLocaleDateString()}</TableCell>
                      <TableCell>{demande.quantite}</TableCell>
                      <TableCell>{demande.motif}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            demande.status === 'en_attente' ? 'outline' : 
                            demande.status === 'approuvee' ? 'default' : 'destructive'
                          }
                        >
                          {demande.status === 'en_attente' ? 'En attente' : 
                           demande.status === 'approuvee' ? 'Approuvée' : 'Refusée'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {demande.status === 'en_attente' && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDemandeAction(demande.id, 'approuvee')}
                            >
                              Approuver
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDemandeAction(demande.id, 'refusee')}
                            >
                              Refuser
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionStock;
