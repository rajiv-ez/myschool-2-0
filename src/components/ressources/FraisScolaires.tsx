
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Search, Plus, Edit, Trash2, Filter, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApiWithFallback } from '@/hooks/useApiWithFallback';
import { academicService } from '@/services/academicService';
import { Session, Palier, FraisScolaire } from '@/types';

const FraisScolaires: React.FC = () => {
  const { toast } = useToast();

  // Utilisation du hook pour récupérer les sessions et paliers
  const { 
    data: sessions, 
    loading: sessionsLoading, 
    fromApi: sessionsFromApi 
  } = useApiWithFallback(() => academicService.getSessions(), []);

  const { 
    data: paliers, 
    loading: paliersLoading, 
    fromApi: paliersFromApi 
  } = useApiWithFallback(() => academicService.getPaliers(), []);

  // Données fictives pour les frais scolaires (en attendant le service backend)
  const [fraisList, setFraisList] = useState<FraisScolaire[]>([
    { 
      id: 1, 
      nom: 'Frais d\'inscription', 
      description: 'Frais d\'inscription pour l\'année scolaire', 
      session: 1,
      palier: 1,
      montant: '50000',
      quantite: 1,
      est_actif: true,
      est_immateriel: false,
      est_obligatoire: true,
      concerne_toutes_classes: false,
      date_creation: '2024-09-01',
      echeance: '2024-10-01',
      classes: []
    },
    { 
      id: 2, 
      nom: 'Mensualité Octobre', 
      description: 'Mensualité pour le mois d\'octobre', 
      session: 1,
      palier: 1,
      montant: '25000',
      quantite: 1,
      est_actif: true,
      est_immateriel: false,
      est_obligatoire: true,
      concerne_toutes_classes: false,
      date_creation: '2024-09-01',
      echeance: '2024-10-01',
      classes: []
    }
  ]);

  // State for the form dialog
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFrais, setCurrentFrais] = useState<FraisScolaire | null>(null);
  const [selectedsession, setSelectedsession] = useState<string>('');
  const [filtersession, setFiltersession] = useState<string>('all');
  const [filteredFrais, setFilteredFrais] = useState<FraisScolaire[]>(fraisList);

  // Form values
  const [formValues, setFormValues] = useState<Omit<FraisScolaire, 'id'>>({
    nom: '',
    description: '',
    session: 0,
    montant: '0',
    quantite: 1,
    est_actif: true,
    est_immateriel: false,
    est_obligatoire: true,
    concerne_toutes_classes: false,
    palier: undefined,
    date_creation: '',
    echeance: '',
    classes: [],
  });

  // Filter paliers based on selected session
  const filteredPaliers = selectedsession && paliers
    ? paliers.filter(p => String(p.session) === String(selectedsession))
    : [];

  // Reset form values
  const resetForm = () => {
    setFormValues({
      nom: '',
      description: '',
      session: 0,
      montant: '0',
      quantite: 1,
      est_actif: true,
      est_immateriel: false,
      est_obligatoire: true,
      concerne_toutes_classes: false,
      palier: undefined,
      date_creation: '',
      echeance: '',
      classes: [],
    });
    setSelectedsession('');
    setCurrentFrais(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formValues.nom ||
      !formValues.description ||
      !formValues.session ||
      Number(formValues.montant) <= 0
    ) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (currentFrais) {
      // Update existing
      setFraisList(prev => prev.map(f => 
        f.id === currentFrais.id ? { ...formValues, id: currentFrais.id } : f
      ));
      toast({
        title: "Frais mis à jour",
        description: `${formValues.nom} a été mis à jour avec succès`
      });
    } else {
      // Create new
      const newFrais: FraisScolaire = {
        ...formValues,
        id: Number(uuidv4())
      };
      setFraisList(prev => [...prev, newFrais]);
      toast({
        title: "Frais ajouté",
        description: `${formValues.nom} a été ajouté avec succès`
      });
    }

    setIsOpen(false);
    resetForm();
  };

  // Handle edit action
  const handleEdit = (frais: FraisScolaire) => {
    setCurrentFrais(frais);
    setFormValues({
          nom: frais.nom,
          description: frais.description,
          session: frais.session,
          palier: frais.palier,
          quantite: frais.quantite,
          montant: frais.montant,
          est_actif: frais.est_actif,
          est_immateriel: frais.est_immateriel,
          est_obligatoire: frais.est_obligatoire,
          concerne_toutes_classes: frais.concerne_toutes_classes,
          date_creation: frais.date_creation,
          echeance: frais.echeance,
          classes: frais.classes,
        });
    setSelectedsession(String(frais.session));
    setIsOpen(true);
  };

  // Handle delete action
  const handleDelete = (id: number) => {
    const fraisToDelete = fraisList.find(f => Number(f.id) === Number(id));
    if (fraisToDelete) {
      setFraisList(prev => prev.filter(f => Number(f.id) !== Number(id)));
      toast({
        title: "Frais supprimé",
        description: `${fraisToDelete.nom} a été supprimé`
      });
    }
  };

  // Apply filters (search and session)
  useEffect(() => {
    let result = [...fraisList];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(frais => 
        frais.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        frais.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by session
    if (filtersession && filtersession !== 'all') {
      result = result.filter(frais => Number(frais.session) === Number(filtersession));
    }
    
    setFilteredFrais(result);
  }, [searchQuery, filtersession, fraisList]);

  // Get session and palier names for display
  const getSessionName = (id: number) => {
    return sessions?.find(s => Number(s.id) === Number(id))?.nom || 'Session inconnue';
  };

  const getPalierName = (session: number, palier?: number) => {
    if (!palier || !paliers) return '-';
    return paliers.find(p => Number(p.id) === Number(palier))?.nom || '-';
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFiltersession('all');
    
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été réinitialisés"
    });
  };

  const isOnline = sessionsFromApi || paliersFromApi;

  return (
    <div className="space-y-6">
      {/* Indicateur de statut de connexion */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Frais Scolaires</h2>
          <p className="text-muted-foreground">{filteredFrais.length} frais trouvés</p>
        </div>
        <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-2">
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? "En ligne" : "Hors ligne"}
        </Badge>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Filtrer les frais scolaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid grid-cols-1 gap-2 flex-1">
              <Label>Session</Label>
              <Select value={filtersession} onValueChange={setFiltersession} disabled={sessionsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sessions</SelectItem>
                  {sessions?.map(session => (
                    <SelectItem key={session.id} value={String(session.id)}>
                      {session.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative flex-1">
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Rechercher un frais..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                <span>Réinitialiser</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Frais Scolaires</h2>
          <p className="text-muted-foreground">{filteredFrais.length} frais trouvés</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsOpen(true);
            }}>
              <Plus size={16} />
              <span>Ajouter un frais</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{currentFrais ? "Modifier un frais" : "Ajouter un frais"}</DialogTitle>
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
                  <Label htmlFor="session" className="text-right">
                    Session*
                  </Label>
                  <Select 
                    value={String(formValues.session)}
                    onValueChange={(value) => {
                      setFormValues({...formValues, session: Number(value), palier: undefined});
                      setSelectedsession(value);
                    }}
                    disabled={sessionsLoading}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions?.map(session => (
                        <SelectItem key={session.id} value={String(session.id)}>
                          {session.nom}
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
                    value={formValues.palier !== undefined ? String(formValues.palier) : "no-palier"}
                    onValueChange={(value) => setFormValues({...formValues, palier: value === "no-palier" ? undefined : Number(value)})}
                    disabled={!formValues.session || paliersLoading}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un trimestre (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-palier">Aucun trimestre spécifique</SelectItem>
                      {filteredPaliers.map(palier => (
                        <SelectItem key={palier.id} value={String(palier.id)}>
                          {palier.nom}
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
                    onChange={(e) => setFormValues({...formValues, montant: String(parseFloat(e.target.value)) || '0'})}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {currentFrais ? "Mettre à jour" : "Ajouter"}
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
              <TableHead>Session</TableHead>
              <TableHead>Trimestre</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFrais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucun frais trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredFrais.map(frais => (
                <TableRow key={frais.id}>
                  <TableCell className="font-medium">{frais.nom}</TableCell>
                  <TableCell>{frais.description}</TableCell>
                  <TableCell>{getSessionName((frais.session))}</TableCell>
                  <TableCell>{getPalierName(frais.session, frais.palier)}</TableCell>
                  <TableCell>{frais.quantite !== undefined ? frais.quantite : '-'}</TableCell>
                  <TableCell className="text-right">{frais.montant.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(frais)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(frais.id)}>
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
    </div>
  );
};

export default FraisScolaires;
