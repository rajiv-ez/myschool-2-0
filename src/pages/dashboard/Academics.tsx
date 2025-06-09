
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layers, Grid, School, GraduationCap, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Niveau, Filiere, Specialite, Classe } from '@/types/academic';

// Données fictives basées sur les vrais types avec description pour Niveau
const niveauxData: (Niveau & { description?: string })[] = [
  { id: 1, nom: 'Maternelle', description: 'De 3 à 5 ans' },
  { id: 2, nom: 'Primaire', description: 'De 6 à 11 ans' },
  { id: 3, nom: 'Collège', description: 'De 12 à 15 ans' },
  { id: 4, nom: 'Lycée', description: 'De 16 à 18 ans' },
];

const filieresData: Filiere[] = [
  { id: 1, niveau: 2, nom: 'Générale Primaire', description: 'Formation générale du primaire' },
  { id: 2, niveau: 3, nom: 'Générale Collège', description: 'Formation générale du collège' },
  { id: 3, niveau: 4, nom: 'Scientifique', description: 'Formation scientifique' },
  { id: 4, niveau: 4, nom: 'Littéraire', description: 'Formation littéraire' },
  { id: 5, niveau: 4, nom: 'Économique et Social', description: 'Formation économique et sociale' },
];

const specialitesData: Specialite[] = [
  { id: 1, filiere: 1, nom: 'Standard', description: 'Spécialité standard primaire' },
  { id: 2, filiere: 2, nom: 'Standard', description: 'Spécialité standard collège' },
  { id: 3, filiere: 3, nom: 'Mathématiques-Physique', description: 'Spécialité maths-physique' },
  { id: 4, filiere: 3, nom: 'Sciences Naturelles', description: 'Spécialité sciences naturelles' },
  { id: 5, filiere: 4, nom: 'Philosophie', description: 'Spécialité philosophie' },
  { id: 6, filiere: 4, nom: 'Lettres Classiques', description: 'Spécialité lettres classiques' },
  { id: 7, filiere: 5, nom: 'Économie-Gestion', description: 'Spécialité économie-gestion' },
];

const classesData: Classe[] = [
  { id: 1, specialite: 1, nom: 'CP', description: 'Cours Préparatoire' },
  { id: 2, specialite: 1, nom: 'CE1', description: 'Cours Élémentaire 1ère année' },
  { id: 3, specialite: 1, nom: 'CE2', description: 'Cours Élémentaire 2ème année' },
  { id: 4, specialite: 1, nom: 'CM1', description: 'Cours Moyen 1ère année' },
  { id: 5, specialite: 1, nom: 'CM2', description: 'Cours Moyen 2ème année' },
  { id: 6, specialite: 2, nom: '6ème', description: 'Sixième' },
  { id: 7, specialite: 2, nom: '5ème', description: 'Cinquième' },
  { id: 8, specialite: 2, nom: '4ème', description: 'Quatrième' },
  { id: 9, specialite: 2, nom: '3ème', description: 'Troisième' },
  { id: 10, specialite: 3, nom: 'Seconde S', description: 'Seconde Scientifique' },
  { id: 11, specialite: 3, nom: 'Première S', description: 'Première Scientifique' },
  { id: 12, specialite: 3, nom: 'Terminale S', description: 'Terminale Scientifique' },
];

const Academics: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('niveaux');
  
  // États pour les filtres et recherche
  const [searchTerms, setSearchTerms] = useState({
    niveaux: '',
    filieres: '',
    specialites: '',
    classes: ''
  });
  const [selectedFilters, setSelectedFilters] = useState({
    filiereNiveau: 'all',
    specialiteFiliere: 'all',
    classeSpecialite: 'all'
  });

  // États pour les données filtrées
  const [filteredNiveaux, setFilteredNiveaux] = useState(niveauxData);
  const [filteredFilieres, setFilteredFilieres] = useState(filieresData);
  const [filteredSpecialites, setFilteredSpecialites] = useState(specialitesData);
  const [filteredClasses, setFilteredClasses] = useState(classesData);

  // Fonctions utilitaires
  const getNiveauName = (id: number) => {
    return niveauxData.find(n => n.id === id)?.nom || 'Inconnu';
  };

  const getFiliereName = (id: number) => {
    return filieresData.find(f => f.id === id)?.nom || 'Inconnue';
  };

  const getSpecialiteName = (id: number) => {
    return specialitesData.find(s => s.id === id)?.nom || 'Inconnue';
  };

  // Fonctions de filtrage
  const applyNiveauxFilter = () => {
    let result = [...niveauxData];
    if (searchTerms.niveaux) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.niveaux.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerms.niveaux.toLowerCase()))
      );
    }
    setFilteredNiveaux(result);
  };

  const applyFilieresFilter = () => {
    let result = [...filieresData];
    
    if (searchTerms.filieres) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.filieres.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerms.filieres.toLowerCase())
      );
    }
    
    if (selectedFilters.filiereNiveau !== 'all') {
      const niveauId = parseInt(selectedFilters.filiereNiveau);
      result = result.filter(item => item.niveau === niveauId);
    }
    
    setFilteredFilieres(result);
  };

  const applySpecialitesFilter = () => {
    let result = [...specialitesData];
    
    if (searchTerms.specialites) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.specialites.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerms.specialites.toLowerCase())
      );
    }
    
    if (selectedFilters.specialiteFiliere !== 'all') {
      const filiereId = parseInt(selectedFilters.specialiteFiliere);
      result = result.filter(item => item.filiere === filiereId);
    }
    
    setFilteredSpecialites(result);
  };

  const applyClassesFilter = () => {
    let result = [...classesData];
    
    if (searchTerms.classes) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.classes.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerms.classes.toLowerCase())
      );
    }
    
    if (selectedFilters.classeSpecialite !== 'all') {
      const specialiteId = parseInt(selectedFilters.classeSpecialite);
      result = result.filter(item => item.specialite === specialiteId);
    }
    
    setFilteredClasses(result);
  };

  // Gestionnaires d'événements
  const handleSearchChange = (tab: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [tab]: value }));
  };

  const resetFilters = (tab: string) => {
    switch (tab) {
      case 'niveaux':
        setSearchTerms(prev => ({ ...prev, niveaux: '' }));
        setFilteredNiveaux(niveauxData);
        break;
      case 'filieres':
        setSearchTerms(prev => ({ ...prev, filieres: '' }));
        setSelectedFilters(prev => ({ ...prev, filiereNiveau: 'all' }));
        setFilteredFilieres(filieresData);
        break;
      case 'specialites':
        setSearchTerms(prev => ({ ...prev, specialites: '' }));
        setSelectedFilters(prev => ({ ...prev, specialiteFiliere: 'all' }));
        setFilteredSpecialites(specialitesData);
        break;
      case 'classes':
        setSearchTerms(prev => ({ ...prev, classes: '' }));
        setSelectedFilters(prev => ({ ...prev, classeSpecialite: 'all' }));
        setFilteredClasses(classesData);
        break;
    }
  };

  const handleAction = (action: string, type: string, item?: any) => {
    toast({
      title: `${action} ${type}`,
      description: `Action "${action}" pour ${type} ${item ? `ID ${item.id}` : ''}`,
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Structure Académique</h2>
          <p className="text-muted-foreground">Gérez les niveaux, filières, spécialités et classes de votre établissement</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleAction('Créer', activeTab)}>
          <Plus size={16} />
          {activeTab === 'niveaux' && 'Nouveau Niveau'}
          {activeTab === 'filieres' && 'Nouvelle Filière'}
          {activeTab === 'specialites' && 'Nouvelle Spécialité'}
          {activeTab === 'classes' && 'Nouvelle Classe'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="niveaux" className="flex items-center gap-2">
            <Layers size={16} />
            <span className="hidden sm:inline">Niveaux</span>
            <span className="sm:hidden">Niv.</span>
          </TabsTrigger>
          <TabsTrigger value="filieres" className="flex items-center gap-2">
            <GraduationCap size={16} />
            <span className="hidden sm:inline">Filières</span>
            <span className="sm:hidden">Fil.</span>
          </TabsTrigger>
          <TabsTrigger value="specialites" className="flex items-center gap-2">
            <Grid size={16} />
            <span className="hidden sm:inline">Spécialités</span>
            <span className="sm:hidden">Spé.</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <School size={16} />
            <span className="hidden sm:inline">Classes</span>
            <span className="sm:hidden">Classes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="niveaux">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Layers size={18} />
                  Niveaux d'Enseignement
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un niveau..."
                      value={searchTerms.niveaux}
                      onChange={(e) => handleSearchChange('niveaux', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" onClick={applyNiveauxFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('niveaux')}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNiveaux.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Voir', 'niveau', item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Modifier', 'niveau', item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Supprimer', 'niveau', item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filieres">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap size={18} />
                  Filières
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une filière..."
                      value={searchTerms.filieres}
                      onChange={(e) => handleSearchChange('filieres', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilters.filiereNiveau} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, filiereNiveau: value }))
                  }>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous niveaux</SelectItem>
                      {niveauxData.map(niveau => (
                        <SelectItem key={niveau.id} value={niveau.id.toString()}>
                          {niveau.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={applyFilieresFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('filieres')}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilieres.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{getNiveauName(item.niveau)}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Voir', 'filière', item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Modifier', 'filière', item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Supprimer', 'filière', item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specialites">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Grid size={18} />
                  Spécialités
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une spécialité..."
                      value={searchTerms.specialites}
                      onChange={(e) => handleSearchChange('specialites', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilters.specialiteFiliere} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, specialiteFiliere: value }))
                  }>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filière" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes filières</SelectItem>
                      {filieresData.map(filiere => (
                        <SelectItem key={filiere.id} value={filiere.id.toString()}>
                          {filiere.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={applySpecialitesFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('specialites')}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Filière</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSpecialites.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{getFiliereName(item.filiere)}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Voir', 'spécialité', item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Modifier', 'spécialité', item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Supprimer', 'spécialité', item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <School size={18} />
                  Classes
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une classe..."
                      value={searchTerms.classes}
                      onChange={(e) => handleSearchChange('classes', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilters.classeSpecialite} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, classeSpecialite: value }))
                  }>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes spécialités</SelectItem>
                      {specialitesData.map(specialite => (
                        <SelectItem key={specialite.id} value={specialite.id.toString()}>
                          {specialite.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={applyClassesFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('classes')}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Spécialité</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{getSpecialiteName(item.specialite)}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Voir', 'classe', item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Modifier', 'classe', item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Supprimer', 'classe', item)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Academics;
