
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
import { Building, Home, DoorClosed, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';

// Données fictives basées sur les vrais types
const succursalesData: Succursale[] = [
  { 
    id: 1, 
    nom: 'Campus Principal', 
    adresse: '123 Avenue de l\'Éducation', 
    ville: 'Libreville', 
    pays: 'Gabon',
    est_siege: true 
  },
  { 
    id: 2, 
    nom: 'Campus Nord', 
    adresse: '45 Rue des Sciences', 
    ville: 'Libreville', 
    pays: 'Gabon',
    est_siege: false 
  },
  { 
    id: 3, 
    nom: 'Annexe Port-Gentil', 
    adresse: '12 Boulevard de la Mer', 
    ville: 'Port-Gentil', 
    pays: 'Gabon',
    est_siege: false 
  },
];

const batimentsData: Batiment[] = [
  { id: 1, succursale: 1, nom: 'Bâtiment A' },
  { id: 2, succursale: 1, nom: 'Bâtiment B' },
  { id: 3, succursale: 2, nom: 'Bâtiment Principal' },
  { id: 4, succursale: 3, nom: 'Bloc Unique' },
];

const sallesData: Salle[] = [
  { id: 1, batiment: 1, nom: 'Salle 101', capacite: 35 },
  { id: 2, batiment: 1, nom: 'Salle 102', capacite: 30 },
  { id: 3, batiment: 2, nom: 'Laboratoire 201', capacite: 25 },
  { id: 4, batiment: 3, nom: 'Amphithéâtre', capacite: 150 },
  { id: 5, batiment: 4, nom: 'Salle 001', capacite: 40 },
];

const Locaux: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('succursales');
  
  // États pour les filtres et recherche
  const [searchTerms, setSearchTerms] = useState({
    succursales: '',
    batiments: '',
    salles: ''
  });
  const [selectedFilters, setSelectedFilters] = useState({
    batimentSuccursale: 'all',
    salleCapacite: 'all'
  });

  // États pour les données filtrées
  const [filteredSuccursales, setFilteredSuccursales] = useState(succursalesData);
  const [filteredBatiments, setFilteredBatiments] = useState(batimentsData);
  const [filteredSalles, setFilteredSalles] = useState(sallesData);

  // Fonctions utilitaires
  const getSuccursaleName = (id: number) => {
    return succursalesData.find(s => s.id === id)?.nom || 'Inconnue';
  };

  const getBatimentName = (id: number) => {
    return batimentsData.find(b => b.id === id)?.nom || 'Inconnu';
  };

  // Fonctions de filtrage
  const applySuccursalesFilter = () => {
    let result = [...succursalesData];
    if (searchTerms.succursales) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.succursales.toLowerCase()) ||
        item.ville.toLowerCase().includes(searchTerms.succursales.toLowerCase()) ||
        item.adresse.toLowerCase().includes(searchTerms.succursales.toLowerCase())
      );
    }
    setFilteredSuccursales(result);
  };

  const applyBatimentsFilter = () => {
    let result = [...batimentsData];
    
    if (searchTerms.batiments) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.batiments.toLowerCase())
      );
    }
    
    if (selectedFilters.batimentSuccursale !== 'all') {
      const succursaleId = parseInt(selectedFilters.batimentSuccursale);
      result = result.filter(item => item.succursale === succursaleId);
    }
    
    setFilteredBatiments(result);
  };

  const applySallesFilter = () => {
    let result = [...sallesData];
    
    if (searchTerms.salles) {
      result = result.filter(item => 
        item.nom.toLowerCase().includes(searchTerms.salles.toLowerCase())
      );
    }
    
    if (selectedFilters.salleCapacite !== 'all') {
      const capaciteRange = selectedFilters.salleCapacite;
      result = result.filter(item => {
        switch (capaciteRange) {
          case 'small': return item.capacite <= 30;
          case 'medium': return item.capacite > 30 && item.capacite <= 100;
          case 'large': return item.capacite > 100;
          default: return true;
        }
      });
    }
    
    setFilteredSalles(result);
  };

  // Gestionnaires d'événements
  const handleSearchChange = (tab: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [tab]: value }));
  };

  const resetFilters = (tab: string) => {
    switch (tab) {
      case 'succursales':
        setSearchTerms(prev => ({ ...prev, succursales: '' }));
        setFilteredSuccursales(succursalesData);
        break;
      case 'batiments':
        setSearchTerms(prev => ({ ...prev, batiments: '' }));
        setSelectedFilters(prev => ({ ...prev, batimentSuccursale: 'all' }));
        setFilteredBatiments(batimentsData);
        break;
      case 'salles':
        setSearchTerms(prev => ({ ...prev, salles: '' }));
        setSelectedFilters(prev => ({ ...prev, salleCapacite: 'all' }));
        setFilteredSalles(sallesData);
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
          <h2 className="text-xl font-semibold">Gestion des Locaux</h2>
          <p className="text-muted-foreground">Gérez les succursales, bâtiments et salles de votre établissement</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => handleAction('Créer', activeTab)}>
          <Plus size={16} />
          {activeTab === 'succursales' && 'Nouvelle Succursale'}
          {activeTab === 'batiments' && 'Nouveau Bâtiment'}
          {activeTab === 'salles' && 'Nouvelle Salle'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="succursales" className="flex items-center gap-2">
            <Building size={16} />
            <span className="hidden sm:inline">Succursales</span>
            <span className="sm:hidden">Succ.</span>
          </TabsTrigger>
          <TabsTrigger value="batiments" className="flex items-center gap-2">
            <Home size={16} />
            <span className="hidden sm:inline">Bâtiments</span>
            <span className="sm:hidden">Bât.</span>
          </TabsTrigger>
          <TabsTrigger value="salles" className="flex items-center gap-2">
            <DoorClosed size={16} />
            <span className="hidden sm:inline">Salles</span>
            <span className="sm:hidden">Salles</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="succursales">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Building size={18} />
                  Succursales
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une succursale..."
                      value={searchTerms.succursales}
                      onChange={(e) => handleSearchChange('succursales', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" onClick={applySuccursalesFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('succursales')}>
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
                      <TableHead>Adresse</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Siège</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuccursales.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{item.adresse}</TableCell>
                        <TableCell>{item.ville}</TableCell>
                        <TableCell>{item.pays}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.est_siege ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.est_siege ? 'Siège' : 'Annexe'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Voir', 'succursale', item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Modifier', 'succursale', item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Supprimer', 'succursale', item)}>
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
        
        <TabsContent value="batiments">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Home size={18} />
                  Bâtiments
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un bâtiment..."
                      value={searchTerms.batiments}
                      onChange={(e) => handleSearchChange('batiments', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilters.batimentSuccursale} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, batimentSuccursale: value }))
                  }>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Succursale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {succursalesData.map(succursale => (
                        <SelectItem key={succursale.id} value={succursale.id.toString()}>
                          {succursale.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={applyBatimentsFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('batiments')}>
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
                      <TableHead>Succursale</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatiments.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{getSuccursaleName(item.succursale)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Voir', 'bâtiment', item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Modifier', 'bâtiment', item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Supprimer', 'bâtiment', item)}>
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
        
        <TabsContent value="salles">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <DoorClosed size={18} />
                  Salles
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une salle..."
                      value={searchTerms.salles}
                      onChange={(e) => handleSearchChange('salles', e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedFilters.salleCapacite} onValueChange={(value) => 
                    setSelectedFilters(prev => ({ ...prev, salleCapacite: value }))
                  }>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Capacité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="small">≤ 30</SelectItem>
                      <SelectItem value="medium">31-100</SelectItem>
                      <SelectItem value="large">> 100</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={applySallesFilter}>
                    <Filter size={16} />
                  </Button>
                  <Button variant="outline" onClick={() => resetFilters('salles')}>
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
                      <TableHead>Bâtiment</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalles.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.nom}</TableCell>
                        <TableCell>{getBatimentName(item.batiment)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.capacite <= 30 ? 'bg-orange-100 text-orange-800' :
                            item.capacite <= 100 ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.capacite} places
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAction('Voir', 'salle', item)}>
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Modifier', 'salle', item)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAction('Supprimer', 'salle', item)}>
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

export default Locaux;
