import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Search, Plus, Edit, Trash2, Check, X, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Article {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  quantite: number;
  assigneA?: Personne;
  dateAchat: Date;
  etat: 'Neuf' | 'Bon état' | 'Utilisé' | 'À réparer' | 'Hors service';
}

interface Personne {
  id: string;
  nom: string;
  prenom: string;
  avatar?: string;
  role: string;
}

interface Demande {
  id: string;
  demandeur: Personne;
  article: Article;
  quantite: number;
  date: Date;
  motif: string;
  statut: 'En attente' | 'Approuvée' | 'Refusée';
  motifRefus?: string;
}

const GestionStock: React.FC = () => {
  const { toast } = useToast();
  
  // États pour la gestion des catégories
  const [categories, setCategories] = useState<string[]>([
    "Matériel informatique", 
    "Fournitures de bureau", 
    "Mobilier", 
    "Matériel pédagogique", 
    "Matériel de nettoyage"
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{id: string, nom: string} | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  
  // États pour la gestion des articles
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      nom: 'Ordinateur portable HP',
      description: 'Ordinateur portable HP Pavilion 15 pouces',
      categorie: 'Matériel informatique',
      quantite: 5,
      dateAchat: new Date(2023, 5, 15),
      etat: 'Neuf'
    },
    {
      id: '2',
      nom: 'Tableau blanc',
      description: 'Tableau blanc magnétique 120x90cm',
      categorie: 'Mobilier',
      quantite: 10,
      dateAchat: new Date(2023, 2, 10),
      etat: 'Bon état'
    },
    {
      id: '3',
      nom: 'Pack de cahiers',
      description: 'Lot de 20 cahiers à grands carreaux',
      categorie: 'Fournitures de bureau',
      quantite: 25,
      dateAchat: new Date(2023, 8, 1),
      etat: 'Neuf'
    },
  ]);
  
  // Données factices pour les personnes
  const [personnes, setPersonnes] = useState<Personne[]>([
    { 
      id: '1', 
      nom: 'Ndong', 
      prenom: 'Paul', 
      role: 'Enseignant',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    { 
      id: '2', 
      nom: 'Obiang', 
      prenom: 'Marie', 
      role: 'Administrateur',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    { 
      id: '3', 
      nom: 'Mba', 
      prenom: 'Jean', 
      role: 'Personnel d\'entretien',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ]);
  
  // État pour les demandes
  const [demandes, setDemandes] = useState<Demande[]>([
    {
      id: '1',
      demandeur: personnes[0],
      article: articles[0],
      quantite: 1,
      date: new Date(2023, 9, 5),
      motif: "Besoin pour préparation des cours",
      statut: 'En attente'
    },
    {
      id: '2',
      demandeur: personnes[2],
      article: articles[1],
      quantite: 2,
      date: new Date(2023, 9, 3),
      motif: "Remplacement des tableaux usagés",
      statut: 'En attente'
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentDemande, setCurrentDemande] = useState<Demande | null>(null);
  const [motifRefus, setMotifRefus] = useState('');

  // Form values
  const [formValues, setFormValues] = useState<Omit<Article, 'id'>>({
    nom: '',
    description: '',
    categorie: '',
    quantite: 0,
    dateAchat: new Date(),
    etat: 'Neuf'
  });

  // Reset form values
  const resetForm = () => {
    setFormValues({
      nom: '',
      description: '',
      categorie: '',
      quantite: 0,
      dateAchat: new Date(),
      etat: 'Neuf'
    });
    setCurrentArticle(null);
  };

  // Handle form submission for articles
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.nom || !formValues.description || !formValues.categorie || formValues.quantite <= 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (currentArticle) {
      // Update existing
      setArticles(prev => prev.map(a => 
        a.id === currentArticle.id ? { ...formValues, id: currentArticle.id } : a
      ));
      toast({
        title: "Article mis à jour",
        description: `${formValues.nom} a été mis à jour avec succès`
      });
    } else {
      // Create new
      const newArticle: Article = {
        ...formValues,
        id: uuidv4()
      };
      setArticles(prev => [...prev, newArticle]);
      toast({
        title: "Article ajouté",
        description: `${formValues.nom} a été ajouté avec succès`
      });
    }

    setIsOpen(false);
    resetForm();
  };

  // Handle form submission for categories
  const handleSubmitCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    if (categories.includes(newCategory)) {
      toast({
        title: "Erreur",
        description: "Cette catégorie existe déjà",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      const oldCategory = editingCategory.nom;
      setCategories(prev => prev.map(c => c === oldCategory ? newCategory : c));
      
      // Update articles using this category
      setArticles(prev => prev.map(a => 
        a.categorie === oldCategory ? { ...a, categorie: newCategory } : a
      ));
      
      toast({
        title: "Catégorie mise à jour",
        description: `La catégorie a été renommée en "${newCategory}"`
      });
    } else {
      // Add new category
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Catégorie ajoutée",
        description: `La catégorie "${newCategory}" a été ajoutée avec succès`
      });
    }

    setNewCategory("");
    setEditingCategory(null);
    setIsAddCategoryModalOpen(false);
  };

  // Handle edit action for articles
  const handleEdit = (article: Article) => {
    setCurrentArticle(article);
    setFormValues({
      nom: article.nom,
      description: article.description,
      categorie: article.categorie,
      quantite: article.quantite,
      dateAchat: article.dateAchat,
      etat: article.etat,
      assigneA: article.assigneA
    });
    setIsOpen(true);
  };

  // Handle edit action for categories
  const handleEditCategory = (category: string) => {
    setEditingCategory({ id: uuidv4(), nom: category });
    setNewCategory(category);
    setIsAddCategoryModalOpen(true);
  };

  // Handle delete action for articles
  const handleDelete = (id: string) => {
    const articleToDelete = articles.find(a => a.id === id);
    if (articleToDelete) {
      // Check if article is in any demande
      const isInDemande = demandes.some(d => d.article.id === id);
      if (isInDemande) {
        toast({
          title: "Action impossible",
          description: "Cet article est lié à une ou plusieurs demandes",
          variant: "destructive"
        });
        return;
      }
      
      setArticles(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Article supprimé",
        description: `${articleToDelete.nom} a été supprimé`
      });
    }
  };

  // Handle delete action for categories
  const handleDeleteCategory = (category: string) => {
    // Check if category is used by any article
    const isUsed = articles.some(a => a.categorie === category);
    if (isUsed) {
      toast({
        title: "Action impossible",
        description: "Cette catégorie est utilisée par un ou plusieurs articles",
        variant: "destructive"
      });
      return;
    }
    
    setCategories(prev => prev.filter(c => c !== category));
    toast({
      title: "Catégorie supprimée",
      description: `La catégorie "${category}" a été supprimée`
    });
  };

  // Handle approve action for demandes
  const handleApprove = (id: string) => {
    setDemandes(prev => prev.map(d => {
      if (d.id === id) {
        // Réduire la quantité de l'article
        const updatedArticles = articles.map(a => {
          if (a.id === d.article.id) {
            return { ...a, quantite: Math.max(0, a.quantite - d.quantite) };
          }
          return a;
        });
        setArticles(updatedArticles);
        
        return { ...d, statut: 'Approuvée' };
      }
      return d;
    }));
    
    toast({
      title: "Demande approuvée",
      description: "La demande a été approuvée avec succès"
    });
  };

  // Handle reject modal opening
  const handleOpenRejectModal = (demande: Demande) => {
    setCurrentDemande(demande);
    setMotifRefus('');
    setIsRejectModalOpen(true);
  };

  // Handle reject action for demandes
  const handleReject = () => {
    if (!motifRefus.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un motif de refus",
        variant: "destructive"
      });
      return;
    }
    
    if (currentDemande) {
      setDemandes(prev => prev.map(d => 
        d.id === currentDemande.id ? { ...d, statut: 'Refusée', motifRefus } : d
      ));
      
      toast({
        title: "Demande refusée",
        description: "La demande a été refusée"
      });
      
      setIsRejectModalOpen(false);
      setCurrentDemande(null);
      setMotifRefus('');
    }
  };

  // Filter articles based on search query and category filter
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || article.categorie === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventaire">
        <TabsList className="mb-4">
          <TabsTrigger value="inventaire">Inventaire</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="demandes">
            Demandes
            {demandes.filter(d => d.statut === 'En attente').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {demandes.filter(d => d.statut === 'En attente').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
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
                  <Button variant="outline" onClick={() => {
                    setNewCategory("");
                    setEditingCategory(null);
                    setIsAddCategoryModalOpen(false);
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmitCategory}>
                    {editingCategory ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
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
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteCategory(category)}
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
        </TabsContent>
        
        <TabsContent value="inventaire">
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
                <form onSubmit={handleSubmit}>
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
                    <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
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
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead>Date d'achat</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun article trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map(article => (
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
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
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
        </TabsContent>

        <TabsContent value="demandes">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Date</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={demande.demandeur.avatar} />
                            <AvatarFallback>
                              {demande.demandeur.prenom.charAt(0)}{demande.demandeur.nom.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{demande.demandeur.prenom} {demande.demandeur.nom}</div>
                            <div className="text-sm text-gray-500">{demande.demandeur.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{demande.article.nom}</TableCell>
                      <TableCell>{demande.quantite}</TableCell>
                      <TableCell>{demande.motif}</TableCell>
                      <TableCell>{format(demande.date, "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={
                          demande.statut === 'Approuvée' ? "default" : 
                          demande.statut === 'Refusée' ? "destructive" : 
                          "outline"
                        }>
                          {demande.statut}
                        </Badge>
                        {demande.statut === 'Refusée' && demande.motifRefus && (
                          <div className="text-xs text-red-600 mt-1">
                            Motif: {demande.motifRefus}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {demande.statut === 'En attente' && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                              onClick={() => handleApprove(demande.id)}
                            >
                              <Check size={14} className="mr-1" />
                              Approuver
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                              onClick={() => handleOpenRejectModal(demande)}
                            >
                              <X size={14} className="mr-1" />
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
      
      {/* Modal de rejet de demande */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Refuser la demande</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="motifRefus" className="mb-2 block">
                Motif du refus*
              </Label>
              <Textarea
                id="motifRefus"
                value={motifRefus}
                onChange={(e) => setMotifRefus(e.target.value)}
                placeholder="Veuillez indiquer la raison du refus..."
                className="resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ce motif sera visible par le demandeur dans sa notification.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirmer le refus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionStock;
