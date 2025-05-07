
import React, { useState } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Badge } from "@/components/ui/badge";
import CategorySection from './CategorySection';
import InventorySection from './InventorySection';
import DemandeTable from './DemandeTable';
import RejectModal from './RejectModal';
import { Article, Personne, Demande } from './StockTypes';

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
  const [personnes] = useState<Personne[]>([
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
          <CategorySection 
            categories={categories}
            articles={articles}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            isAddCategoryModalOpen={isAddCategoryModalOpen}
            setIsAddCategoryModalOpen={setIsAddCategoryModalOpen}
            editingCategory={editingCategory}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleSubmitCategory={handleSubmitCategory}
          />
        </TabsContent>
        
        <TabsContent value="inventaire">
          <InventorySection 
            articles={filteredArticles}
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            formValues={formValues}
            setFormValues={setFormValues}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            currentArticle={currentArticle}
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="demandes">
          <DemandeTable 
            demandes={demandes}
            onApprove={handleApprove}
            onOpenRejectModal={handleOpenRejectModal}
          />
        </TabsContent>
      </Tabs>
      
      {/* Modal de rejet de demande */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <RejectModal 
          motifRefus={motifRefus}
          setMotifRefus={setMotifRefus}
          onReject={handleReject}
          onClose={() => setIsRejectModalOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default GestionStock;
